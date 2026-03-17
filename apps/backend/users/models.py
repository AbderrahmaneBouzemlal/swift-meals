from django.db import models
import uuid

from django.db import models
from django.contrib.auth.models import PermissionsMixin
from django.contrib.auth.base_user import AbstractBaseUser
from django.utils import timezone
from .managers import CustomUserManager


class User(AbstractBaseUser, PermissionsMixin):

    ADMIN = "ADMIN"
    BUSINESS = "BUSINESS"
    CUSTOMER = "CUSTOMER"

    ROLE_CHOICES = (
        (ADMIN, "Admin"),
        (BUSINESS, "Business"),
        (CUSTOMER, "Customer"),
    )

    uid = models.UUIDField(
        primary_key=False,
        default=uuid.uuid4,
        editable=False,
        unique=True,
        verbose_name="Public identifier",
    )
    email = models.EmailField(unique=True, db_index=True)
    name = models.CharField(max_length=150, blank=True, verbose_name="Full name")
    role = models.CharField(
        max_length=20,
        choices=ROLE_CHOICES,
        default=CUSTOMER,
        help_text="User role determines which profile is active",
    )
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)

    date_joined = models.DateTimeField(default=timezone.now)
    modified_date = models.DateTimeField(auto_now=True)

    objects = CustomUserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    class Meta:
        verbose_name = "user"
        verbose_name_plural = "users"
        ordering = ["-date_joined"]

    def __str__(self):
        return f"{self.email} ({self.get_role_display()})"

    def get_role_display(self):
        return dict(self.ROLE_CHOICES).get(self.role, self.role)


class CustomerProfile(models.Model):
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="customer_profile",
        limit_choices_to={"role": User.CUSTOMER},  # Optional: enforce role
    )
    profile_picture = models.ImageField(
        upload_to="profile_pictures/", blank=True, null=True
    )
    gender = models.CharField(
        max_length=10,
        choices=[("Male", "Male"), ("Female", "Female"), ("Other", "Other")],
        blank=True,
    )
    default_pickup_location = models.CharField(
        max_length=150, blank=True, help_text="e.g. Hostel A Lobby, Library Entrance"
    )
    phone_number = models.CharField(max_length=15, blank=True)

    class Meta:
        verbose_name = "customer profile"
        verbose_name_plural = "customer profiles"

    def __str__(self):
        return f"customer: {self.user.email}"


class RestaurantProfile(models.Model):
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="business_profile",
        limit_choices_to={"role": User.BUSINESS},
    )
    restaurant_name = models.CharField(max_length=150)
    location = models.CharField(max_length=200, help_text="Campus or nearby address")
    description = models.TextField(blank=True)
    cuisine_type = models.CharField(max_length=100, blank=True)
    phone_number = models.CharField(max_length=15, blank=True)
    logo = models.ImageField(upload_to="restaurant_logos/", blank=True, null=True)
    ssm_registration = models.CharField(max_length=50, blank=True)
    pickup_locations = models.TextField(
        blank=True,
        help_text="Comma-separated pickup points, e.g. Hostel Lobby, Library Entrance",
    )

    class Meta:
        verbose_name = "business profile"
        verbose_name_plural = "business profiles"

    def __str__(self):
        return f"Business: {self.restaurant_name} ({self.user.email})"
