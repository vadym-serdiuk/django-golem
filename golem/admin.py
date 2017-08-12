from django.contrib.admin import ModelAdmin
from django.contrib.admin import site
from django.contrib.auth.models import User


class UserAdmin(ModelAdmin):
    readonly_fields = ('date_joined', 'last_login')
    exclude = ('password',)

site.unregister(User)
site.register(User, UserAdmin)
