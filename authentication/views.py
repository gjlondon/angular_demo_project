import json

from django.contrib.auth import authenticate, login, logout, update_session_auth_hash

# Create your views here.

from rest_framework import permissions, viewsets, status, views
from rest_framework.response import Response


from authentication.models import Account
from authentication.permissions import IsAccountOwner
from authentication.serializers import AccountSerializer


class AccountViewSet(viewsets.ModelViewSet):
    """
    Primary controller for all REST actions on our Account model (i.e. out primary user model)

    Automatically provides GET/POST/PUT/DELETE, though we override POST and PUT with custom behavior.
    """

    lookup_field = 'username'
    queryset = Account.objects.all()
    serializer_class = AccountSerializer

    def get_queryset(self):
        user = self.request.user
        # users can only see their own account if they try to list /accounts
        return Account.objects.filter(id=user.id)

    def get_permissions(self):
        """
        Specifies that anyone can create an account but only account owners can modify or view them.
        :return:
        """
        if self.request.method == 'POST':
            return (permissions.AllowAny(),)

        return (permissions.IsAuthenticated(), IsAccountOwner(),)

    def create(self, request):
        """
        Customizes the account creation behavior on a POST

        :param request:
        :return:
        """
        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():
            Account.objects.create_user(**serializer.validated_data)
            return Response(serializer.validated_data, status=status.HTTP_201_CREATED)

        return Response({
            'status': 'Bad request',
            'message': 'Account could not be created with received data.',
            'errors': json.dumps(serializer.errors)
        }, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, *args, **kwargs):
        """
        Customizes the account update behavior on a PUT.

        :param request:
        :param args:
        :param kwargs:
        :return:
        """

        username = kwargs.get("username", None)
        if username:
            instance = Account.objects.get(username=username)
            self.check_object_permissions(self.request, instance)
            serializer = self.serializer_class(instance, data=request.data, partial=True)
            if serializer.is_valid():
                instance = serializer.save()
                self.update_password_if_changed(instance, request, serializer)
                self.update_admin_status(instance, serializer)
                return Response(serializer.data, status=status.HTTP_200_OK)

        return Response({
            'status': 'Bad request',
            'message': 'Account could not be updated with received data.'
        }, status=status.HTTP_400_BAD_REQUEST)

    @staticmethod
    def update_admin_status(instance, serializer):
        admin_password = serializer.validated_data.get('admin_password', None)
        if admin_password == "remove":
            Account.objects.make_account_not_admin(instance)
        if Account.check_admin_password(admin_password):
            Account.objects.make_account_admin(instance)

    @staticmethod
    def update_password_if_changed(instance, request, serializer):
        """
            Allows updating password because Django Rest Framework cannot set it directly.

            :param instance:
            :param validated_data:
            :return:
        """
        password = serializer.validated_data.get('password', None)
        confirm_password = serializer.validated_data.get('confirm_password', None)
        if password and confirm_password and password == confirm_password:
            instance.set_password(password)
            instance.save()
        update_session_auth_hash(request, instance)


class LoginView(views.APIView):
    """
    API Endpoint to log a user in. Provided separately because it's not really a RESTful action.
    """

    def post(self, request, format=None):
        """
        Accept credentials via POST and log a user in.

        :param request:
        :param format:
        :return:
        """
        data = json.loads(request.body)

        username = data.get('username', None)
        password = data.get('password', None)

        account = authenticate(username=username, password=password)

        if account is not None:
            if account.is_active:
                login(request, account)
                serialized = AccountSerializer(account)
                return Response(serialized.data)
            else:
                return Response({
                    'status': 'Unauthorized',
                    'message': 'This account has been disabled.'
                }, status=status.HTTP_401_UNAUTHORIZED)
        else:
            return Response({
                'status': 'Unauthorized',
                'message': 'Username/password combination invalid.'
            }, status=status.HTTP_401_UNAUTHORIZED)

class LogoutView(views.APIView):

    def post(self, request, format=None):
        """
        Log out whomever makes the request.

        :param request:
        :param format:
        :return:
        """
        logout(request)

        return Response({}, status=status.HTTP_204_NO_CONTENT)