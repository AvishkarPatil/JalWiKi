from rest_framework import viewsets, status, filters, permissions
from rest_framework.decorators import action
from rest_framework.parsers import JSONParser, MultiPartParser, FormParser
from rest_framework.response import Response
from django.contrib.auth.hashers import check_password
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.shortcuts import get_object_or_404
from rest_framework.exceptions import ValidationError
from django_filters.rest_framework import DjangoFilterBackend
from django.utils.text import slugify
from django.db.models import Q
from django.conf import settings

from .models import User, Category, Technique, TechniqueImage, Region, ForumThread, ForumComment, ForumTag
from .serializers import UserSerializer, CategorySerializer, TechniqueSerializer, TechniqueListSerializer, TechniqueImageSerializer, RegionSerializer, ForumThreadSerializer, ForumCommentSerializer, ForumTagSerializer


class RegionViewSet(viewsets.ModelViewSet):
    queryset = Region.objects.all()
    serializer_class = RegionSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name']
    ordering_fields = ['name']

    def perform_create(self, serializer):
        serializer.save()

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    parser_classes = [JSONParser, MultiPartParser, FormParser]

    def get_permissions(self):
        if self.action in ['login', 'register', 'logout']:
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]

    def get_tokens_for_user(self, user):
        refresh = RefreshToken.for_user(user)
        return {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }

    @action(detail=False, methods=['post'], parser_classes=[JSONParser])
    def login(self, request):
        email = request.data.get('email')
        password = request.data.get('password')

        if not email or not password:
            return Response({"status": False, "message": "Missing email or password"},
                            status=status.HTTP_400_BAD_REQUEST)
        try:
            user = User.objects.get(email=email)
            if check_password(password, user.password):
                user_data = UserSerializer(user).data
                refresh = RefreshToken.for_user(user)
                access_token = refresh.access_token
                tokens_dict = {
                    'refresh': str(refresh),
                    'access': str(access_token),
                }
                response_data = {
                    "status": True,
                    "message": "Auth successful",
                    "username": user_data['username'],
                    "user_id": user_data['id'],
                    "tokens": tokens_dict
                }
                response = Response(response_data, status=status.HTTP_200_OK)
                secure_flag = not settings.DEBUG
                samesite_policy = 'Lax'
                response.set_cookie(
                    key=settings.SIMPLE_JWT.get('AUTH_COOKIE', 'accessToken'),
                    value=tokens_dict['access'],
                    max_age=int(access_token.lifetime.total_seconds()),
                    httponly=True,
                    secure=secure_flag,
                    samesite=samesite_policy
                )
                response.set_cookie(
                    key=settings.SIMPLE_JWT.get('AUTH_COOKIE_REFRESH', 'refreshToken'),
                    value=tokens_dict['refresh'],
                    max_age=int(refresh.lifetime.total_seconds()),
                    httponly=True,
                    secure=secure_flag,
                    samesite=samesite_policy
                )
                return response
            else:
                return Response({"status": False, "message": "Invalid credentials"},
                                status=status.HTTP_401_UNAUTHORIZED)
        except User.DoesNotExist:
            return Response({"status": False, "message": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
             return Response({"status": False, "message": "An internal error occurred during login."},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=['post'], parser_classes=[JSONParser])
    def register(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"status": True, "message": "Registration successful", "data": serializer.data},
                            status=status.HTTP_201_CREATED)
        else:
            return Response({"status": False, "message": "Registration failed", "errors": serializer.errors},
                            status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'])
    def logout(self, request):
        response = Response({"status": True, "message": "Logout successful."}, status=status.HTTP_200_OK)
        access_cookie_name = settings.SIMPLE_JWT.get('AUTH_COOKIE', 'accessToken')
        refresh_cookie_name = settings.SIMPLE_JWT.get('AUTH_COOKIE_REFRESH', 'refreshToken')
        response.delete_cookie(access_cookie_name)
        response.delete_cookie(refresh_cookie_name)
        return response

    @action(detail=False, methods=['get'])
    def get_user_details(self, request):
        user_id = request.query_params.get('user_id')
        if not user_id:
            user = request.user
            serializer = UserSerializer(user)
            return Response(serializer.data, status=status.HTTP_200_OK)
        try:
            user_to_fetch = User.objects.get(id=user_id)
            if request.user != user_to_fetch and not request.user.is_staff:
                return Response({"message": "You do not have permission to view this user's details."},
                                status=status.HTTP_403_FORBIDDEN)
            serializer = UserSerializer(user_to_fetch)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({"message": "User not found"}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=False, methods=['post'], parser_classes=[MultiPartParser, FormParser])
    def update_profile_picture(self, request):
        user = request.user
        profile_pic = request.data.get('profile_pic')
        if not profile_pic:
            return Response({"status": False, "message": "Missing profile picture"}, status=status.HTTP_400_BAD_REQUEST)
        user.profile_pic = profile_pic
        user.save(update_fields=['profile_pic'])
        serializer = UserSerializer(user)
        return Response({
            "status": True,
            "message": "Profile picture updated successfully",
            "data": serializer.data
        }, status=status.HTTP_200_OK)

    def perform_update(self, serializer):
        instance = serializer.instance
        if instance != self.request.user and not self.request.user.is_staff:
            raise permissions.PermissionDenied("You do not have permission to edit this profile.")
        serializer.save()


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name']
    ordering_fields = ['name']

    def perform_create(self, serializer):
        serializer.save()


class TechniqueViewSet(viewsets.ModelViewSet):
    queryset = Technique.objects.all()
    serializer_class = TechniqueSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['categories__id', 'added_by', 'is_published', 'regions__id']
    search_fields = ['title', 'summary', 'detailed_content', 'impact', 'benefits', 'materials', 'steps']
    ordering_fields = ['created_on', 'updated_on']

    def get_queryset(self):
        if self.request.user.is_staff:
            return Technique.objects.all()
        return Technique.objects.filter(is_published=True)

    def get_serializer_class(self):
        if self.action == 'list':
            return TechniqueListSerializer
        return TechniqueSerializer

    def perform_create(self, serializer):
        base_slug = slugify(self.request.data.get('title', ''))
        slug = base_slug
        count = 1
        while Technique.objects.filter(slug=slug).exists():
            slug = f"{base_slug}-{count}"
            count += 1
        serializer.save(added_by=self.request.user, slug=slug)

    @action(detail=True, methods=['post'])
    def add_image(self, request, pk=None):
        technique = self.get_object()
        serializer = TechniqueImageSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(technique=technique)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['get'])
    def get_images(self, request, pk=None):
        technique = self.get_object()
        images = technique.images.all()
        serializer = TechniqueImageSerializer(images, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def toggle_like(self, request, pk=None):
        try:
            technique = self.get_object()
            user = request.user
            if user in technique.likes.all():
                technique.likes.remove(user)
                liked = False
            else:
                technique.likes.add(user)
                liked = True
            return Response({'liked': liked, 'likes_count': technique.likes.count()})
        except Technique.DoesNotExist:
            return Response({"error": "Technique not found"}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=True, methods=['get'])
    def get_related(self, request, pk=None):
        technique = self.get_object()
        related_techniques = Technique.objects.filter(
            Q(categories__in=technique.categories.all())
        ).exclude(id=technique.id).distinct()[:5]
        serializer = TechniqueListSerializer(related_techniques, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def user_techniques(self, request):
        user_techniques = Technique.objects.filter(added_by=request.user)
        page = self.paginate_queryset(user_techniques)
        if page is not None:
            serializer = TechniqueListSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = TechniqueListSerializer(user_techniques, many=True)
        return Response(serializer.data)


class TechniqueImageViewSet(viewsets.ModelViewSet):
    queryset = TechniqueImage.objects.all()
    serializer_class = TechniqueImageSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def perform_create(self, serializer):
        technique_id = self.request.data.get('technique')
        try:
            technique = Technique.objects.get(id=technique_id)
            serializer.save(technique=technique)
        except Technique.DoesNotExist:
             raise status.HTTP_404_NOT_FOUND("Technique not found")

    @action(detail=False, methods=['post'])
    def upload_image(self, request):
        technique_id = request.data.get('technique')
        image = request.data.get('image')

        if not technique_id or not image:
            return Response({"error": "Both technique ID and image are required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            technique = Technique.objects.get(id=technique_id)
            image_instance = TechniqueImage.objects.create(technique=technique, image=image)
            serializer = TechniqueImageSerializer(image_instance)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Technique.DoesNotExist:
            return Response({"error": "Technique not found"}, status=status.HTTP_404_NOT_FOUND)


class IsOwnerOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.author == request.user

class ForumTagViewSet(viewsets.ModelViewSet):
    queryset = ForumTag.objects.all()
    serializer_class = ForumTagSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class ForumThreadViewSet(viewsets.ModelViewSet):
    queryset = ForumThread.objects.all().prefetch_related('tags', 'author', 'upvoted_by', 'comments__author', 'comments__upvoted_by', 'comments__replies')
    serializer_class = ForumThreadSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]
    lookup_field = 'slug'

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def upvote(self, request, slug=None):
        thread = self.get_object()
        user = request.user
        if user in thread.upvoted_by.all():
            thread.upvoted_by.remove(user)
            upvoted = False
        else:
            thread.upvoted_by.add(user)
            upvoted = True
        return Response({'status': 'vote processed', 'upvoted': upvoted, 'count': thread.upvote_count})

    @action(detail=True, methods=['get'], url_path='thread-comments')
    def list_comments(self, request, slug=None):
        thread = self.get_object()
        comments = thread.comments.filter(parent_comment__isnull=True).prefetch_related('author', 'upvoted_by', 'replies')
        serializer = ForumCommentSerializer(comments, many=True, context={'request': request})
        return Response(serializer.data)


class ForumCommentViewSet(viewsets.ModelViewSet):
    queryset = ForumComment.objects.all().select_related('author', 'thread', 'parent_comment').prefetch_related('upvoted_by', 'replies')
    serializer_class = ForumCommentSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]

    def get_queryset(self):
        queryset = super().get_queryset()
        thread_id = self.request.query_params.get('thread_id')
        thread_slug = self.request.query_params.get('thread_slug')

        if thread_id:
            queryset = queryset.filter(thread_id=thread_id)
        elif thread_slug:
            queryset = queryset.filter(thread__slug=thread_slug)
        return queryset

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def upvote(self, request, pk=None):
        comment = self.get_object()
        user = request.user
        if user in comment.upvoted_by.all():
            comment.upvoted_by.remove(user)
            upvoted = False
        else:
            comment.upvoted_by.add(user)
            upvoted = True
        return Response({'status': 'vote processed', 'upvoted': upvoted, 'count': comment.upvote_count})