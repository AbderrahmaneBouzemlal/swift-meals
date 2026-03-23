from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, JSONParser
from django.utils import timezone

from .models import MealSlot, MenuItem, Order
from .serializers import (
    MealSlotSerializer,
    MealSlotWriteSerializer,
    MenuItemSerializer,
    MenuItemWriteSerializer,
    OrderSerializer,
    OrderWriteSerializer,
    OrderStatusSerializer,
)
from .permissions import IsBusinessOwner, IsCustomer, IsSlotOwner, IsOrderOwner


class MealSlotViewSet(viewsets.ModelViewSet):
    """
    GET    /slots/          — customers browse available slots today
    POST   /slots/          — business creates a slot
    GET    /slots/{id}/     — slot detail with menu items
    PATCH  /slots/{id}/     — business updates their slot
    DELETE /slots/{id}/     — business deletes their slot
    GET    /slots/{id}/orders/today/ — business views today's orders
    """

    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.action in ("create", "update", "partial_update"):
            return MealSlotWriteSerializer
        return MealSlotSerializer

    def get_serializer_context(self):
        return {**super().get_serializer_context(), "request": self.request}

    def get_queryset(self):
        if self.request.user.role == "BUSINESS":
            return MealSlot.objects.filter(
                restaurant=self.request.user.business_profile
            ).prefetch_related("menu_items")

        # customers see active slots available today
        return (
            MealSlot.objects.filter(is_active=True)
            .select_related("restaurant")
            .prefetch_related("menu_items")
        )

    def get_permissions(self):
        if self.action in (
            "create",
            "update",
            "partial_update",
            "destroy",
            "todays_orders",
        ):
            return [IsAuthenticated(), IsBusinessOwner(), IsSlotOwner()]
        return [IsAuthenticated()]

    def perform_create(self, serializer):
        serializer.save(restaurant=self.request.user.business_profile)

    @action(detail=True, methods=["GET"], url_path="orders/today")
    def todays_orders(self, request, pk=None):
        slot = self.get_object()
        today = timezone.localdate()
        orders = (
            slot.orders.filter(scheduled_at=today)
            .select_related("customer__user")
            .prefetch_related("items__menu_item")
        )
        return Response(
            OrderSerializer(orders, many=True, context={"request": request}).data
        )


class MenuItemViewSet(viewsets.ModelViewSet):
    """
    Nested under a slot: /slots/{slot_pk}/menu-items/
    Business manages their own menu items.
    Customers read them via the slot detail.
    """

    permission_classes = [IsAuthenticated, IsBusinessOwner]
    parser_classes = [JSONParser, MultiPartParser]

    def get_serializer_class(self):
        if self.action in ("create", "update", "partial_update"):
            return MenuItemWriteSerializer
        return MenuItemSerializer

    def get_serializer_context(self):
        return {**super().get_serializer_context(), "request": self.request}

    def get_queryset(self):
        return MenuItem.objects.filter(
            slot__id=self.kwargs["slot_pk"],
            slot__restaurant=self.request.user.business_profile,
        )

    def get_permissions(self):
        if self.action in ("list", "retrieve"):
            return [IsAuthenticated()]
        return [IsAuthenticated(), IsBusinessOwner()]

    def perform_create(self, serializer):
        slot = MealSlot.objects.get(
            pk=self.kwargs["slot_pk"],
            restaurant=self.request.user.business_profile,
        )
        serializer.save(slot=slot)


class OrderViewSet(viewsets.ModelViewSet):
    """
    POST   /orders/          — customer places an order
    GET    /orders/          — customer sees their orders
    GET    /orders/{id}/     — order detail
    DELETE /orders/{id}/     — customer cancels a pending order
    PATCH  /orders/{id}/status/ — business updates order status
    """

    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.action == "create":
            return OrderWriteSerializer
        if self.action == "update_status":
            return OrderStatusSerializer
        return OrderSerializer

    def get_serializer_context(self):
        return {**super().get_serializer_context(), "request": self.request}

    def get_queryset(self):
        user = self.request.user
        if user.role == "BUSINESS":
            # business sees orders for their slots
            return (
                Order.objects.filter(slot__restaurant=user.business_profile)
                .select_related("customer__user", "slot")
                .prefetch_related("items__menu_item")
            )

        return (
            Order.objects.filter(customer=user.customer_profile)
            .select_related("slot")
            .prefetch_related("items__menu_item")
        )

    def get_permissions(self):
        if self.action == "create":
            return [IsAuthenticated(), IsCustomer()]
        if self.action == "update_status":
            return [IsAuthenticated(), IsBusinessOwner()]
        if self.action in ("destroy",):
            return [IsAuthenticated(), IsCustomer(), IsOrderOwner()]
        return [IsAuthenticated()]

    def perform_create(self, serializer):
        serializer.save(
            customer=self.request.user.customer_profile,
            scheduled_at=timezone.localdate(),
        )

    def destroy(self, request, *args, **kwargs):
        order = self.get_object()
        if order.status != "pending":
            return Response(
                {"detail": "Only pending orders can be cancelled."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        order.status = "cancelled"
        order.save(update_fields=["status"])
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=True, methods=["PATCH"], url_path="status")
    def update_status(self, request, pk=None):
        order = self.get_object()
        serializer = OrderStatusSerializer(order, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(OrderSerializer(order, context={"request": request}).data)
