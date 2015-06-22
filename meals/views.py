from rest_framework import permissions, viewsets
from rest_framework.response import Response

from meals.models import Meal
from meals.permissions import IsEaterOfMeal
from meals.serializers import MealSerializer


class MealViewSet(viewsets.ModelViewSet):
    queryset = Meal.objects.order_by('-created_at')
    serializer_class = MealSerializer

    def get_permissions(self):
        if self.request.method in permissions.SAFE_METHODS:
            return (permissions.AllowAny(),)
        return (permissions.IsAuthenticated(), IsEaterOfMeal(),)

    def perform_create(self, serializer):
        instance = serializer.save(eater=self.request.user)
        return super(MealViewSet, self).perform_create(serializer)



class AccountMealsViewSet(viewsets.ViewSet):
    queryset = Meal.objects.select_related('eater').all()
    serializer_class = MealSerializer

    def list(self, request, account_username=None):
        queryset = self.queryset.filter(author__username=account_username)
        serializer = self.serializer_class(queryset, many=True)

        return Response(serializer.data, content_type='application/json')