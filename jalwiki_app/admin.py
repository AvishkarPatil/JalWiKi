from django.contrib import admin
from .models import User, Category, Technique, TechniqueImage, Region, ForumThread, ForumComment, ForumTag

admin.site.register(User)
admin.site.register(Category)
admin.site.register(Technique)
admin.site.register(TechniqueImage)
admin.site.register(Region)
admin.site.register(ForumThread)
admin.site.register(ForumComment)
admin.site.register(ForumTag)