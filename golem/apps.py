from django.contrib.admin.apps import AdminConfig


class GolemConfig(AdminConfig):
    name = 'golem'

    def ready(self):
        super(AdminConfig, self).ready()
        self.module.autodiscover()
