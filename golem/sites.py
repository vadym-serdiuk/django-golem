import json
from functools import update_wrapper

from django.contrib import admin
from django.core.exceptions import PermissionDenied
from django.http import JsonResponse
from django.template.response import TemplateResponse
from django.utils.encoding import force_text
from django.utils.functional import Promise
from django.utils.text import capfirst
from django.apps import apps
from django.views.decorators.csrf import ensure_csrf_cookie
from rest_framework.routers import DefaultRouter
from rest_framework.serializers import ModelSerializer
from rest_framework.viewsets import ModelViewSet


def json_apps_serializer(obj):
    if isinstance(obj, Promise):
        return force_text(obj)


def get_serializer_class_func(model, model_admin):
    def wrapper(self):
        # self is a Viewset instance
        fields = model_admin.get_fields(self.request)
        model_field_names = [field.name for field in model._meta.fields]
        fields = list(filter(lambda x: x in model_field_names, fields))
        if model._meta.pk.name not in fields:
            fields.insert(0, model._meta.pk.name)
        read_only_fields = model_admin.get_readonly_fields(self.request)

        serializers_meta_class = type('Meta', (), {'model': model,
                                                   'fields': fields,
                                                   'read_only_fields': read_only_fields})
        class_name = '{}{}AdminSerializer'.format(capfirst(model._meta.app_label),
                                                  capfirst(model._meta.verbose_name_plural))

        serializer_class = type(
            class_name,
            (ModelSerializer,),
            {'Meta': serializers_meta_class}
        )
        return serializer_class
    return wrapper


def get_viewset_class(model, model_admin):
    class_name = '{}{}AdminViewSet'.format(capfirst(model._meta.app_label),
                                           capfirst(model._meta.verbose_name_plural))
    class_attrs = {
        'queryset': model.objects.all(),
        'get_serializer_class': get_serializer_class_func(model, model_admin)
    }
    viewset_class = type(class_name, (ModelViewSet,), class_attrs)
    return viewset_class


class AdminSite(admin.AdminSite):

    def get_urls(self):
        from django.conf.urls import url, include
        # Since this module gets imported in the application's root package,
        # it cannot import models from other applications at the module level,
        # and django.contrib.contenttypes.views imports ContentType.
        from django.contrib.contenttypes import views as contenttype_views

        def wrap(view, cacheable=False):
            def wrapper(*args, **kwargs):
                return self.admin_view(view, cacheable)(*args, **kwargs)
            wrapper.admin_site = self
            return update_wrapper(wrapper, view)

        # Admin-site-wide views.
        urlpatterns = [
            url(r'^api/login/$', self.login, name='login'),
            url(r'^api/logout/$', wrap(self.logout), name='logout'),
            url(r'^api/password_change/$', wrap(self.password_change, cacheable=True), name='password_change'),
            url(r'^api/initial-data/$', self.initial_data, name='initial_data'),
            # url(r'^password_change/done/$', wrap(self.password_change_done, cacheable=True),
            #     name='password_change_done'),
            url(r'^jsi18n/$', wrap(self.i18n_javascript, cacheable=True), name='jsi18n'),
        ]

        # Add each model's viewset, and create a list of valid URLS
        admin_api_router = DefaultRouter()
        for model, model_admin in admin.site._registry.items():
            path = r'{}/{}'.format(model._meta.app_label, model._meta.model_name)
            viewset = get_viewset_class(model, model_admin)
            admin_api_router.register(path, viewset)
        urlpatterns += [
            url(r'^api/', include(admin_api_router.urls, namespace='admin_api')),
        ]

        # SPA requires returning of index page on any url
        # 404 is handled by frontend
        urlpatterns += [
            url(r'^', ensure_csrf_cookie(self.index), name='index'),
        ]
        return urlpatterns

    @property
    def urls(self):
        return self.get_urls(), 'golem', 'admin'

    def index(self, request, extra_context=None):
        script_name = request.META['SCRIPT_NAME']
        site_url = script_name if self.site_url == '/' and script_name else self.site_url
        context = {
            'site_title': self.site_title,
            'site_url': site_url
        }

        return TemplateResponse(request, self.index_template or 'admin/index.html', context)

    def login(self, request):
        return JsonResponse({'token': '9989898joo'})

    def initial_data(self, request):
        return JsonResponse(self.get_app_list(request))

    def _build_app_dict(self, request, label=None):
        """
        Builds the app dictionary. Takes an optional label parameters to filter
        models of a specific app.
        """
        app_dict = {}

        if label:
            models = {
                m: m_a for m, m_a in self._registry.items()
                if m._meta.app_label == label
            }
        else:
            models = self._registry

        for model, model_admin in models.items():
            app_label = model._meta.app_label

            has_module_perms = model_admin.has_module_permission(request)
            if not has_module_perms:
                if label:
                    raise PermissionDenied
                continue

            perms = model_admin.get_model_perms(request)

            # Check whether user has any perm for this module.
            # If so, add the module to the model_list.
            if True not in perms.values():
                continue

            info = (app_label, model._meta.model_name)
            model_dict = {
                'name': capfirst(model._meta.verbose_name_plural),
                'object_name': model._meta.object_name,
                'perms': perms,
            }
            if perms.get('change'):
                model_dict['admin_url'] = 'admin/%s/%s_changelist' % info
            if perms.get('add'):
                model_dict['add_url'] = 'admin/%s/%s_add' % info

            if app_label in app_dict:
                app_dict[app_label]['models'].append(model_dict)
            else:
                app_dict[app_label] = {
                    'name': apps.get_app_config(app_label).verbose_name,
                    'app_label': app_label,
                    'app_url': 'admin/%s' % app_label,
                    'has_module_perms': has_module_perms,
                    'models': [model_dict],
                }

        if label:
            return app_dict.get(label)
        return app_dict


site = AdminSite()