import json
from django.urls import include, path, reverse
from rest_framework import status
from rest_framework.test import APITestCase, APIClient, URLPatternsTestCase
from .models import User, Cuisine, PickupLocation


class UserTest(APITestCase, URLPatternsTestCase):
    """Test module for User"""

    urlpatterns = [
        path("api/auth/", include("users.urls")),
    ]

    def setUp(self):
        self.user1 = User.objects.create_user(
            email="test1@test.com",
            password="test",
        )

        self.admin = User.objects.create_superuser(
            email="admin@test.com",
            password="admin",
        )

    def test_login(self):
        """Test if a user can login and get a JWT response token"""
        url = reverse("login")
        data = {"email": "admin@test.com", "password": "admin"}
        response = self.client.post(url, data)
        response_data = json.loads(response.content)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response_data["success"], True)
        self.assertTrue("access" in response_data)

    def test_user_registration(self):
        """Test if a user can register"""
        url = reverse("register")
        data = {
            "email": "test2@test.com",
            "password": "Test@#23",
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_update_business_profile_with_creatable_fields(self):
        """Test business profile update with custom/creatable cuisines and pickup locations"""
        # Create a business user
        business_user = User.objects.create_user(
            email="business@test.com",
            password="password",
            role=User.Role.business
        )

        # Log in to get access token
        url = reverse("login")
        data = {"email": "business@test.com", "password": "password"}
        response = self.client.post(url, data)
        token = response.json()["access"]

        # Patch profile update endpoint
        update_url = reverse("profile-update-business")
        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION="Bearer " + token)

        patch_data = {
            "restaurant_name": "Test Resto",
            "business_type": "student",
            "cuisines": ["Malay", "Indian"],
            "pickup_locations": ["Library Lobby", "Main Cafeteria"]
        }

        # Verify that these cuisines/pickup locations don't exist yet
        self.assertFalse(Cuisine.objects.filter(name="Malay").exists())
        self.assertFalse(PickupLocation.objects.filter(name="Library Lobby").exists())

        response = client.patch(update_url, patch_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Verify they were created and mapped
        self.assertTrue(Cuisine.objects.filter(name="Malay").exists())
        self.assertTrue(Cuisine.objects.filter(name="Indian").exists())
        self.assertTrue(PickupLocation.objects.filter(name="Library Lobby").exists())
        self.assertTrue(PickupLocation.objects.filter(name="Main Cafeteria").exists())

        # Verify response matches
        response_data = response.json()
        self.assertEqual(response_data["restaurant_name"], "Test Resto")
        self.assertEqual(response_data["business_type"], "student")
        self.assertIn("Malay", response_data["cuisines"])
        self.assertIn("Library Lobby", response_data["pickup_locations"])
