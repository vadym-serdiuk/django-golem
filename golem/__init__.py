from django.utils.module_loading import autodiscover_modules

from django.contrib import admin
from .sites import site


def autodiscover():
    autodiscover_modules('admin', register_to=admin.site)


default_app_config = 'golem.apps.GolemConfig'
