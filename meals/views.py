from rest_framework import permissions, viewsets
from rest_framework.response import Response

from meals.models import Meal
from meals.permissions import IsEaterOfMeal
from meals.serializers import MealSerializer


class MealViewSet(viewsets.ModelViewSet):
    serializer_class = MealSerializer

    def get_permissions(self):
        if self.request.method in permissions.SAFE_METHODS:
            return (permissions.AllowAny(),)
        return (permissions.IsAuthenticated(), IsEaterOfMeal(),)

    def perform_create(self, serializer):
        instance = serializer.save(eater=self.request.user)
        return super(MealViewSet, self).perform_create(serializer)

    def get_queryset(self):
        user = self.request.user
        if user.is_admin:
            return Meal.objects.order_by('-created_at')
        else:
            return Meal.objects.filter(eater=user).order_by('-created_at')