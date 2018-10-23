from django.views.generic import TemplateView

class AuthView(TemplateView):
    template_name = 'posts/auth.html'

class PostListView(TemplateView):
    template_name = 'posts/posts.html'

class CreateView(TemplateView):
    template_name = 'posts/create.html'

class HomeView(TemplateView):
    template_name = 'posts/home.html'