import React from 'react';
import TextField from 'material-ui/TextField';
import { autobind } from 'core-decorators';
import FlatButton from 'material-ui/FlatButton';
import {File} from 'formsy-react-components';

class FileField extends React.PureComponent {
  constructor () {
    super();
    this.state = {
      selectedFileName: ''
    }
  }

  @autobind
  onFileChange (name, files, value) {
    this.setState({selectedFileName: value});
  }

  render () {
    const { name, label, helpText='', required=false, value='' } = this.props;

    let preview = null;
    if (value) {
      if (value.search(/\.(jpg|png|gif|ico)$/i))
        preview = <img src={value} width="100" style={{marginRight: '20px'}} />;
      else
        preview = <span style={{marginRight: '20px'}} >{value}</span>;
    }

    return (
      <div>
        {preview}
        <TextField
          disabled={true}
          floatingLabelText={label}
          hintText={helpText}
          required={required}
          value={this.state.selectedFileName}
        />
        <FlatButton
          primary={true}
          label={<label htmlFor={'id_file_' + name} style={{cursor: 'pointer'}}>Upload file</label>}
        >

          <File
            id={'id_file_' + name}
            name={name}
            style={{width: 0, opacity: 0, top: -100, position: 'absolute'}}
            onChange={this.onFileChange}
          />
        </FlatButton>
      </div>
    )
  }
}

export default FileField;
