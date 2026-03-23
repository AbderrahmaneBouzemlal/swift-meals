from rest_framework.permissions import BasePermission, SAFE_METHODS


class IsBusinessOwner(BasePermission):
    """Only users with role BUSINESS can access."""

    message = "Only business accounts can perform this action."

    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == "BUSINESS"


class IsCustomer(BasePermission):
    """Only users with role CUSTOMER can access."""

    message = "Only customer accounts can perform this action."

    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == "CUSTOMER"


class IsSlotOwner(BasePermission):
    """Business can only modify their own slots."""

    message = "You do not own this meal slot."

    def has_object_permission(self, request, view, obj):
        if request.method in SAFE_METHODS:
            return True
        return obj.restaurant == request.user.business_profile


class IsOrderOwner(BasePermission):
    """Customers can only access their own orders."""

    message = "You do not own this order."

    def has_object_permission(self, request, view, obj):
        return obj.customer == request.user.customer_profile
