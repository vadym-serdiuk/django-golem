import re
from collections import OrderedDict

from django.utils.encoding import force_text
from rest_framework import serializers
from rest_framework.metadata import SimpleMetadata


def convert_snake_to_camel(value):
    if isinstance(value, str):
        return re.sub('(.)_([a-z])', lambda x: x.group(1) + x.group(2).upper(), value.lower())
    elif isinstance(value, dict):
        new_value = {}
        for key, value in value.items():
            new_value[convert_snake_to_camel(key)] = value
        return new_value
    return value


class AdminMetaData(SimpleMetadata):
    def determine_metadata(self, request, view):
        self.model = view.model

        metadata = OrderedDict()
        metadata['name'] = view.get_view_name()
        serializer = view.get_serializer()

        fields = self.get_serializer_info(serializer)
        list_display = view.model_admin.get_list_display(request)
        metadata['fields'] = fields
        metadata['list_fields'] = self.prepare_list_fields(fields, list_display, view.model, view.model_admin)
        metadata['fieldsets'] = view.model_admin.get_fieldsets(request)
        metadata['layout'] = self.get_layout(request, view.model_admin)
        return convert_snake_to_camel(metadata)

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
                            field_type = 'boolean'
                    else:
                        label = re.sub(r'[-_]', '', field_name)
                    field = {'name': field_name,
                             'label': label,
                             'type': field_type}
                else:
                    field = {k: v for k, v in field.items() if k in ('name', 'label', 'type')}
            list_fields.append(field)

        return convert_snake_to_camel(list_fields)

    def get_field_info(self, field):
        """
        Given an instance of a serializer field, return a dictionary
        of metadata about it.
        """
        field_info = OrderedDict()
        field_info['type'] = self.label_lookup[field]
        field_info['required'] = getattr(field, 'required', False)

        attrs = [
            'read_only', 'label', 'help_text',
            'min_length', 'max_length',
            'min_value', 'max_value'
        ]

        for attr in attrs:
            value = getattr(field, attr, None)
            if value is not None and value != '':
                field_info[attr] = force_text(value, strings_only=True)

        if getattr(field, 'child', None):
            field_info['child'] = self.get_field_info(field.child)
        elif getattr(field, 'fields', None):
            field_info['children'] = self.get_serializer_info(field)

        if (not field_info.get('read_only') and
            not isinstance(field, (serializers.RelatedField, serializers.ManyRelatedField)) and
                hasattr(field, 'choices')):
            field_info['choices'] = [
                {
                    'value': choice_value,
                    'display_name': force_text(choice_name, strings_only=True)
                }
                for choice_value, choice_name in field.choices.items()
            ]

        return convert_snake_to_camel(field_info)

    def get_layout(self, request, model_admin):
        get_layout = getattr(model_admin, 'get_layout', None)
        if get_layout:
            return get_layout(request)
        layout = getattr(model_admin, 'layout', None)
        if layout:
            return layout
        return []