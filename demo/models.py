from django.db import models


class Item(models.Model):
    code = models.CharField(max_length=20)
    name = models.CharField(max_length=1000)
    description = models.TextField(blank=True, null=True)
    price = models.DecimalField(max_digits=20, decimal_places=2)
    active = models.BooleanField(default=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True, blank=True)
    started_at = models.DateTimeField(blank=True, null=True)
    image = models.ImageField()
