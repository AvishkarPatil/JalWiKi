from django.db import models
from django.contrib.auth.models import AbstractBaseUser
from django.utils import timezone

class User(AbstractBaseUser):
    email = models.EmailField(unique=True)
    username = models.CharField(max_length=20, unique=True, null=True)
    first_name = models.CharField(max_length=20)
    last_name = models.CharField(max_length=20)
    mobile_no = models.CharField(max_length=10, null=True, blank=True)
    address = models.TextField(default='N/A')
    city = models.CharField(max_length=100, default='N/A')
    state = models.CharField(max_length=100, default='N/A')
    pincode = models.CharField(max_length=6, default='000000')
    profile_pic = models.ImageField(upload_to='profiles/', null=True, blank=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(default=timezone.now)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'first_name', 'last_name']

    def __str__(self):
        return self.email

    def get_full_name(self):
        return f"{self.first_name} {self.last_name}"

    def get_short_name(self):
        return self.first_name