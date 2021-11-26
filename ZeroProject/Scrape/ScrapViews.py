from rest_framework.views import APIView
from .Scrape import Scraper
from rest_framework.permissions import IsAuthenticated
from django.utils.functional import SimpleLazyObject
from apscheduler.schedulers.background import BackgroundScheduler
from rest_framework.response import Response
import datetime,math
from .models import *
from datetime import datetime as dt

def covertdate(date):
    date = date.split("–")
    for i in range(len(date)):
        date[i] = date[i].split(" ")
        date[i] = list(filter(None, date[i]))
        if date[i][0] == "Present": date[i] = dt.now()
        elif len(date[i]) != 1:
            datetime_object = datetime.datetime.strptime(date[i][0], "%b")
            date[i] = datetime.datetime(int(date[i][1]), datetime_object.month, 1)
        else:
            date[i] = datetime.datetime(int(date[i][0]), 1, 1)
        if len(date) == 1:
            date.append(dt.now())
    return date

def moreRecent(date):
    dateDiff = dt.now() - date
    print(dateDiff,date)
    if (dateDiff.days) / 30 <= 6 :
        return True
    else:
        return False

def getoverlap(date1, date2,User):
    print(date1,date2)
    score = None
    date1 = covertdate(date1)
    date2 = covertdate(date2)
    configData = Config.objects.get(User = User)
    data = [max(date1[0], date2[0]), min(date1[1], date2[1])]
    if (data[1]-data[0]).days < 0:
        return None
    else:
        max_time = [min(date1[0],date2[0]),max(date1[1],date2[1])]
        overlapmonths = math.floor((data[1] - data[0]).days / 30) 
        moreRecentOrNot = moreRecent(data[-1])
        print(moreRecentOrNot)
        if overlapmonths >= configData.workCutout:
            return overlapmonths
        else:
            return 0


def compare(mutualConnectionData, targetData,User):
    l = {}
    workPlaceUrls = [x for x in targetData.keys()]
    targetWorkPlace= []
    for x in targetData.keys():
        workPlaceUrls.append(targetData[x][0])
    for i in mutualConnectionData.keys():
        if (i in workPlaceUrls) or (mutualConnectionData[i][0] in targetWorkPlace):
            rslt = getoverlap(targetData[i][-1], mutualConnectionData[i][-1],User)
            if rslt:
                l[mutualConnectionData[i][0]] = rslt
    return l

def camparedate(date1,date2,User):
    date1 = date1.split("–")
    date2 = date2.split("–")
    overlap = (min(int(date1[-1]),int(date2[-1])) - max(int(date1[0]),int(date2[0]))) * 12
    print("overlap",overlap)
    configData = Config.objects.get(User = User)
    if overlap > configData.eduCutOut:
        return overlap
    return 0

def geteduoverlap(targetedu,connectionedu,User):
    connection_education = [x for x in connectionedu.keys()]
    overlappeddata = {}
    for i in targetedu.keys():
        if (i in connection_education and connectionedu[i]):
            rslt = camparedate(targetedu[i],connectionedu[i],User)
            if rslt:
                overlappeddata[i] = rslt
    return overlappeddata

def backgroundurlScrap(username,password,url,User,i):
    temp_list = TempList.objects.filter(id=i)[0]

    try:
        config = Config.objects.filter(User=User)[0]
        start.scraper.logIn(username, password, config.timeDelay)
        try:
            Scraped_Data = []  # whole user and its mutual connections data
            mutualConnectionData = []  # Mutual Connections Name, Images, Profile url , Score
            target_name = start.scraper.getProfilePage(url)
            target_education = start.scraper.getEducation()
            target_experience = start.scraper.getExperience()
            mutual_connections = start.scraper.mutualConnections()
            Scraped_Data.append(
                {"name": target_name[0], "target Education":  target_education, "Target Experience": target_experience})
            print("In progress...")
            for connection in mutual_connections:
                print("...")
                connection_name = start.scraper.getProfilePage(connection["Url"])
                connection_education = (start.scraper.getEducation())
                connection_experience = (start.scraper.getExperience())

                Scraped_Data.append(
                    {"name": connection_name[0], "Education": connection_education, "Experience": connection_experience})

                work_score = compare(
                    connection_experience, target_experience,User)
                edu_score = geteduoverlap(target_education,connection_education,User)
                mutualConnectionData.append(
                    {"Name": connection['Name'], "Image": connection['Image'], "Profile_Url": connection["Url"], "score": {"work_score":work_score,"edu_score":edu_score}})

            new_temp_list = TempList.objects.filter(id = temp_list.id)
            for i in mutualConnectionData:
                temp_connection = TempConnections(list_id = new_temp_list[0],name=i['Name'],score=i['score'],image=i['Image'],url=i['Profile_Url'],username = User)
                temp_connection.save()
            temp_list.status = "Completed"
            temp_list.save()
            print("Scraping for Target {} completed...".format(url))
        except Exception as e:
            print("Exception Occured: ",e)
            temp_list.status = 'Error: Server Error, Retry'
            temp_list.save()
    except Exception as e:
        print("Exception Occured: ",e)
        temp_list.status = 'Error: Invalid Crendentials, Retry'
        temp_list.save()

class url(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        url = request.data['url']
        username = request.data['username']
        password = request.data['password']
        User = request.user
        temp_list = TempList(User=User,url=url,status="Pending")
        temp_list.save()
        start.Queue.append([username,password,url,User,temp_list.id])
        # call_command('process_tasks')
        return Response()


class start():
    scraper = SimpleLazyObject(Scraper)
    Queue = []
    active = True


def startScraping():
    if start.active and len(start.Queue) != 0:
        data = start.Queue.pop(0)
        start.active = False
        backgroundurlScrap(data[0],data[1],data[2],data[3],data[4])
        start.active = True
    elif not(start.active):
        print("Processing scraping request now...")
    else:
        print("Queue does not have any request")

def getStart():
    scheduler = BackgroundScheduler()
    scheduler.add_job(startScraping, 'interval', minutes = 1)
    scheduler.start()