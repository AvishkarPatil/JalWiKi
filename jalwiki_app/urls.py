from django.urls import path, include
from rest_framework.routers import DefaultRouter
from django.conf.urls.static import static
from django.conf import settings
from .views import UserViewSet, TechniqueViewSet, CategoryViewSet, RegionViewSet, ForumThreadViewSet, ForumCommentViewSet, ForumTagViewSet
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView


router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'techniques', TechniqueViewSet)
router.register(r'categories', CategoryViewSet)
router.register(r'regions', RegionViewSet) #

router.register(r'forum-tags', ForumTagViewSet)
router.register(r'forum-threads', ForumThreadViewSet, basename='forumthread') # Use basename if queryset is dynamic or complex
router.register(r'forum-comments', ForumCommentViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('users/get_user_details/', UserViewSet.as_view({'get': 'get_user_details'}), name='get_user_details'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]

urlpatterns += router.urls

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
