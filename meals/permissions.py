__author__ = 'rogueleaderr'

from rest_framework import permissions

class IsEaterOfMealOrAdmin(permissions.BasePermission):

    def has_object_permission(self, request, view, meal):
        if request.user.is_admin:
            return True
        elif request.user:
            return meal.eater == request.user
        else:
            return False