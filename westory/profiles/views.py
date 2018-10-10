from rest_framework import mixins
from rest_framework import generics

from django.http import Http404

from .models import Profile
from .serializers import ProfileSerializer

class ProfileRetrieveAPI(mixins.ListModelMixin, mixins.CreateModelMixin, generics.GenericAPIView):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer

    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        return self.create(request, *args, **kwargs)