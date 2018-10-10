from django.views.generic import TemplateView

class PostListView(TemplateView):
    template_name = 'posts/posts.html'

class CreateView(TemplateView):
    template_name = 'posts/create.html'