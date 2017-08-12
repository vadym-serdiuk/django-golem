import React from 'react';
import { FormsyDate } from 'formsy-material-ui/lib';


class DateField extends React.PureComponent {
  render () {
    const { name, label, readOnly=false, required=false, value=''} = this.props;
    return (
      <FormsyDate
        name={name}
        hintText={label}
        disabled={readOnly}
        required={required}
        defaultDate={value}
      />
    );
  }
}


export default DateField;
