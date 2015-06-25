from rest_framework import permissions, viewsets

from meals.models import Meal
from meals.permissions import IsEaterOfMealOrAdmin
from meals.serializers import MealSerializer


class MealViewSet(viewsets.ModelViewSet):
    serializer_class = MealSerializer

    def get_permissions(self):
        return (permissions.IsAuthenticated(), IsEaterOfMealOrAdmin(),)

    def perform_create(self, serializer):
        instance = serializer.save(eater=self.request.user)
        return super(MealViewSet, self).perform_create(serializer)

    def get_queryset(self):
        user = self.request.user
        if user.is_admin:
            return Meal.objects.order_by('-meal_time')
        else:
            return Meal.objects.filter(eater=user).order_by('-meal_time')