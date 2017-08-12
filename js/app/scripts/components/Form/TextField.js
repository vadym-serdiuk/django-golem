import React from 'react';
import { FormsyText } from 'formsy-material-ui/lib';


const lookupType = (type) => {
  const types = {
    field: 'text',
    string: 'text',
    url: 'url',
    email: 'email',
    regex: 'text',
    slug: 'text',
    integer: 'number',
    float: 'number',
    decimal: 'number',
  };
  return types[type] || 'text';
};

class TextField extends React.PureComponent {
  render () {
    const { type, label, helpText='', readOnly=false, maxLength=0, maxValue=0, required, ...other } = this.props;
    const subtype = lookupType(type);
    const multiline = (maxLength == 0) && (subtype == 'text');
    const rows = multiline ? 5 : 1;
    return (
      <FormsyText
        {...other}
        floatingLabelText={label}
        disabled={readOnly}
        fullWidth={(maxLength > 30) || multiline }
        multiLine={multiline}
        type={subtype}
        rows={rows}
        required={required}
      />
    );
  }
}


export default TextField;
