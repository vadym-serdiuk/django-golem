from django.conf import settings
from django.conf.urls import url, include, static

import golem

urlpatterns = [
    url(r'^admin/', golem.site.urls),
    url(r'^api-auth/', include('rest_framework.urls', namespace='rest_framework'))
] + static.static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
urlpatterns +=static.static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
