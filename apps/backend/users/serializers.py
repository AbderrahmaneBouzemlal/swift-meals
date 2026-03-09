from django.contrib.auth import authenticate
from django.contrib.auth.models import update_last_login
from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken

from .models import User, StudentProfile, RestaurantProfile


class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ("email", "password")

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user


class UserLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(max_length=128, write_only=True)
    access = serializers.CharField(read_only=True)
    refresh = serializers.CharField(read_only=True)
    role = serializers.CharField(read_only=True)

    def validate(self, data):
        email = data["email"]
        password = data["password"]
        user = authenticate(email=email, password=password)

        if user is None:
            raise serializers.ValidationError("Invalid login credentials")

        try:
            refresh = RefreshToken.for_user(user)
            refresh_token = str(refresh)
            access_token = str(refresh.access_token)

            update_last_login(None, user)

            validation = {
                "access": access_token,
                "refresh": refresh_token,
                "email": user.email,
                "role": user.role,
            }

            return validation
        except User.DoesNotExist:
            raise serializers.ValidationError("Invalid login credentials")


class UserSerializer(serializers.ModelSerializer):
    role = serializers.CharField(source="get_role_display", read_only=True)

    class Meta:
        model = User
        fields = [
            "uid",
            "email",
            "name",
            "role",
            "date_joined",
            "is_active",
        ]
        read_only_fields = ["uid", "date_joined", "is_active"]


class UserDetailSerializer(serializers.ModelSerializer):
    """Used when returning full user info including profile"""

    student_profile = serializers.SerializerMethodField(read_only=True)
    restaurant_profile = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = User
        fields = [
            "uid",
            "email",
            "name",
            "role",
            "student_profile",
            "restaurant_profile",
            "date_joined",
            "is_active",
        ]
        read_only_fields = ["uid", "date_joined", "role"]

    def get_student_profile(self, obj):
        if hasattr(obj, "student_profile"):
            return StudentProfileSerializer(obj.student_profile).data
        return None

    def get_restaurant_profile(self, obj):
        if hasattr(obj, "restaurant_profile"):
            return RestaurantProfileSerializer(obj.restaurant_profile).data
        return None


class StudentProfileSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source="user.email", read_only=True)
    name = serializers.CharField(source="user.name", required=False)

    class Meta:
        model = StudentProfile
        fields = [
            "id",
            "email",
            "name",
            "student_id",
            "gender",
            "university",
            "default_pickup_location",
            "phone_number",
        ]
        read_only_fields = ["id", "email"]

    def update(self, instance, validated_data):
        user_data = validated_data.pop("user", {})

        for attr, value in user_data.items():
            setattr(instance.user, attr, value)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance


class RestaurantProfileSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source="user.email", read_only=True)
    owner_name = serializers.CharField(source="user.name", read_only=True)

    class Meta:
        model = RestaurantProfile
        fields = [
            "id",
            "email",
            "owner_name",
            "restaurant_name",
            "location",
            "description",
            "cuisine_type",
            "phone_number",
            "logo",
            "ssm_registration",
            "pickup_locations",
        ]
        read_only_fields = ["id", "email", "owner_name"]

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        if instance.logo:
            ret["logo"] = instance.logo.url
        return ret
