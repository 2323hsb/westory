from django.views.generic import TemplateView

class StoriesView(TemplateView):
    template_name = 'main/stories.html'

class StoryDetailView(TemplateView):
    template_name = 'main/story_detail.html'

class PostsView(TemplateView):
    template_name = 'main/posts.html'

class ConditionsView(TemplateView):
    template_name = 'main/conditions.html'

class CreateStoryView(TemplateView):
    template_name = 'main/create_story.html'