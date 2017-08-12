import React from 'react';
import { FormsyCheckbox } from 'formsy-material-ui/lib';


class CheckBoxField extends React.PureComponent {
  render () {
    const {name, label, style, readOnly = false, value = false} = this.props;

    return (
      <div style={{...style, padding: '10px 0', boxSizing: 'border-box'}}>
        <FormsyCheckbox
          name={name}
          label={label}
          disabled={readOnly}
          defaultChecked={value}
        />
      </div>
    );
  }
}


export default CheckBoxField;
