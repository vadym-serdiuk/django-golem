import React from 'react';
import { FormsyTime } from 'formsy-material-ui/lib';


class TimeField extends React.PureComponent {
  render () {
    const { name, label, readOnly=false, required, value="0:00:00"} = this.props;
    return (
      <FormsyTime
        name={name}
        hintText={label}
        required={required}
        disabled={readOnly}
        value={value}
      />
    );
  }
}


export default TimeField;
