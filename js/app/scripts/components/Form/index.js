import TextField from './TextField';
import FileField from './FileField';
import CheckboxField from './CheckboxField';
import SelectField from './SelectField';
import DateField from './DateField';
import TimeField from './TimeField';
import DateTimeField from './DateTimeField';


const getComponent = (type) => {
  const components = {
    field: TextField,
    string: TextField,
    url: TextField,
    email: TextField,
    regex: TextField,
    slug: TextField,
    integer: TextField,
    float: TextField,
    decimal: TextField,
    date: DateField,
    time: TimeField,
    boolean: CheckboxField,
    datetime: DateTimeField,
    choice: SelectField,
    'multiple choice': SelectField,
    'image upload': FileField,
  };
  return components[type] || TextField;
};

module.exports = {
  TextField,
  FileField,
  getComponent,
};

