from django.db import models

from django.contrib.auth.models import (BaseUserManager, AbstractBaseUser, PermissionsMixin)

class UserManager(BaseUserManager):
    def create_user(self, username, email, password):
        if not username:
            raise ValueError('Users must have a username')
        if not email:
            raise ValueError('Users must have an email address')

        user = self.model(
            username = username,
            email = self.normalize_email(email),
        )

        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, username, email, password):
        user = self.create_user(
            username,
            email,
            password,
        )

        user.is_superuser = True
        user.is_staff = True
        user.save(using=self._db)

        return user

class User(AbstractBaseUser, PermissionsMixin):
    username = models.CharField(
        db_index=True, 
        max_length=255, 
        unique=False
    )

    email = models.EmailField(
        db_index=True,
        max_length = 255,
        unique = True,
    )

    ''' 
        null = True: Record 생성 시 NULL값이 들어가는 것을 허용, Update시에는 불허함
        null = False: Record 생성 시 NULL값 비허용
        blank = True: Update 에서도 빈 값을 허용
    '''

    profile = models.OneToOneField('profiles.Profile', on_delete=models.CASCADE, null=True, blank=True)

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return self.email