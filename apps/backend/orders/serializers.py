from rest_framework import serializers
from django.utils import timezone
from .models import MealSlot, MenuItem, Order, OrderItem


class MenuItemSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    def get_image_url(self, obj):
        if not obj.image:
            return None
        request = self.context.get("request")
        return request.build_absolute_uri(obj.image.url) if request else obj.image.url

    class Meta:
        model = MenuItem
        fields = [
            "id",
            "name",
            "description",
            "price",
            "image_url",
            "is_available",
        ]
        read_only_fields = ["id"]


class MenuItemWriteSerializer(serializers.ModelSerializer):
    """Used for create/update — accepts image file, slot set by view."""

    class Meta:
        model = MenuItem
        fields = ["name", "description", "price", "image", "is_available"]


class MealSlotSerializer(serializers.ModelSerializer):
    """Read — includes nested menu items and derived fields."""

    menu_items = MenuItemSerializer(many=True, read_only=True)
    restaurant_name = serializers.CharField(
        source="restaurant.restaurant_name", read_only=True
    )
    is_available_today = serializers.BooleanField(read_only=True)
    orders_today = serializers.SerializerMethodField()

    def get_orders_today(self, obj):
        today = timezone.localdate()
        return obj.orders.filter(scheduled_at=today).count()

    class Meta:
        model = MealSlot
        fields = [
            "id",
            "restaurant_name",
            "name",
            "repeat",
            "days",
            "date",
            "start_time",
            "end_time",
            "max_orders",
            "order_cutoff",
            "is_active",
            "is_available_today",
            "orders_today",
            "menu_items",
        ]
        read_only_fields = ["id", "is_available_today", "orders_today"]


class MealSlotWriteSerializer(serializers.ModelSerializer):
    """Used for create/update — leaner, no nested data."""

    class Meta:
        model = MealSlot
        fields = [
            "name",
            "repeat",
            "days",
            "date",
            "start_time",
            "end_time",
            "max_orders",
            "order_cutoff",
            "is_active",
        ]

    def validate(self, data):
        repeat = data.get("repeat", self.instance.repeat if self.instance else "weekly")

        if repeat == "weekly" and not data.get("days"):
            raise serializers.ValidationError(
                {"days": "Days are required for weekly slots."}
            )

        if repeat == "once" and not data.get("date"):
            raise serializers.ValidationError(
                {"date": "A date is required for one-off offerings."}
            )

        if (
            repeat == "once"
            and data.get("date")
            and data["date"] < timezone.localdate()
        ):
            raise serializers.ValidationError(
                {"date": "Offering date cannot be in the past."}
            )

        start = data.get("start_time")
        end = data.get("end_time")
        if start and end and start >= end:
            raise serializers.ValidationError(
                {"end_time": "End time must be after start time."}
            )

        return data


class OrderItemSerializer(serializers.ModelSerializer):
    menu_item_name = serializers.CharField(source="menu_item.name", read_only=True)
    menu_item_price = serializers.DecimalField(
        source="menu_item.price", max_digits=8, decimal_places=2, read_only=True
    )
    subtotal = serializers.DecimalField(max_digits=8, decimal_places=2, read_only=True)

    class Meta:
        model = OrderItem
        fields = [
            "id",
            "menu_item",
            "menu_item_name",
            "menu_item_price",
            "quantity",
            "subtotal",
        ]


class OrderSerializer(serializers.ModelSerializer):
    """Read — full order with items and total."""

    items = OrderItemSerializer(many=True, read_only=True)
    total = serializers.DecimalField(max_digits=8, decimal_places=2, read_only=True)
    slot_name = serializers.CharField(source="slot.name", read_only=True)
    customer_name = serializers.CharField(source="customer.user.name", read_only=True)

    class Meta:
        model = Order
        fields = [
            "id",
            "slot",
            "slot_name",
            "customer_name",
            "pickup_location",
            "status",
            "note",
            "scheduled_at",
            "created_at",
            "items",
            "total",
        ]
        read_only_fields = ["id", "scheduled_at", "created_at", "total"]


class OrderWriteSerializer(serializers.ModelSerializer):
    """Used for create — items nested."""

    items = serializers.ListField(child=serializers.DictField(), write_only=True)

    class Meta:
        model = Order
        fields = ["slot", "pickup_location", "note", "items"]

    def validate_items(self, items):
        if not items:
            raise serializers.ValidationError("An order must have at least one item.")
        return items

    def validate(self, data):
        slot = data.get("slot")
        today = timezone.localdate()

        if not slot.is_available_today:
            raise serializers.ValidationError(
                "This slot is no longer accepting orders."
            )

        if slot.max_orders:
            count = slot.orders.filter(scheduled_at=today).count()
            if count >= slot.max_orders:
                raise serializers.ValidationError("This slot is full.")

        # validate each item belongs to this slot and is available
        for item in data.get("items", []):
            try:
                menu_item = MenuItem.objects.get(
                    id=item["menu_item"], slot=slot, is_available=True
                )
            except MenuItem.DoesNotExist:
                raise serializers.ValidationError(
                    f"Menu item {item.get('menu_item')} is not available in this slot."
                )

        return data

    def create(self, validated_data):
        items_data = validated_data.pop("items")
        order = Order.objects.create(**validated_data)

        OrderItem.objects.bulk_create(
            [
                OrderItem(
                    order=order,
                    menu_item_id=item["menu_item"],
                    quantity=item.get("quantity", 1),
                )
                for item in items_data
            ]
        )
        return order


class OrderStatusSerializer(serializers.ModelSerializer):
    """Business uses this to update order status only."""

    class Meta:
        model = Order
        fields = ["status"]

    def validate_status(self, value):
        valid_transitions = {
            "pending": ["confirmed", "cancelled"],
            "confirmed": ["preparing", "cancelled"],
            "preparing": ["ready"],
            "ready": ["completed"],
        }
        current = self.instance.status
        allowed = valid_transitions.get(current, [])

        if value not in allowed:
            raise serializers.ValidationError(
                f"Cannot transition from '{current}' to '{value}'. "
                f"Allowed: {allowed}"
            )
        return value
