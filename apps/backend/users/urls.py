from django.urls import path, include
from rest_framework_simplejwt import views as jwt_views

from .views import (
    UserRegistrationView,
    UserLoginView,
    ProfileViewSet,
    RestaurantProfileViewSet,
)
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r"profiles", ProfileViewSet, basename="profile")
router.register(r"restaurants", RestaurantProfileViewSet, basename="restaurant")


urlpatterns = [
    path("token/obtain/", jwt_views.TokenObtainPairView.as_view(), name="token_create"),
    path("token/refresh/", jwt_views.TokenRefreshView.as_view(), name="token_refresh"),
    path("register", UserRegistrationView.as_view(), name="register"),
    path("login", UserLoginView.as_view(), name="login"),
    path("", include(router.urls)),
]
