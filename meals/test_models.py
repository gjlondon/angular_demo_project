import datetime
from django.test import TestCase
from meals.serializers import MealSerializer

__author__ = 'rogueleaderr'

class TestMealModel(TestCase):

    def setUp(self):
        self.sample_meal = {
            "eater": "John",
            "name": "Burger",
            "description": "great!",
            "calories": 300,
            "meal_time": str(datetime.datetime.now()),
        }

    def test_eater_is_not_validated(self):
        """
        Eater field is not checked to be Account instance.
        """
        serializer = MealSerializer(data=self.sample_meal)
        self.assertTrue(serializer.is_valid())