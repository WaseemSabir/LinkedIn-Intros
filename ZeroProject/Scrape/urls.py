
from django.urls import path,include
from .views import *
from .Connection_list_view import *
from .ScrapViews import *
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('api/token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path("login",Login.as_view()), # Not used, the above used to obtain the token
    path("scrap",url.as_view()),
    path("getProfile",getProfile.as_view()),
    path("register",Register.as_view()),
    path("addList",addNewList.as_view()),
    path("updateList",updatelist.as_view()),
    path("getlist",getLists.as_view()),
    path("setSetting",setConfigValues.as_view()),
    path("getSetting",getConfigValues.as_view()),
    path("getTempList",getTempList.as_view()),
    path("getTempConnections",getTempConnections.as_view())
]
# Start()