from django.db import models
import uuid

from django.db import models
from django.contrib.auth.models import PermissionsMixin
from django.contrib.auth.base_user import AbstractBaseUser
from django.utils import timezone
from .managers import CustomUserManager


class User(AbstractBaseUser, PermissionsMixin):

    ADMIN = 1
    RESTAURANT = 2
    STUDENT = 3

    ROLE_CHOICES = ((ADMIN, "Admin"), (RESTAURANT, "Restaurant"), (STUDENT, "Student"))

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
        default=STUDENT,
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


class StudentProfile(models.Model):
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="student_profile",
        limit_choices_to={"role": User.STUDENT},  # Optional: enforce role
    )
    student_id = models.CharField(
        max_length=20, unique=True, verbose_name="Student/Matric ID"
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
        verbose_name = "student profile"
        verbose_name_plural = "student profiles"

    def __str__(self):
        return f"Student: {self.user.email}"


class RestaurantProfile(models.Model):
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="restaurant_profile",
        limit_choices_to={"role": User.RESTAURANT},
    )
    restaurant_name = models.CharField(max_length=150)
    location = models.CharField(max_length=200, help_text="Campus or nearby address")
    description = models.TextField(blank=True)
    cuisine_type = models.CharField(max_length=100, blank=True)  # e.g. "Malay, Indian"
    phone_number = models.CharField(max_length=15, blank=True)
    logo = models.ImageField(upload_to="restaurant_logos/", blank=True, null=True)
    ssm_registration = models.CharField(
        max_length=50, blank=True
    )
    pickup_locations = models.TextField(
        blank=True,
        help_text="Comma-separated pickup points, e.g. Hostel Lobby, Library Entrance",
    )

    class Meta:
        verbose_name = "restaurant profile"
        verbose_name_plural = "restaurant profiles"

    def __str__(self):
        return f"Restaurant: {self.restaurant_name} ({self.user.email})"
