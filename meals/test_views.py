import datetime
from django.contrib.auth.models import Group
from rest_framework import status
from rest_framework.reverse import reverse
from rest_framework.test import APITestCase
from authentication.models import Account
from meals.models import Meal

__author__ = 'rogueleaderr'


class MealsAPITest(APITestCase):
    def setUp(self):
        self.sample_meal_info = {
            "eater": "John",
            "name": "Burger",
            "description": "great!",
            "calories": 300,
            "meal_time": "2015-06-25T05:37:45.331352Z",
        }
        admin_group = Group(name="Admin")
        admin_group.save()
        self.admin_group = admin_group
        self.sample_password = "sample_password"
        self.sample_user_credentials = {
            "email": "george.j.london@gmail.com",
            "username": "george",
            "password": self.sample_password,
            "calorie_target": 3500,
        }
        self.sample_admin_credentials = {'email': "a@gmail.com", 'username': "a", 'password': self.sample_password}
        self.sample_user = Account.objects.create_user(**self.sample_user_credentials)
        self.sample_admin = Account.objects.create_superuser(**self.sample_admin_credentials)
        self.sample_meal_info_2 = {
            "eater": self.sample_user,
            "name": "Pizza",
            "description": "good!",
            "calories": 200,
            "meal_time": "2015-06-25T05:37:45.331352Z",
        }
        self.sample_meal = Meal(**self.sample_meal_info_2)
        self.sample_meal.save()
        self.sample_meal_info_3 = {
            "eater": self.sample_admin,
            "name": "Burrito",
            "description": "good!",
            "calories": 200,
            "meal_time": "2015-07-25T05:37:45.331352Z",
        }
        self.sample_admin_meal = Meal(**self.sample_meal_info_3)
        self.sample_admin_meal.save()

    def test_logged_out_user_cannot_create_meal(self):
        url = reverse("meals-list")
        response = self.client.post(url, self.sample_meal_info)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_logged_out_user_cannot_see_meal(self):
        url = reverse("meals-detail", args=(1,))
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_logged_out_user_cannot_update_meal(self):
        url = reverse("meals-detail", args=(1,))
        response = self.client.put(url, self.sample_meal_info)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_logged_out_user_cannot_delete_meal(self):
        url = reverse("meals-detail", args=(1,))
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_create_meal_from_valid_data(self):
        url = reverse("meals-list")
        self.client.login(username=self.sample_user.username, password=self.sample_password)
        response = self.client.post(url, self.sample_meal_info)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.content,
                         '{"id":3,"eater":{"id":1,"email":"george.j.london@gmail.com","username":"george","calorie_target":2000,"is_admin":false},"name":"Burger","description":"great!","calories":300,"meal_time":"2015-06-25T05:37:45.331352Z"}')

    def test_create_meal_from_invalid_data(self):
        invalid_meal = {
            "name": 500,
            "meal_time": 500,
            "calories": "beans"
        }
        url = reverse("meals-list")
        self.client.login(username=self.sample_user.username, password=self.sample_password)
        response = self.client.post(url, invalid_meal)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_update_meal_with_valid_data(self):
        self.client.login(username=self.sample_user.username, password=self.sample_password)
        url = reverse("meals-detail", args=(1,))
        response = self.client.put(url, self.sample_meal_info)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.content,
                         '{"id":1,"eater":{"id":1,"email":"george.j.london@gmail.com","username":"george","calorie_target":2000,"is_admin":false},"name":"Burger","description":"great!","calories":300,"meal_time":"2015-06-25T05:37:45.331352Z"}')

    def test_update_meal_with_invalid_data(self):
        invalid_meal = {
            "name": 500,
            "meal_time": 500,
            "calories": "beans"
        }
        self.client.login(username=self.sample_user.username, password=self.sample_password)
        url = reverse("meals-detail", args=(1,))
        response = self.client.put(url, invalid_meal)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_can_view_own_meal_detail(self):
        self.client.login(username=self.sample_user.username, password=self.sample_password)
        url = reverse("meals-detail", args=(1,))
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.content,
                         '{"id":1,"eater":{"id":1,"email":"george.j.london@gmail.com","username":"george","calorie_target":2000,"is_admin":false},"name":"Pizza","description":"good!","calories":200,"meal_time":"2015-06-25T05:37:45.331352Z"}')

    def test_delete_meal(self):
        self.client.login(username=self.sample_user.username, password=self.sample_password)
        url = reverse("meals-detail", args=(1,))
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_non_admin_can_only_create_own_meal(self):
        friends_meal = {
            "eater": self.sample_admin,
            "name": "Pizza",
            "description": "good!",
            "calories": 200,
            "meal_time": "2015-06-25T05:37:45.331352Z",
        }
        url = reverse("meals-list")
        self.client.login(username=self.sample_user.username, password=self.sample_password)
        response = self.client.post(url, friends_meal)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.content,
                         '{"id":3,"eater":{"id":1,"email":"george.j.london@gmail.com","username":"george","calorie_target":2000,"is_admin":false},"name":"Pizza","description":"good!","calories":200,"meal_time":"2015-06-25T05:37:45.331352Z"}')

    def test_non_admin_can_only_edit_own_meal(self):
        self.client.login(username=self.sample_user.username, password=self.sample_password)
        url = reverse("meals-detail", args=(2,))
        response = self.client.put(url, self.sample_meal_info)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_non_admin_can_only_delete_own_meal(self):
        self.client.login(username=self.sample_user.username, password=self.sample_password)
        url = reverse("meals-detail", args=(2,))
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_admin_can_edit_any_meal(self):
        self.client.login(username=self.sample_user.username, password=self.sample_password)
        url = reverse("meals-detail", args=(1,))
        response = self.client.put(url, self.sample_meal_info)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.content,
                         '{"id":1,"eater":{"id":1,"email":"george.j.london@gmail.com","username":"george","calorie_target":2000,"is_admin":false},"name":"Burger","description":"great!","calories":300,"meal_time":"2015-06-25T05:37:45.331352Z"}')

    def test_admin_can_delete_any_meal(self):
        self.client.login(username=self.sample_admin.username, password=self.sample_password)
        url = reverse("meals-detail", args=(1,))
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_admin_sees_all_meals(self):
        self.client.login(username=self.sample_admin.username, password=self.sample_password)
        url = reverse("meals-list")
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

    def test_non_admin_sees_only_own_meals(self):
        self.client.login(username=self.sample_user.username, password=self.sample_password)
        url = reverse("meals-list")
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_logged_out_user_sees_no_meals(self):
        url = reverse("meals-list")
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_meals_ordered_by_meal_time(self):
        self.client.login(username=self.sample_admin.username, password=self.sample_password)
        url = reverse("meals-list")
        response = self.client.get(url)
        self.assertEqual(response.data[0]["name"], "Burrito")