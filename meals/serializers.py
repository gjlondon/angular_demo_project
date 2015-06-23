__author__ = 'rogueleaderr'

from rest_framework import serializers

from authentication.serializers import Account, AccountSerializer
from meals.models import Meal


class MealSerializer(serializers.ModelSerializer):
    eater = AccountSerializer(read_only=True, required=False)

    class Meta:
        model = Meal

        fields = ('id',
                  'eater',
                  'name',
                  'description',
                  'calories',

                  "meal_date",
                  )
        read_only_fields = ('id', 'created_at', 'updated_at')

    def get_validation_exclusions(self, *args, **kwargs):
        exclusions = super(MealSerializer, self).get_validation_exclusions()

        return exclusions + ['eater']