from django.urls import path
from . import views

app_name = 'main'

urlpatterns = [
    path('', views.StoriesView.as_view()),
    path('stories', views.StoriesView.as_view()),
    path('stories/<str:serial_id>', views.StoryDetailView.as_view()),
    path('posts', views.PostsView.as_view()),
    path('conditions', views.ConditionsView.as_view()),
    path('test', views.CreateStoryView.as_view()),
    # path('post', views.PostListView.as_view()),
    # path('create', views.CreateView.as_view()),
]