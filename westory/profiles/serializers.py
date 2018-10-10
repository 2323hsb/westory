from rest_framework import serializers
from .models import Profile

class ProfileSerializer(serializers.ModelSerializer):
    email = serializers.CharField(source='user.email')
    
    class Meta:
        model = Profile
        fields = ['email', 'bio', 'image',]
        read_only_fields = ['email',]