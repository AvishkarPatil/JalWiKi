from rest_framework import serializers
from jalwiki_app.models import User
from django.contrib.auth.hashers import make_password

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'
        extra_kwargs = {
            'password': {'write_only': True},  # Ensure password is write-only
        }

    def validate_mobile_no(self, value):
        if not value.isdigit() or len(value) != 10:
            raise serializers.ValidationError("Invalid mobile number. It should be 10 digits.")
        return value

    def create(self, validated_data):
        validated_data['password'] = make_password(validated_data['password'])
        return super().create(validated_data)