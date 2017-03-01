import re
from collections import OrderedDict

from rest_framework.metadata import SimpleMetadata


class AdminMetaData(SimpleMetadata):
    def determine_metadata(self, request, view):
        metadata = OrderedDict()
        metadata['name'] = view.get_view_name()
        serializer = view.get_serializer()

        fields = self.get_serializer_info(serializer)
        list_display = view.model_admin.get_list_display(request)
        metadata['fields'] = fields
        metadata['list_fields'] = self.prepare_list_fields(fields, list_display, view.model, view.model_admin)
        metadata['fieldsets'] = view.model_admin.get_fieldsets(request)
        return metadata

    def get_serializer_info(self, serializer):
        """
        Given an instance of a serializer, return a dictionary of metadata
        about its fields.
        """
        if hasattr(serializer, 'child'):
            # If this is a `ListSerializer` then we want to examine the
            # underlying child serializer instance instead.
            serializer = serializer.child
        return [
            dict((('name', field_name),), **self.get_field_info(serializer.fields[field_name]))
            for field_name in serializer.Meta.fields
        ]

    def prepare_list_fields(self, fields, list_display, model, model_admin):
        list_fields = []
        for field_name in list_display:
            if field_name in ('__str__', '__unicode__'):
                field = {'name': field_name,
                         'label': model._meta.verbose_name,
                         'type': 'string'}
            else:
                try:
                    field = next(filter(lambda x: x['name'] == field_name, fields))
                except StopIteration:
                    field_type = 'string'
                    attr = getattr(model_admin, field_name, None)
                    if attr:
                        label = getattr(attr, 'short_description', field_name)
                        if getattr(attr, 'boolean', False):
                            field_type = 'bool'
                    else:
                        label = re.sub(r'[-_]', '', field_name)
                    field = {'name': field_name,
                             'label': label,
                             'type': field_type}
                else:
                    field = {k: v for k, v in field.items() if k in ('name', 'label', 'type')}
            list_fields.append(field)

        return list_fields
