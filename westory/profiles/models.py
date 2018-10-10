from django.db import models

class Profile(models.Model):
    bio = models.TextField(blank=True)
    image = models.URLField(blank=True)

    # def __str__(self):
    #     return self.user.username