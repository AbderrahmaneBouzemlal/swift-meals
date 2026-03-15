from django.shortcuts import render
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.decorators import action
from rest_framework.parsers import MultiPartParser
from .serializers import (
    UserRegistrationSerializer,
    UserLoginSerializer,
    UserDetailSerializer,
    CustomerProfileSerializer,
    RestaurantProfileSerializer,
    CustomerPictureSerializer,
    RestaurantLogoSerializer,
)
from .permissions import isCustomer, isBusinessOwner, IsOwnerOrReadOnly


class UserRegistrationView(APIView):
    serializer_class = UserRegistrationSerializer
    permission_classes = (AllowAny,)

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        valid = serializer.is_valid(raise_exception=True)

        if valid:
            serializer.save()
            status_code = status.HTTP_201_CREATED

            response = {
                "success": True,
                "statusCode": status_code,
                "message": "User successfully registered!",
                "user": serializer.data,
            }

            return Response(response, status=status_code)


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
    """Mixed viewset for /me and profile updates"""

    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=["get"])
    def me(self, request):
        serializer = UserDetailSerializer(request.user)
        return Response(serializer.data)

    @action(detail=False, methods=["patch"], url_path="customer/update")
    def update_student(self, request):
        if not hasattr(request.user, "student_profile"):
            return Response({"detail": "Not a customer"}, status=403)
        profile = request.user.student_profile
        serializer = CustomerProfileSerializer(profile, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    @action(detail=False, methods=["patch"], url_path="business/update")
    def update_restaurant(self, request):
        if not hasattr(request.user, "restaurant_profile"):
            return Response({"detail": "Not a business owner"}, status=403)
        profile = request.user.restaurant_profile
        serializer = RestaurantProfileSerializer(
            profile, data=request.data, partial=True
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


class ProfilePictureView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser]

    def patch(self, request):
        if request.user.role == "CUSTOMER":
            profile = request.user.CustomerProfile
            Serializer = CustomerPictureSerializer
        else:
            profile = request.user.restaurantprofile
            Serializer = RestaurantLogoSerializer

        serializer = Serializer(profile, data=request.files, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)
