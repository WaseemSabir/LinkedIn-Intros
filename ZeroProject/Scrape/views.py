import re
from Scrape.models import userProfile
from django.shortcuts import render
from .Scrape import Scraper
from rest_framework.views import APIView
from rest_framework.response import Response
import json
from django.utils.functional import SimpleLazyObject
from .seriallizers import *
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from datetime import datetime as dt
from rest_framework.permissions import IsAuthenticated

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):

    def validate(self,attrs):
        data = super().validate(attrs)
        profile = userProfile.objects.get(User = self.user.id)
        profile = UserSerializer(profile,many=False)
        data['profile'] = profile.data
        return data

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

class Register(APIView):
    def post(self,request):
        data = request.data
        user = User.objects.create_user(username=data['username'],password=data['password'])
        user.save()
        profile = userProfile(User=user,fname=data['fname'],position=data['position'],profileimage=data['image'],password=data['password'])
        profile.save()
        data = UserSerializer(profile,many = False)
        config = Config(User = user)
        config.save()
        return Response({"data":data.data})

class start():
    scraper = SimpleLazyObject(Scraper)

# Not used
class Login(APIView):
    def get(self,request):
        user = request.user
        profile = userProfile.objects.filter(User = user.id)[0]
        data = {}
        vals = start.scraper.logIn(profile.User.username,profile.password)
        data[vals[0]] = vals
        return Response({"data":data})

class getProfile(APIView):
    def get(self,request):
        user = request.user
        print("User Obtained",user)
        profile = userProfile.objects.filter(User=user.id)
        data = UserSerializer(profile[0],many=False)
        return Response({"data":data.data})

class setConfigValues(APIView):
    permission_classes = [IsAuthenticated]
    def post(self,request):
        data = request.data
        user = request.user
        config = Config.objects.filter(User=user)
        config = config[0]
        config.workCutout = data["workThreshold"]
        config.eduCutOut = data["eduThreshold"]
        config.timeDelay = data["timeDelay"]
        config.save()
        return Response('ok')

class getConfigValues(APIView):
    permission_classes = [IsAuthenticated]
    def get(self,request):
        user = request.user
        setting = Config.objects.filter(User=user)
        sett = ConfigSerilizers(setting[0],many=False)
        return Response(sett.data)

class getTempList(APIView):
    permission_classes = [IsAuthenticated]
    def get(self,request):
        user = request.user
        data = TempList.objects.filter(User = user)
        SerializedData = TempListSerializers(data,many = True).data
        return Response(SerializedData)

class getTempConnections(APIView):
    permission_classes = [IsAuthenticated] 
    def post(self,request):
        data = request.data
        data = TempConnections.objects.filter(list_id = data['id'])
        SerializedData = TempConnectionSerializers(data, many= True)
        return Response({"Connections":SerializedData.data})