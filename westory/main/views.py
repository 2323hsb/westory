from django.views.generic import TemplateView

class PostsView(TemplateView):
    template_name = 'main/posts.html'

class ConditionsView(TemplateView):
    template_name = 'main/conditions.html'