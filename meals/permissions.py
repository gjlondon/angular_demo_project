__author__ = 'rogueleaderr'

from rest_framework import permissions

class IsEaterOfMeal(permissions.BasePermission):

    def has_object_permission(self, request, view, meal):
        if request.user:
            return meal.eater == request.user
        return False