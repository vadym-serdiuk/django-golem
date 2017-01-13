from django.conf.urls import url, include

import golem

urlpatterns = [
    url(r'^admin/', golem.site.urls),
    url(r'^api-auth/', include('rest_framework.urls', namespace='rest_framework'))
]
