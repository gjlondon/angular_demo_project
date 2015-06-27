__author__ = 'rogueleaderr'

from rest_framework import permissions


class IsAccountOwner(permissions.BasePermission):
    """
    Enforces that logged in users can only modify their own accounts.
    """
    def has_object_permission(self, request, view, account):
        if request.user:
            return account.username == request.user.username
        return False