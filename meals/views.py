from rest_framework import permissions, viewsets

from meals.models import Meal
from meals.permissions import IsEaterOfMealOrAdmin
from meals.serializers import MealSerializer


class MealViewSet(viewsets.ModelViewSet):
    """
    Core controller for the Meals REST API.

    Automatically generates GET/POST/PUT/DELETE endpoints.
    """
    serializer_class = MealSerializer

    def get_permissions(self):
        """
        Only admins and creators of meal objects and interact with them.
        :return:
        """
        return (permissions.IsAuthenticated(), IsEaterOfMealOrAdmin(),)

    def perform_create(self, serializer):
        """
        Create new meal objects and automatically set the eater to be the maker of the request.

        :param serializer:
        :return:
        """
        instance = serializer.save(eater=self.request.user)
        return super(MealViewSet, self).perform_create(serializer)

    def get_queryset(self):
        """
        Ensure that users can only see their own meals, unless they're admins.
        :return:
        """
        user = self.request.user
        if user.is_admin:
            return Meal.objects.order_by('-meal_time')
        else:
            return Meal.objects.filter(eater=user).order_by('-meal_time')