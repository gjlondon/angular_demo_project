from django.conf.urls import patterns, url, include

from meal_tracker.views import IndexView

from rest_framework_nested import routers

from authentication.views import AccountViewSet, LoginView, LogoutView
from meals.views import MealViewSet, AccountMealsViewSet

router = routers.SimpleRouter()
router.register(r'accounts', AccountViewSet)
router.register(r'meals', MealViewSet)

accounts_router = routers.NestedSimpleRouter(
    router, r'accounts', lookup='account'
)
accounts_router.register(r'meals', AccountMealsViewSet)

urlpatterns = patterns(
     '',

    url(r'^api/v1/', include(router.urls)),
    url(r'^api/v1/', include(accounts_router.urls)),
    url(r'^api/v1/auth/login/$', LoginView.as_view(), name='login'),
    url(r'^api/v1/auth/logout/$', LogoutView.as_view(), name='logout'),
    url('^.*$', IndexView.as_view(), name='index'),
)
