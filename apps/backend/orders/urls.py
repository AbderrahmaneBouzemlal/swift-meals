from rest_framework_nested import routers
from .views import MenuViewSet, MenuItemViewSet, MealSlotViewSet, OrderViewSet

router = routers.DefaultRouter()
router.register("menus", MenuViewSet, basename="menus")
router.register("slots", MealSlotViewSet, basename="slots")
router.register("orders", OrderViewSet, basename="orders")

menus_router = routers.NestedDefaultRouter(router, "menus", lookup="menu")
menus_router.register("items", MenuItemViewSet, basename="menu-items")

urlpatterns = router.urls + menus_router.urls
