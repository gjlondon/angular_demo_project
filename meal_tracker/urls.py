from django.conf.urls import patterns, url

from meal_tracker.views import IndexView

urlpatterns = patterns(
    '',

    url('^.*$', IndexView.as_view(), name='index'),
)
