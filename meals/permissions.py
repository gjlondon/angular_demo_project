__author__ = 'rogueleaderr'

from rest_framework import permissions

class IsEaterOfMealOrAdmin(permissions.BasePermission):
    """
    Ensure meals can only be modified or deleted by admins or by the person who logged the meal.
    """
    def has_object_permission(self, request, view, meal):
        if request.user.is_admin:
            return True
        elif request.user:
            return meal.eater == request.user
        else:
            return False