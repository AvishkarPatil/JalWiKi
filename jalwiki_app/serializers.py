from rest_framework import serializers
from .models import User, Category, Technique, TechniqueImage, Region, ForumThread, ForumComment, ForumTag

class RegionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Region
        fields = ['id', 'name']

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name','mobile_no', 'address','city','state', 'pincode', 'profile_pic', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        instance = self.Meta.model(**validated_data)
        if password is not None:
            instance.set_password(password)
        instance.save()
        return instance

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'description']

class TechniqueImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = TechniqueImage
        fields = ['id', 'image', 'caption', 'order', 'type']

class TechniqueListSerializer(serializers.ModelSerializer):
    categories = CategorySerializer(many=True, read_only=True)
    added_by_username = serializers.CharField(source='added_by.username', read_only=True)
    regions = RegionSerializer(many=True, read_only=True)

    class Meta:
        model = Technique
        fields = ['id', 'title', 'slug', 'summary', 'main_image', 'created_on', 'updated_on', 'is_published', 'categories', 'added_by_username','regions']

class TechniqueSerializer(serializers.ModelSerializer):
    categories = CategorySerializer(many=True, read_only=True)
    regions = RegionSerializer(many=True, read_only=True)
    added_by_username = serializers.CharField(source='added_by.username', read_only=True)
    images = TechniqueImageSerializer(many=True, read_only=True, source='technique_images') #Rename technique_images to images

    class Meta:
        model = Technique
        fields = ['id', 'title', 'slug', 'added_by','summary', 'detailed_content', 'main_image', 'created_on', 'updated_on', 'is_published', 'categories','impact','regions', 'benefits', 'materials', 'steps', 'likes','added_by_username','images'] #Rename technique_images to images

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['likes_count'] = instance.likes.count()
        if instance.added_by: # Check if added_by is not None
            data['added_by'] = instance.added_by.id
        else:
            data['added_by'] = None # Or handle as appropriate
        return data

class AuthorSerializer(serializers.ModelSerializer):
    profile_pic_url = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'profile_pic_url']

    def get_profile_pic_url(self, obj):
        if obj.profile_pic:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.profile_pic.url)
            return obj.profile_pic.url # Fallback if no request in context
        return None

class ForumTagSerializer(serializers.ModelSerializer):
    class Meta:
        model = ForumTag
        fields = ['id', 'name', 'slug']
        read_only_fields = ['slug']


class ForumThreadSerializer(serializers.ModelSerializer):
    author = AuthorSerializer(read_only=True)
    tags = ForumTagSerializer(many=True, read_only=True) # For reading
    tag_ids = serializers.PrimaryKeyRelatedField(
        many=True, write_only=True, queryset=ForumTag.objects.all(), source='tags', required=False
    )
    # FIX: Remove redundant source argument
    upvote_count = serializers.IntegerField(read_only=True)
    comment_count = serializers.IntegerField(read_only=True)
    is_liked_by_user = serializers.SerializerMethodField()

    class Meta:
        model = ForumThread
        fields = [
            'id', 'title', 'slug', 'content',
            'type',
            'author', 'tags', 'tag_ids',
            'created_at', 'updated_at', 'last_activity_at',
            'upvote_count', 'upvoted_by',
            'comment_count', 'is_liked_by_user'
        ]
        read_only_fields = [
            'slug', 'author', 'created_at', 'updated_at', 'last_activity_at',
            'upvoted_by', 'is_liked_by_user'
        ]


    def get_is_liked_by_user(self, obj):
        request = self.context.get('request')
        if not request or not request.user.is_authenticated:
            return False
        return obj.upvoted_by.filter(id=request.user.id).exists()

    def create(self, validated_data):
        return super().create(validated_data)


class ForumCommentSerializer(serializers.ModelSerializer):
    author = AuthorSerializer(read_only=True)
    upvote_count = serializers.IntegerField(read_only=True)
    is_liked_by_user = serializers.SerializerMethodField()
    replies = serializers.SerializerMethodField(read_only=True)

    parent_comment = serializers.PrimaryKeyRelatedField(
        queryset=ForumComment.objects.all(),
        allow_null=True,
        required=False
    )

    class Meta:
        model = ForumComment
        fields = [
            'id',
            'thread',         # Read: ID of the thread. Write: Expects ID.
            'author',         # Read: Nested AuthorSerializer.
            'content',        # Read/Write.
            'parent_comment', # Read: ID of the parent comment. Write: Expects ID or null.
            'created_at',     # Read.
            'updated_at',     # Read.
            'upvote_count',   # Read.
            'upvoted_by',     # Read: List of user IDs who upvoted.
            'is_liked_by_user',# Read.
            'replies'         # Read: Nested replies.
        ]
        read_only_fields = [
            'author', 'created_at', 'updated_at', 'upvote_count',
            'upvoted_by', 'is_liked_by_user', 'replies'
        ]

    def get_is_liked_by_user(self, obj):
        request = self.context.get('request')
        if not request or not request.user.is_authenticated:
            return False
        return obj.upvoted_by.filter(id=request.user.id).exists()

    def get_replies(self, obj):
        serializer_context = self.context
        return ForumCommentSerializer(obj.replies.all(), many=True, context=serializer_context).data

    def create(self, validated_data):
        return super().create(validated_data)

    def update(self, instance, validated_data):
        instance.content = validated_data.get('content', instance.content)
        instance.save()
        return instance