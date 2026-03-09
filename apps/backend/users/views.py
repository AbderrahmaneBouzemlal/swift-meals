from django.shortcuts import render
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.decorators import action
from .models import User, StudentProfile, RestaurantProfile
from .serializers import (
    UserRegistrationSerializer,
    UserLoginSerializer,
    UserDetailSerializer,
    StudentProfileSerializer,
    RestaurantProfileSerializer,
)
from .permissions import IsStudent, IsRestaurantOwner, IsOwnerOrReadOnly

from .models import User


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


class ProfileViewSet(viewsets.GenericViewSet):
    """Mixed viewset for /me and profile updates"""

    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=["get"])
    def me(self, request):
        serializer = UserDetailSerializer(request.user)
        return Response(serializer.data)

    @action(detail=False, methods=["patch"], url_path="student/update")
    def update_student(self, request):
        if not hasattr(request.user, "student_profile"):
            return Response({"detail": "Not a student"}, status=403)
        profile = request.user.student_profile
        serializer = StudentProfileSerializer(profile, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    @action(detail=False, methods=["patch"], url_path="restaurant/update")
    def update_restaurant(self, request):
        if not hasattr(request.user, "restaurant_profile"):
            return Response({"detail": "Not a restaurant owner"}, status=403)
        profile = request.user.restaurant_profile
        serializer = RestaurantProfileSerializer(
            profile, data=request.data, partial=True
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


class RestaurantProfileViewSet(viewsets.ModelViewSet):
    queryset = RestaurantProfile.objects.all()
    serializer_class = RestaurantProfileSerializer
    permission_classes = [IsAuthenticated, IsRestaurantOwner, IsOwnerOrReadOnly]

    def get_queryset(self):
        # Vendors only see their own
        if self.request.user.role == "restaurant":
            return RestaurantProfile.objects.filter(user=self.request.user)
        return RestaurantProfile.objects.none()

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
