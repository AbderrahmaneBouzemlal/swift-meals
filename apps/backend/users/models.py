import uuid
from django.db import models
from django.contrib.auth.models import PermissionsMixin
from django.contrib.auth.base_user import AbstractBaseUser
from django.utils import timezone
from django.utils.text import slugify
from .managers import CustomUserManager


class User(AbstractBaseUser, PermissionsMixin):
    class Role(models.TextChoices):
        admin = ("ADMIN", "admin")
        business = ("BUSINESS", "business")
        customer = ("CUSTOMER", "customer")

    uid = models.UUIDField(
        primary_key=False,
        default=uuid.uuid4,
        editable=False,
        unique=True,
        verbose_name="Public identifier",
    )
    email = models.EmailField(unique=True, db_index=True)
    name = models.CharField(max_length=150, blank=True)
    role = models.CharField(
        max_length=20,
        choices=Role.choices,
        blank=True,
        null=True,
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
        return f"{self.email} ({self.role})"

    def save(self, *args, **kwargs):
        self.email = self.email.lower().strip()
        super().save(*args, **kwargs)


class CustomerProfile(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="customer_profile",
        limit_choices_to={"role": "CUSTOMER"},
    )
    profile_picture = models.ImageField(
        upload_to="profile_pictures/",
        blank=True,
        null=True,
    )
    gender = models.CharField(
        max_length=10,
        choices=[("Male", "Male"), ("Female", "Female")],
        blank=True,
    )
    default_pickup_location = models.CharField(max_length=150, blank=True)
    phone_number = models.CharField(max_length=15, blank=True)

    class Meta:
        verbose_name = "customer profile"
        verbose_name_plural = "customer profiles"

    def __str__(self):
        return f"Customer: {self.user.email}"


class Cuisine(models.Model):
    slug = models.SlugField(max_length=100, unique=True)
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "cuisine"
        verbose_name_plural = "cuisines"
        ordering = ["name"]

    def __str__(self):
        return self.name

    # ✅ computed — never stale
    @property
    def restaurant_count(self):
        return self.businesses.count()

    @property
    def active_slot_count(self):
        return (
            self.businesses.filter(meal_slots__is_active=True)
            .values("meal_slots")
            .distinct()
            .count()
        )

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)


class PickupLocation(models.Model):
    slug = models.SlugField(max_length=100, unique=True)
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "pickup location"
        verbose_name_plural = "pickup locations"
        ordering = ["name"]

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)


class BusinessProfile(models.Model):
    class BusinessType(models.TextChoices):
        STUDENT = ("student", "Student Seller")
        RESTAURANT = ("restaurant", "Restaurant")

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="business_profile",
        limit_choices_to={"role": "BUSINESS"},
    )
    restaurant_name = models.CharField(max_length=150)
    location = models.CharField(max_length=200)
    business_type = models.CharField(
        max_length=20,
        choices=BusinessType.choices,
        default=BusinessType.RESTAURANT,
    )
    is_live = models.BooleanField(default=False)
    description = models.TextField(blank=True)
    cuisines = models.ManyToManyField(
        Cuisine,
        blank=True,
        related_name="businesses",
    )
    phone_number = models.CharField(max_length=15, blank=True)
    logo = models.ImageField(
        upload_to="restaurant_logos/",
        blank=True,
        null=True,
    )
    ssm_registration = models.CharField(max_length=50, blank=True)
    pickup_locations = models.ManyToManyField(
        PickupLocation,
        blank=True,
        related_name="businesses",
    )

    class Meta:
        verbose_name = "business profile"
        verbose_name_plural = "business profiles"

    def __str__(self):
        return f"{self.restaurant_name} ({self.user.email})"

    @property
    def is_student_seller(self):
        return self.business_type == self.BusinessType.STUDENT
