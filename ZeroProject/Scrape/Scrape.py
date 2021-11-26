from os import times
import re
from selenium import webdriver
from bs4 import BeautifulSoup as be
import time
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from webdriver_manager.chrome import ChromeDriverManager
from .models import *
class Scraper():
    def __init__(self):
        self.option = self.options()
        self.driver = webdriver.Chrome(ChromeDriverManager().install(), options=self.option)
        self.driver.maximize_window()
        self.cookie = None
        self.currentPageHtml = None
        self.delay = 4

    def options(self):
        option = webdriver.ChromeOptions()
        option.add_argument('disable-blink-features=AutomationControlled')
        option.add_argument('user-agent=Type user agent here')
        option.add_argument('--lang=en_US')
        option.add_argument("--headless")
        option.add_argument("--no-sandbox")
        option.add_argument("--disable-dev-shm-usage")
        option.add_argument("--window-size=1920x1080")
        option.add_argument("start-maximised")
        option.add_argument("user-agent=whatever you want")
        return option

    # def setCookie(self):
    #     self.cookie = (self.driver.get_cookie("li_at"))['value']

    def logIn(self, name, password, d):
        self.delay = d
        self.driver.get(
            'https://www.linkedin.com/checkpoint/rm/sign-in-another-account?fromSignIn=true&trk=guest_homepage-basic_nav-header-signin')
        username = self.driver.find_element_by_id("username")
        username.clear()
        username.send_keys(name)
        time.sleep(self.delay)
        username = self.driver.find_element_by_id("password")
        username.clear()
        username.send_keys(password)
        time.sleep(self.delay)
        button = self.driver.find_element_by_xpath(
            '//*[@id="organic-div"]/form/div[3]/button')
        button.click()
        div = self.driver.find_element_by_class_name('feed-identity-module__actor-meta')
        # url = div.find_element_by_class_name("ember-view")
        # print(div.get_attribute('innerHTML'))
        data = div.get_attribute('innerHTML')
  
        # self.setCookie()

    def getProfilePage(self, url):
        self.driver.get(url)
        time.sleep(self.delay)
        # profile_Scraper(cookie,url)
        time.sleep(self.delay)
        imagediv = self.driver.find_element_by_class_name("presence-entity")
        data = imagediv.get_attribute("innerHTML")
        imagedata = be(data,"lxml")
        image = imagedata.find("img")
        if image:
            image = image["src"]
        self.driver.execute_script(
            "window.scrollTo(0, (document.body.scrollHeight)/4);")
        time.sleep(self.delay)
        self.driver.execute_script(
            "window.scrollTo(0, (document.body.scrollHeight)/2);")
        try:
            buttondiv = self.driver.find_element_by_class_name(
            'pv-experience-section__see-more')
            # print(buttondiv)
            button = buttondiv.find_element_by_class_name('pv-profile-section__see-more-inline')

            # print(button.is_enabled(),'button', end=" ")
            if button:
                print("clicked")
                # self.driver.execute_script("arguments[0].click();", button)
        except:
            pass
        try:
            div = self.driver.find_element_by_id('experience-section')
            experience = div.find_elements_by_class_name('pv-profile-section__list-item')
            for i in experience:
                try:
                    button = i.find_element_by_class_name(
                        'pv-profile-section__see-more-inline')
                    # print('button', end=" ")
                    if button:
                        self.driver.execute_script("arguments[0].click();", button)
                except:pass
        except:pass
        source1 = self.driver.page_source
        self.writefile(source1)
        source = be(source1, 'lxml')
        self.currentPageHtml = source
        name = source.find('h1', class_='text-heading-xlarge').text
        return [name,image]
    def writefile(self,soup):
        file1 = open("a.txt", "w",encoding="utf-8")  # write mode
        file1.write(soup)
        file1.close()
    def getExperience(self):
        soup = self.currentPageHtml
        div = soup.find('section', id='experience-section')
        l = {}
        if div:
            experience = div.find_all(
                'li', class_='pv-profile-section__list-item')

            for i in experience:
                div = i.find('div', class_='pv-entity__summary-info')
                link = 'https://www.linkedin.com' + i.find("a",class_="ember-view")["href"]
                # print(link)
                if div != None:
                    # print(div.text)
                    compay = div.find(
                        'p', class_='pv-entity__secondary-title').text.split("\n")
                    duration = div.find(
                        'div', class_='display-flex')
                    
                    if duration:
                        duration = duration.find("h4")
                        time = duration.find_all('span')
                        time = time[-1].text
                        duration = list(filter(None, compay)) + \
                            [time]
                        del duration[1]
                        duration[0] = duration[0].replace("      ",'')
                        l[link] = [duration[0],duration[-1]]
                    else:
                        company = (list(filter(None, compay)))
                        company[0] = company[0].replace("      ",'')
                        l[link] = [company[0]]
                else:
                    div = i.find(
                        'div', class_='justify-space-between')
                    company = div.find("div",class_='pv-entity__company-summary-info').find("h3")
                    company = company.find_all("span")
                    company = company[-1].text

                    inerlist = i.find_all('li',class_='pv-entity__position-group-role-item')
                    if len(inerlist) == 0:
                        inerlist = i.find_all('li',class_='pv-entity__position-group-role-item-fading-timeline')
                    # print(inerlist)
                    div2 = inerlist[0].find("div",class_='pv-entity__summary-info-v2').find('div',class_='display-flex').find('h4')
                    span = div2.find_all('span')
                    d1 = (span[-1].text)
                    d1 = (d1.split("–"))[-1]
                    
                    div2 = inerlist[-1].find("div",class_='pv-entity__summary-info-v2').find('div',class_='display-flex').find('h4')
                    # print(div2)
                    span = div2.find_all('span')
                    d2 = (span[-1].text)
                    d2 = (d2.split("–"))[0]
                    d2 = d2 + " – " + d1

                    # print(d2)
                    
                    l[link] = [company,d2]
                    # print(l)
            # print("\n\n\n\n",l,"\n\n\n\n")
        return l

    def getEducation(self):
        soup = self.currentPageHtml
        edu = {}
        div1 = soup.find('section', id='education-section')
        if div1:
            education = div1.find_all('li', class_='pv-education-entity')
            for i in education:
                temp = []
                div = i.find('div', class_='pv-entity__degree-info')
                para = div.find_all("p", class_='pv-entity__secondary-title')
                temp.append(div.find("h3").text)
                # print(i.text) 
                timediv = i.find('div', class_='pv-entity__summary-info--background-section')
                time = timediv.find("p",class_="pv-entity__dates")
                timespan = None
                if time:
                    span = (time.find_all("span"))
                    # print(span[-1].text)
                    temp.append(span[-1].text)
                    timespan = span[-1].text
                # print(temp)
                if len(temp) == 5:
                    temp.pop(-2)
                if timespan:
                    if temp[0] in list(edu.keys()):
                        # print("yes")
                        tempdata = edu[temp[0]].split("–")
                        timespan = timespan.replace("\n","").split("–")
                        edu[temp[0]] = timespan[0] + "–" + tempdata[-1]
                    else:
                        edu[temp[0]] = timespan.replace("\n","")
                else:
                    edu[temp[0]] = None
                # print("edu:\t:",edu)
            # print("\n\n\n\n",edu,"\n\n\n\n")
        return edu
    def mutualConnections(self):
        soup = self.currentPageHtml
        link = soup.find('a', class_='pv1')
        mutualConnection = []
        
        if link:
            link = link['href']
            self.driver.get(link)
            while True:
                newpage = self.driver.page_source
                soup = be(newpage, 'lxml')
                self.driver.execute_script("window.scrollTo(0, (document.body.scrollHeight));")
                time.sleep(self.delay)
                data = soup.find_all('li', class_='reusable-search__result-container') #All div of mutual Connections
                for i in data:
                    url = (i.find('a', class_='app-aware-link')['href'])
                    # print(k)
                    image = i.find("img")
                    if image:
                        image = image['src']
                    name = i.find('span',class_='entity-result__title-text').find("span").find("span").text
                    mutualConnection.append( {"Name":name, "Url":url, "Image":image})
                try:
                    div = self.driver.find_element_by_class_name('artdeco-pagination')
                    button = div.find_elements_by_class_name('artdeco-pagination__button')
                    button = button[-1]
                    if button.is_enabled():
                        self.driver.execute_script("arguments[0].click();", button)
                        time.sleep(self.delay)
                    else:
                        break
                except:break

        return mutualConnection