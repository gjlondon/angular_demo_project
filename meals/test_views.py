from rest_framework import status
from rest_framework.reverse import reverse
from rest_framework.test import APITestCase

__author__ = 'rogueleaderr'

class MealsAPITest(APITestCase):

    def test_create_meal_from_valid_data(self):

        self.assertTrue(False)
        url = reverse('index', args=None)
        data = {'username': 'DabApps'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data, data)

    def test_create_meal_from_invalid_data(self):
        self.assertTrue(False)

    def test_update_meal_with_valid_data(self):
        self.assertTrue(False)

    def test_update_meal_with_invalid_data(self):
        self.assertTrue(False)

    def test_delete_meal(self):
        self.assertTrue(False)

    def test_non_admin_can_only_create_own_meal(self):
        self.assertTrue(False)

    def test_non_admin_can_only_edit_own_meal(self):
        self.assertTrue(False)

    def test_non_admin_can_only_delete_own_meal(self):
        self.assertTrue(False)

    def test_admin_can_edit_any_meal(self):
        self.assertTrue(False)

    def test_admin_can_delete_any_meal(self):
        self.assertTrue(False)

    def test_admin_sees_all_meals(self):
        self.assertTrue(False)

    def test_non_admin_sees_only_own_meals(self):
        self.assertTrue(False)

    def test_meals_ordered_by_meal_time(self):
        self.assertTrue(False)