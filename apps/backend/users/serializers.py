from django.contrib.auth import authenticate
from django.contrib.auth.models import update_last_login
from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken

from .models import User, CustomerProfile, RestaurantProfile


class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    role_str = serializers.CharField(write_only=True, required=False, source="role")
    access = serializers.CharField(read_only=True)
    refresh = serializers.CharField(read_only=True)

    class Meta:
        model = User
        fields = ("email", "password", "name", "role_str", "access", "refresh")

    def create(self, validated_data):
        role_map = {
            "business": User.BUSINESS,
            "customer": User.CUSTOMER,
        }
        role_input = validated_data.pop("role", "customer").lower()
        validated_data["role"] = role_map.get(role_input, User.CUSTOMER)

        user = User.objects.create_user(**validated_data)
        refresh = RefreshToken.for_user(user)
        refresh_token = str(refresh)
        access_token = str(refresh.access_token)

        update_last_login(None, user)
        return {
            "access": access_token,
            "refresh": refresh_token,
            "email": user.email,
        }


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

    customer_profile = serializers.SerializerMethodField(read_only=True)
    business_profile = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = User
        fields = [
            "id",
            "uid",
            "email",
            "name",
            "role",
            "customer_profile",
            "business_profile",
            "date_joined",
            "is_active",
        ]
        read_only_fields = ["uid", "date_joined", "role"]

    def get_customer_profile(self, obj):
        if hasattr(obj, "customer_profile"):
            return CustomerProfileSerializer(
                obj.customer_profile,
                context=self.context,  # ← forwards request to nested serializer
            ).data
        return None

    def get_business_profile(self, obj):
        if hasattr(obj, "business_profile"):
            return RestaurantProfileSerializer(
                obj.business_profile, context=self.context  # ← same here
            ).data
        return None


class CustomerProfileSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source="user.email", read_only=True)
    name = serializers.CharField(source="user.name", required=False)
    profile_picture_url = serializers.SerializerMethodField()

    def get_profile_picture_url(self, obj):
        if not obj.profile_picture:
            return None
        request = self.context.get("request")
        return (
            request.build_absolute_uri(obj.profile_picture.url)
            if request
            else obj.profile_picture.url
        )

    class Meta:
        model = CustomerProfile
        fields = [
            "id",
            "email",
            "name",
            "gender",
            "default_pickup_location",
            "phone_number",
            "profile_picture_url",
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
    logo_url = serializers.SerializerMethodField()

    def get_logo_url(self, obj):
        if not obj.logo:
            return None
        request = self.context.get("request")
        if request:
            return request.build_absolute_uri(obj.logo.url)
        return obj.logo.url

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
            "logo_url",
            "ssm_registration",
            "pickup_locations",
        ]
        read_only_fields = ["id", "email", "owner_name"]


class CustomerPictureSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomerProfile
        fields = ["profile_picture"]


class RestaurantLogoSerializer(serializers.ModelSerializer):
    class Meta:
        model = RestaurantProfile
        fields = ["logo"]
