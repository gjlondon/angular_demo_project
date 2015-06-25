__author__ = 'rogueleaderr'

from django.contrib.auth import update_session_auth_hash

from rest_framework import serializers

from authentication.models import Account


class AccountSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False, min_length=6)
    confirm_password = serializers.CharField(write_only=True, required=False)
    admin_password = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = Account
        fields = ('id', 'email', 'username', 'password', "calorie_target",
                  'confirm_password', 'admin_password', 'is_admin')
        read_only_fields = ('created_at', 'updated_at', 'is_admin')

        def create(self, validated_data):
            return Account.objects.create(**validated_data)

        def update(self, instance, validated_data):
            """
            Allows updating password because Django Rest Framework cannot set it directly.

            :param instance:
            :param validated_data:
            :return:
            """
            instance.save()

            password = validated_data.get('password', None)
            confirm_password = validated_data.get('confirm_password', None)

            if password and confirm_password and password == confirm_password:
                instance.set_password(password)
                instance.save()

            update_session_auth_hash(self.context.get('request'), instance)

            return instance