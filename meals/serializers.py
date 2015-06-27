__author__ = 'rogueleaderr'
from rest_framework import serializers

from authentication.serializers import AccountSerializer
from meals.models import Meal


class MealSerializer(serializers.ModelSerializer):
    """
    Encode outgoing meal data into JSON and deserialize income JSON.
    """

    eater = AccountSerializer(read_only=True, required=False)

    class Meta:
        model = Meal

        fields = ('id',
                  'eater',
                  'name',
                  'description',
                  'calories',
                  "meal_time",
                  )
        read_only_fields = ('id', 'created_at', 'updated_at')

    def get_validation_exclusions(self, *args, **kwargs):
        """
        Don't require a meal eater to be provided in request. We'll automatically set it to the maker of the request later.
        :param args:
        :param kwargs:
        :return:
        """
        exclusions = super(MealSerializer, self).get_validation_exclusions()
        return exclusions + ['eater']