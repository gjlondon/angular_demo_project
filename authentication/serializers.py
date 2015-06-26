__author__ = 'rogueleaderr'

from django.contrib.auth import update_session_auth_hash

from rest_framework import serializers

from authentication.models import Account


class AccountSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False)
    confirm_password = serializers.CharField(write_only=True, required=False)
    admin_password = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = Account
        fields = ('id', 'email', 'username', 'password', "calorie_target",
                  'confirm_password', 'admin_password', 'is_admin',)
        read_only_fields = ('created_at', 'updated_at', 'is_admin')


