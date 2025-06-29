from django.utils import timezone
from django.utils.text import slugify
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from django.db import models
from django.contrib.postgres.fields import ArrayField

class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(email, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True)
    username = models.CharField(max_length=20, unique=True, null=True)
    first_name = models.CharField(max_length=20)
    last_name = models.CharField(max_length=20)
    mobile_no = models.CharField(max_length=10, default='9876543210', null=True, blank=True)
    address = models.TextField(default='TKIET College', null=True, blank=True)
    city = models.CharField(max_length=100, default='Warananagar')
    state = models.CharField(max_length=100, default='Maharashtra')
    pincode = models.CharField(max_length=6, default='416113')
    profile_pic = models.ImageField(upload_to='profiles/', null=True, blank=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(default=timezone.now)

    objects = CustomUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'first_name', 'last_name']

    def __str__(self):
        return self.email

    def get_full_name(self):
        return f"{self.first_name} {self.last_name}"

    def get_short_name(self):
        return self.first_name

class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = "Categories"

class Region(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name

class Technique(models.Model):
    IMPACT_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
    ]
    title = models.CharField(max_length=255, help_text="Title of the technique.")
    slug = models.SlugField(unique=True, blank=True, help_text="Unique slug for the technique.")
    added_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='techniques')
    categories = models.ManyToManyField(Category, related_name='techniques', help_text="Categories related to this technique.")
    summary = models.TextField(help_text="Short overview of the technique.")
    detailed_content = models.TextField(help_text="Main detailed content.")
    main_image = models.ImageField(upload_to='technique_images/', blank=True, null=True)
    created_on = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_on = models.DateTimeField(auto_now=True, db_index=True)
    is_published = models.BooleanField(default=False, help_text="Mark as published to make it publicly visible.")
    likes = models.ManyToManyField(User, related_name='liked_techniques', blank=True)
    impact = models.CharField(max_length=10, choices=IMPACT_CHOICES, default='medium') # Changed to ChoiceField
    regions = models.ManyToManyField(Region, related_name='techniques', help_text="Regions where the technique is applicable.", blank=True)
    benefits = ArrayField(models.CharField(max_length=255), blank=True, null=True)
    materials = ArrayField(models.CharField(max_length=255), blank=True, null=True)
    steps = ArrayField(models.CharField(max_length=255), blank=True, null=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.title)
            slug = base_slug
            count = 1
            while Technique.objects.filter(slug=slug).exists():
                slug = f"{base_slug}-{count}"
                count += 1
            self.slug = slug
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title

    class Meta:
        ordering = ['-created_on']
        # unique_together = ('slug', 'category')

def technique_image_upload_path(instance, filename):
    slug = instance.technique.slug or 'unspecified'
    return f'technique_images/{slug}/{instance.pk or "new"}_{filename}'

class TechniqueImage(models.Model):
    technique = models.ForeignKey(Technique, on_delete=models.CASCADE, related_name='technique_images')
    image = models.ImageField(upload_to=technique_image_upload_path)
    caption = models.CharField(max_length=255, blank=True, help_text="Optional caption for the image.")
    order = models.PositiveIntegerField(default=0, help_text="Position of the image in the display order.")
    type = models.CharField(max_length=50, choices=[('step', 'Step-by-Step'), ('diagram', 'Diagram'), ('result', 'Result'), ('other', 'Other')], default='other')

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"{self.technique.title} - {self.caption}"




from django.conf import settings
from django.utils import timezone

class ForumTag(models.Model):
    name = models.CharField(max_length=50, unique=True)
    slug = models.SlugField(unique=True, blank=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class ForumThread(models.Model):
    # Define choices for the thread type
    class ThreadType(models.TextChoices):
        DISCUSSION = 'discussion', 'Discussion'
        RESOURCE = 'resource', 'Resource'
        ANNOUNCEMENT = 'announcement', 'Announcement'

    title = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True, blank=True)
    content = models.TextField()
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='forum_threads')
    tags = models.ManyToManyField('ForumTag', blank=True,
                                  related_name='threads')

    type = models.CharField(
        max_length=20,
        choices=ThreadType.choices,
        default=ThreadType.DISCUSSION,
        db_index=True
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    last_activity_at = models.DateTimeField(auto_now_add=True)  # Consider updating this on new comment
    upvoted_by = models.ManyToManyField(User, related_name='upvoted_threads', blank=True)

    def __str__(self):
        return self.title

    @property
    def upvote_count(self):
        return self.upvoted_by.count()

    @property
    def comment_count(self):
        return self.comments.count()  # Assumes related_name='comments' on ForumComment model

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.title)
            slug = base_slug
            counter = 1
            while ForumThread.objects.filter(slug=slug).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1
            self.slug = slug

        # Update last_activity_at if it's a new thread or if explicitly needed
        # For existing threads, last_activity_at is usually updated by new comments
        if not self.pk:  # If new thread
            self.last_activity_at = self.created_at  # or timezone.now()
        # else:
        # If you want updated_at to also refresh last_activity_at
        # self.last_activity_at = self.updated_at

        super().save(*args, **kwargs)


class ForumComment(models.Model):
    thread = models.ForeignKey(ForumThread, on_delete=models.CASCADE, related_name='comments')
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE, # Or models.SET_NULL, null=True
        related_name='forum_comments'
    )
    content = models.TextField()
    parent_comment = models.ForeignKey(
        'self',
        null=True,
        blank=True,
        on_delete=models.CASCADE, # Or models.SET_NULL
        related_name='replies'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    upvoted_by = models.ManyToManyField(
        settings.AUTH_USER_MODEL,
        related_name='upvoted_comments',
        blank=True
    )

    def save(self, *args, **kwargs):
        is_new = self._state.adding
        super().save(*args, **kwargs)
        if is_new: # If a new comment is created
            self.thread.last_activity_at = self.created_at
            self.thread.save(update_fields=['last_activity_at'])


    def __str__(self):
        return f"Comment by {self.author.username or self.author.email} on {self.thread.title}"

    @property
    def upvote_count(self):
        return self.upvoted_by.count()

    class Meta:
        ordering = ['created_at']

# Remember to run:
# python manage.py makemigrations your_app_name
# python manage.py migrate