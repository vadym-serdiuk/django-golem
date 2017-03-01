from django.contrib import admin

from demo.models import Item


class ItemAdmin(admin.ModelAdmin):
    list_display = ('code', 'name', 'sds', 'created_at')

    def sds(self, obj):
        return None
admin.site.register(Item, ItemAdmin)