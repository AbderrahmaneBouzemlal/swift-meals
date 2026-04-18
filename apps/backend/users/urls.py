from django.urls import path, include
from rest_framework_simplejwt import views as jwt_views

from .views import (
    UserRegistrationView,
    UserLoginView,
    UserLogoutView,
    ProfileViewSet,
    CuisineViewSet,
    PickupLocationViewSet,
)
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r"profile", ProfileViewSet, basename="profile")
router.register(r"cuisines", CuisineViewSet, basename="cuisine")
router.register(r"pickup-locations", PickupLocationViewSet, basename="pickup-location")


urlpatterns = [
    path(
        "auth/token/obtain",
        jwt_views.TokenObtainPairView.as_view(),
        name="token_create",
    ),
    path(
        "auth/token/refresh",
        jwt_views.TokenRefreshView.as_view(),
        name="token_refresh",
    ),
    path("auth/register", UserRegistrationView.as_view(), name="register"),
    path("auth/login", UserLoginView.as_view(), name="login"),
    path("auth/logout", UserLogoutView.as_view(), name="logout"),
    path("", include(router.urls)),
]
