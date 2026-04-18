from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import User, CustomerProfile, BusinessProfile


@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        print(
            f"Creating profile for new user: {instance.email} with role {instance.role}"
        , User.Role.customer)
        if instance.role == User.Role.customer:
            CustomerProfile.objects.create(user=instance)
        elif instance.role == User.Role.business:
            BusinessProfile.objects.create(user=instance)


@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    # Save profile changes if user is updated
    if hasattr(instance, "customer_profile"):
        instance.customer_profile.save()
    elif hasattr(instance, "business_profile"):
        instance.business_profile.save()
