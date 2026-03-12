from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import User, StudentProfile, RestaurantProfile


@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        if instance.role == User.CUSTOMER:
            StudentProfile.objects.create(user=instance)
        elif instance.role == User.BUSINESS:
            RestaurantProfile.objects.create(user=instance)


@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    # Save profile changes if user is updated
    if hasattr(instance, "student_profile"):
        instance.student_profile.save()
    elif hasattr(instance, "restaurant_profile"):
        instance.restaurant_profile.save()
