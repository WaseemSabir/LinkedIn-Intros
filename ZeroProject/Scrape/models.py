from django.db import models
import uuid
from django.contrib.auth.models import User
import jsonfield
from jsonfield import JSONField

# Create your models here.
class userProfile(models.Model):
    User = models.ForeignKey(User,on_delete=models.CASCADE)
    id = models.CharField(primary_key=True, default=uuid.uuid4, editable=False,max_length=16)
    fname = models.CharField(max_length=132,null=True)
    position = models.CharField(max_length=132,null=True)
    profileimage = models.ImageField(null=True)
    password = models.CharField(max_length=132,null=True)

    def __str__(self):
        return self.id

class connectionList(models.Model):
    User = models.ForeignKey(User,on_delete=models.CASCADE)
    id = models.CharField(primary_key=True, default=uuid.uuid4, editable=False,max_length=16)
    Name = models.CharField(max_length=132,null=True)

    def __str__(self):
        return self.Name
class TempList(models.Model):     
    User = models.ForeignKey(User,on_delete=models.CASCADE)
    id = models.CharField(primary_key=True, default=uuid.uuid4, editable=False,max_length=16)
    url = models.URLField(null=True)
    status = models.CharField(max_length=132,null=True)

    def __str__(self):
        return self.User.username


class TempConnections(models.Model):
    list_id = models.ForeignKey(TempList,on_delete=models.CASCADE)
    name = models.CharField(max_length=132,null=True)
    score = JSONField(null=True)
    image = models.URLField(null=True)
    url = models.URLField(null=True)
    username = models.CharField(max_length=132,null=True)

    def __str__(self):
        return (self.name)

class Config(models.Model):
    User = models.ForeignKey(User,on_delete=models.CASCADE)
    eduCutOut = models.IntegerField(default = 6,null=True)
    workCutout = models.IntegerField(default = 6,null=True)
    timeDelay = models.IntegerField(default= 4,null=True)
 
class Connection(models.Model):
    list_id = models.ForeignKey(connectionList,on_delete=models.CASCADE)
    name = models.CharField(max_length=132,null=True)
    score = JSONField(null=True)
    image = models.URLField(null=True)
    url = models.URLField(null=True)
    user_name = models.CharField(max_length=132,null=True)

    def __str__(self):
        return (self.target_name)