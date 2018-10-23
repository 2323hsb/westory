from django.urls import path
from . import views

app_name = 'posts'

urlpatterns = [
    path('post', views.PostListView.as_view()),
    path('create', views.CreateView.as_view()),
]