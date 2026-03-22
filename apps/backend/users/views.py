from django.shortcuts import render
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.decorators import action
from rest_framework.parsers import JSONParser, MultiPartParser
from .serializers import (
    UserRegistrationSerializer,
    UserLoginSerializer,
    UserDetailSerializer,
    CustomerProfileSerializer,
    BusinessProfileSerializer,
    CustomerPictureSerializer,
    RestaurantLogoSerializer,
)


class UserRegistrationView(APIView):
    serializer_class = UserRegistrationSerializer
    permission_classes = (AllowAny,)

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        valid = serializer.is_valid(raise_exception=True)

        if valid:
            serializer.save()

            response = {
                "success": True,
                "statusCode": status.HTTP_201_CREATED,
                "message": "User successfully registered!",
                "access": serializer.data["access"],
                "refresh": serializer.data["refresh"],
                "user": {
                    "email": serializer.data["email"],
                },
            }

            return Response(response)


class UserLoginView(APIView):
    serializer_class = UserLoginSerializer
    permission_classes = (AllowAny,)

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        valid = serializer.is_valid(raise_exception=True)

        if valid:
            status_code = status.HTTP_200_OK

            response = {
                "success": True,
                "statusCode": status_code,
                "message": "User logged in successfully",
                "access": serializer.data["access"],
                "refresh": serializer.data["refresh"],
                "authenticatedUser": {
                    "email": serializer.data["email"],
                    "role": serializer.data["role"],
                },
            }

            return Response(response, status=status_code)


class UserLogoutView(APIView):
    pass


class ProfileViewSet(viewsets.GenericViewSet):
    permission_classes = [IsAuthenticated]
    parser_classes = [JSONParser, MultiPartParser]

    def _picture_url(self, request, picture_field):
        """Returns absolute URL for a picture field, or None if not set."""
        if not picture_field:
            return None
        return request.build_absolute_uri(picture_field.url)

    @action(detail=False, methods=["GET"])
    def me(self, request):
        """
        Returns the user + profile.
        Picture URL is included here so the frontend
        never needs a separate GET /picture request.
        """
        serializer = UserDetailSerializer(request.user, context={"request": request})
        return Response(serializer.data)

    @action(detail=False, methods=["PATCH"], url_path="customer/update")
    def update_customer(self, request):
        if not hasattr(request.user, "customer_profile"):
            return Response({"detail": "Not a customer."}, status=403)

        profile = request.user.customer_profile
        serializer = CustomerProfileSerializer(profile, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    @action(detail=False, methods=["PATCH"], url_path="business/update")
    def update_business(self, request):
        if not hasattr(request.user, "business_profile"):
            return Response({"detail": "Not a business owner."}, status=403)

        profile = request.user.business_profile
        serializer = BusinessProfileSerializer(profile, data=request.data, partial=True)
        print(profile, request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    @action(
        detail=False,
        methods=["PATCH", "GET", "DELETE"],
        url_path="picture",
        parser_classes=[MultiPartParser],
    )
    def picture(self, request):
        """
        GET  /api/profile/picture/ — returns current picture URL
        PATCH /api/profile/picture/ — uploads a new picture
        """
        is_customer = request.user.role == "CUSTOMER"

        profile = (
            request.user.customer_profile
            if is_customer
            else request.user.business_profile
        )
        Serializer = (
            CustomerPictureSerializer if is_customer else RestaurantLogoSerializer
        )
        field = profile.profile_picture if is_customer else profile.logo

        if request.method == "GET":
            return Response({"url": self._picture_url(request, field)})

        if request.method == "DELETE":
            field.delete(save=True)
            return Response(status=204)

        # PATCH
        serializer = Serializer(profile, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        # refresh the field after save
        field = profile.profile_picture if is_customer else profile.logo
        return Response(
            {
                **serializer.data,
                "url": self._picture_url(request, field),
            }
        )
