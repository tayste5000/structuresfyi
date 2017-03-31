from django.conf.urls import url, include
from structures_api.views import PresentationViewSet
from rest_framework.routers import DefaultRouter

ApiRouter = DefaultRouter(trailing_slash=False)

ApiRouter.register(r'presentation', PresentationViewSet, base_name='presentation')

urlpatterns = [
    url(r'^', include(ApiRouter.urls, namespace='main_api')),
]