"""structures URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.10/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import url, include

# NOT SURE IF THIS IS AN IDEAL IMPLEMENTATION
from django.contrib.staticfiles.views import serve

def serveStatic(path):
    '''This is a utility function for serving static files for a front end app'''

    def servePath(request):

        return serve(request, path)

    return servePath

urlpatterns = [
    url(r'^api/', include('structures_api.urls', namespace='api')),
    url(r'^api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    url(r'^.*$', serveStatic('/ng_app/index.html')),
]
