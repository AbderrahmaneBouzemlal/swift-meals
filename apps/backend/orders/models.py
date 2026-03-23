# models.py
from django.db import models
from django.utils import timezone
import datetime
from users.models import BusinessProfile, CustomerProfile


class MealSlot(models.Model):
    """
    Covers both recurring restaurant slots and one-off student offerings.
    business_type on the restaurant determines how this is used.
    """

    REPEAT_CHOICES = [
        ("daily", "Every day"),
        ("weekly", "Selected days of the week"),
        ("once", "One-off — student seller"),
    ]

    DAY_CHOICES = [
        (0, "Monday"),
        (1, "Tuesday"),
        (2, "Wednesday"),
        (3, "Thursday"),
        (4, "Friday"),
        (5, "Saturday"),
        (6, "Sunday"),
    ]

    restaurant = models.ForeignKey(
        BusinessProfile, on_delete=models.CASCADE, related_name="meal_slots"
    )
    name = models.CharField(max_length=100)
    start_time = models.TimeField()
    end_time = models.TimeField()
    repeat = models.CharField(max_length=10, choices=REPEAT_CHOICES, default="weekly")
    days = models.JSONField(default=list)
    date = models.DateField(null=True, blank=True)
    max_orders = models.PositiveIntegerField(null=True, blank=True)
    order_cutoff = models.PositiveIntegerField(
        default=30,
        help_text="Minutes before start_time that orders stop being accepted",
    )
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["start_time"]

    def __str__(self):
        return f"{self.restaurant.restaurant_name} — {self.name}"

    @property
    def is_available_today(self):
        """Is this slot available for ordering right now?"""
        now = timezone.localtime()
        today = now.date()

        if self.repeat == "once":
            if self.date != today:
                return False
        elif self.repeat == "weekly":
            if now.weekday() not in (self.days or []):
                return False

        # check cutoff — stop accepting orders N minutes before start
        cutoff_dt = datetime.datetime.combine(
            today, self.start_time
        ) - datetime.timedelta(minutes=self.order_cutoff)
        cutoff_dt = timezone.make_aware(cutoff_dt)

        return now < cutoff_dt


class MenuItem(models.Model):
    slot = models.ForeignKey(
        MealSlot, on_delete=models.CASCADE, related_name="menu_items"
    )
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=8, decimal_places=2)
    image = models.ImageField(upload_to="menu_items/", null=True, blank=True)
    is_available = models.BooleanField(default=True)

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return f"{self.name} — {self.slot.name}"


class Order(models.Model):
    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("confirmed", "Confirmed"),
        ("preparing", "Preparing"),
        ("ready", "Ready for pickup"),
        ("completed", "Completed"),
        ("cancelled", "Cancelled"),
    ]

    customer = models.ForeignKey(
        CustomerProfile, on_delete=models.CASCADE, related_name="orders"
    )
    slot = models.ForeignKey(MealSlot, on_delete=models.CASCADE, related_name="orders")
    pickup_location = models.CharField(max_length=200)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
    note = models.TextField(blank=True)
    scheduled_at = models.DateField()  # DateField — just the day
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        # one order per customer per slot per day
        unique_together = ["customer", "slot", "scheduled_at"]
        ordering = ["-created_at"]

    @property
    def total(self):
        return sum(item.subtotal for item in self.items.all())

    def __str__(self):
        return f"Order #{self.pk} — {self.customer} — {self.slot.name}"


class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="items")
    menu_item = models.ForeignKey(
        MenuItem, on_delete=models.PROTECT, related_name="order_items"
    )
    quantity = models.PositiveIntegerField(default=1)

    @property
    def subtotal(self):
        return self.menu_item.price * self.quantity

    def __str__(self):
        return f"{self.quantity}x {self.menu_item.name}"
