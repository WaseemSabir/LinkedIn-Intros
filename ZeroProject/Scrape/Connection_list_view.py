from Scrape.seriallizers import ConnectionSerializers
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import *

class addNewList(APIView):
    def post(Self,request):
        data = request.data
        user = request.user
        listname = data['name']
        connectionlist = connectionList(User=user,Name= listname)
        connectionlist.save()
        l = connectionList.objects.filter(id=connectionlist.id)
        for i in data['data']:
            sc = i['score']
            connection = Connection(list_id=l[0],name=i['name'],score=sc,image=i['image'],url=i['url'])
            connection.save()
        return Response({"data":None})

class updatelist(APIView):
    def post(self,request):
        data = request.data
        user = request.user
        listname = data['name']
        l = connectionList.objects.filter(Name=listname,User=user)
        for i in data['data']:
            try:
                sc = i['score']
                connection = Connection(list_id=l[0],name=i['name'],score=sc,image=i['image'],url=i['url'])
                connection.save()
            except:
                pass
        return Response({"data":None})

class getLists(APIView):
    def get(self,request):
        user = request.user
        connectionlist = connectionList.objects.filter(User = user)
        resp_data = []
        for i in connectionlist:
            temp = {}
            try:
                temp["name"] = i.Name
                temp["data"] = ConnectionSerializers(Connection.objects.filter(list_id = i),many=True).data
                resp_data.append(temp)
            except:
                pass
        return Response(resp_data)
