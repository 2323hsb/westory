from django.urls import path
from .views import ProfileRetrieveAPI

urlpatterns = [
    # path('users/login/', views.loginAPI.as_view()),
    path('users/profiles/', ProfileRetrieveAPI.as_view()),
]