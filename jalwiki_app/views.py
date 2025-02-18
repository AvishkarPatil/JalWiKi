from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.parsers import JSONParser, MultiPartParser, FormParser
from rest_framework.response import Response
from django.contrib.auth.hashers import check_password
from rest_framework_simplejwt.tokens import RefreshToken

from .models import User
from .serializers import UserSerializer

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    parser_classes = (JSONParser,)

    def get_tokens_for_user(self, user):
        refresh = RefreshToken.for_user(user)
        return {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }

    @action(detail=False, methods=['post'])
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
                tokens = self.get_tokens_for_user(user)
                return Response({
                    "status": True,
                    "message": "Login successful",
                    "username": user_data['username'],
                    "user_id": user_data['id'],  # Include user ID in the response
                    "tokens": tokens
                }, status=status.HTTP_200_OK)
            else:
                return Response({"status": False, "message": "Invalid credentials"},
                                status=status.HTTP_401_UNAUTHORIZED)
        except User.DoesNotExist:
            return Response({"status": False, "message": "User not found"}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=False, methods=['post'])
    def register(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"status": True, "message": "Registration successful", "data": serializer.data},
                            status=status.HTTP_201_CREATED)
        else:
            return Response({"status": False, "message": "Registration failed", "errors": serializer.errors},
                            status=status.HTTP_400_BAD_REQUEST)


    @action(detail=False, methods=['get'], url_path='get-by-email')
    def get_by_email(self, request):
        email = request.query_params.get('email')
        if not email:
            return Response({"message": "Email parameter is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(email=email)
            serializer = UserSerializer(user)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({"message": "User not found"}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=False, methods=['post'], parser_classes=[MultiPartParser, FormParser])
    def update_profile_picture(self, request):
        user_id = request.data.get('user_id')
        profile_pic = request.data.get('profile_pic')

        if not user_id or not profile_pic:
            return Response({"status": False, "message": "Missing user ID or profile picture"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(id=user_id)
            user.profile_pic = profile_pic
            user.save()
            return Response({"status": True, "message": "Profile picture updated successfully"}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({"status": False, "message": "User not found"}, status=status.HTTP_404_NOT_FOUND)

