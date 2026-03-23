from rest_framework_nested import routers
from .views import MealSlotViewSet, MenuItemViewSet, OrderViewSet

router = routers.DefaultRouter()
router.register("slots",  MealSlotViewSet, basename="slots")
router.register("orders", OrderViewSet,    basename="orders")

# nested: /slots/{slot_pk}/menu-items/
slots_router = routers.NestedDefaultRouter(router, "slots", lookup="slot")
slots_router.register("menu-items", MenuItemViewSet, basename="slot-menu-items")

urlpatterns = router.urls + slots_router.urls