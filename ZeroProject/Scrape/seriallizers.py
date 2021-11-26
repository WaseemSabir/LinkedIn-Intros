from django.db.models import fields
from rest_framework import serializers
from .models import *

class UserSerializer(serializers.ModelSerializer):
    username = serializers.SerializerMethodField(read_only=True)
    class Meta:
        model = userProfile
        fields = '__all__'

    def get_username(self,obj):
        return obj.User.username

class ConnectionSerializers(serializers.ModelSerializer):
    score = serializers.SerializerMethodField(read_only=True)
    class Meta:
        model = Connection
        fields = ['list_id',"name",'image','url','user_name','score']
 
    def get_score(self,obj):
        if obj.score:
            return eval(str(obj.score))

class ConfigSerilizers(serializers.ModelSerializer):
    class Meta:
        model = Config
        fields = ['workCutout','eduCutOut','timeDelay']

class TempListSerializers(serializers.ModelSerializer):
    class Meta:
        model = TempList
        fields = '__all__'

class TempConnectionSerializers(serializers.ModelSerializer):
    score = serializers.SerializerMethodField(read_only=True)
    class Meta:
        model = TempConnections
        fields = '__all__'
        
    def get_score(self,obj):
        if obj.score:
            return eval(str(obj.score))