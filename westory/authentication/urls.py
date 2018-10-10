from django.urls import path
from authentication import views

urlpatterns = [
    # path('users/login/', views.loginAPI.as_view()),
    path('users/', views.UserRetrieveAPI.as_view()),
    path('users/registration/', views.registrationAPI.as_view()),
]