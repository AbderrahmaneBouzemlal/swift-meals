from django.contrib.auth import authenticate
from django.contrib.auth.models import update_last_login
from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken
from django.conf import settings

from .models import User, CustomerProfile, BusinessProfile, Cuisine, PickupLocation


class CreatableSlugRelatedField(serializers.SlugRelatedField):
    def to_internal_value(self, data):
        try:
            model = self.get_queryset().model
            obj, created = model.objects.get_or_create(**{self.slug_field: data})
            if not obj.is_active:
                obj.is_active = True
                obj.save()
            return obj
        except (TypeError, ValueError):
            self.fail("invalid")


class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    role = serializers.CharField(required=False)
    access = serializers.CharField(read_only=True)
    refresh = serializers.CharField(read_only=True)

    class Meta:
        model = User
        fields = ("email", "password", "name", "role", "access", "refresh")

    def validate_email(self, value):
        return value.lower().strip()

    def create(self, validated_data):
        print("--- SERIALIZER CREATE DEBUG ---")
        print("Validated Data:", validated_data)

        email = validated_data["email"].lower().strip()
        if User.objects.filter(email=email).exists():
            print("ERROR: User with email", email, "already exists")
            raise serializers.ValidationError({"detail": "Email already in use."})

        user = User.objects.create_user(**validated_data)
        print("User created:", user.email)
        print("SECRET KEY TYPE:", type(settings.SECRET_KEY), repr(settings.SECRET_KEY))

        refresh = RefreshToken.for_user(user)
        refresh_token = str(refresh)
        access_token = str(refresh.access_token)

        update_last_login(None, user)
        print("Tokens generated")
        print("--- DEBUG END ---")

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
        email = data["email"].lower().strip()
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
        try:
            return CustomerProfileSerializer(
                obj.customer_profile,
                context=self.context,
            ).data
        except CustomerProfile.DoesNotExist:
            return None

    def get_business_profile(self, obj):
        try:
            return BusinessProfileSerializer(
                obj.business_profile, context=self.context
            ).data
        except BusinessProfile.DoesNotExist:
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
        instance.user.save()
        instance.save()
        return instance


class BusinessProfileSerializer(serializers.ModelSerializer):
    cuisines = CreatableSlugRelatedField(
        many=True,
        read_only=False,
        slug_field="name",
        queryset=Cuisine.objects.filter(is_active=True),
    )
    pickup_locations_list = CreatableSlugRelatedField(
        many=True,
        read_only=False,
        slug_field="name",
        queryset=PickupLocation.objects.filter(is_active=True),
        source="pickup_locations",
    )
    email = serializers.EmailField(source="user.email", read_only=True)
    owner_name = serializers.CharField(source="user.name", read_only=True)
    logo_url = serializers.SerializerMethodField()
    cuisine_type = serializers.SerializerMethodField()
    pickup_locations = serializers.SerializerMethodField()

    def get_logo_url(self, obj):
        if not obj.logo:
            return None
        request = self.context.get("request")
        if request:
            return request.build_absolute_uri(obj.logo.url)
        return obj.logo.url

    def get_cuisine_type(self, obj):
        """Return cuisines as comma-separated string for frontend compatibility"""
        cuisines = obj.cuisines.all().values_list("name", flat=True)
        return ", ".join(cuisines) if cuisines else ""

    def get_pickup_locations(self, obj):
        """Return pickup locations as comma-separated string for frontend compatibility"""
        locations = obj.pickup_locations.all().values_list("name", flat=True)
        return ", ".join(locations) if locations else ""

    class Meta:
        model = BusinessProfile
        fields = [
            "id",
            "email",
            "owner_name",
            "restaurant_name",
            "location",
            "business_type",
            "description",
            "phone_number",
            "logo",
            "logo_url",
            "ssm_registration",
            "cuisines",
            "cuisine_type",
            "pickup_locations",
            "pickup_locations_list",
            "is_live",
        ]
        read_only_fields = [
            "id",
            "email",
            "owner_name",
            "cuisine_type",
            "pickup_locations",
        ]


class CustomerPictureSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomerProfile
        fields = ["profile_picture"]


class RestaurantLogoSerializer(serializers.ModelSerializer):
    class Meta:
        model = BusinessProfile
        fields = ["logo"]


class CuisineSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cuisine
        fields = "__all__"
        read_only_fields = ["id", "slug"]


class PickupLocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = PickupLocation
        fields = "__all__"
