import _ from 'lodash';
import React from 'react';
import Formsy from 'formsy-react';
import Subheader from 'material-ui/Subheader';
import Card from 'material-ui/Card';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import { getModelMetaData, getModelObjectData, saveObject } from 'actions/api';
import { getComponent } from 'components/Form';
import RaisedButton from 'material-ui/RaisedButton';


const paperStyles = {
  padding: '15px',
  boxSizing: 'border-box',
  margin: '15px',
};

class ModelDetailView extends React.Component {
  constructor () {
    super();
    this.state = {
      canSubmit: false
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { meta, data } = this.props;
    return !(_.isEqual(meta, nextProps.meta) &&
             _.isEqual(data, nextProps.data) &&
             _.isEqual(this.state, nextState));
  }

  componentWillMount() {
    this.requestModel(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if ((this.props.modelId !== nextProps.modelId) ||
        (this.props.objectId !== nextProps.objectId))
      this.requestModel(nextProps);
  }

  requestModel({meta, modelId, objectId}) {
    const apiMetaPath = `api/${meta.listUrl}`;
    this.props.dispatch(getModelMetaData(apiMetaPath, modelId));

    const apiObjectPath = `api/${meta.listUrl}${objectId}/`;
    this.props.dispatch(getModelObjectData(apiObjectPath, modelId, objectId));
  }

  @autobind
  enableButton () {
    this.setState({
      canSubmit: true,
    });
  }

  @autobind
  disableButton () {
    this.setState({
      canSubmit: false,
    });
  }

  @autobind
  submitForm (data) {
    let formData = new FormData();
    for (let key of Object.keys(data)) {
      const value = data[key];
      if (typeof value === 'undefined'){
        continue;
      }
      if (_.isObject(value)) {
         formData.append(key, value[0]);
         continue;
      }
      if (!(key.match(/(\-time|\-date)$/))) {
        formData.append(key, value);
      }
    }

    const {meta, modelId, objectId} = this.props;
    const path = `api/${meta.listUrl}${objectId}/`;
    this.props.dispatch(saveObject(path, formData, modelId, objectId));
  }

  renderFields = (fields, props) => {
    const { meta, data } = props;

    return _.map(fields, (fieldName) => {
      const metaField = _.find(meta.fields, (field) => { return field.name == fieldName });
      if (metaField) {
        const Component = getComponent(metaField.type);
        return <Component key={fieldName} {...metaField} style={{display: 'block' }} value={data[fieldName]} />
      }
      return null;
    }).filter(field => { return field != null});
  };

  renderWithLayout = () => {

  };

  renderWithFieldset = (props) => {

    const fieldsets = props.meta.fieldsets || [];
    return _.map(fieldsets, (fieldset) => {
      const [ label, { fields } ] = fieldset;
      const label_ = label ? (<Subheader>{label}</Subheader>) : null;
      const fields_ = this.renderFields(fields, props);
       return (
        <fieldset key={label || 'nokey'} style={{border: 'none'}}>
          {label_}
          {fields_}
        </fieldset>
      )
    });
  };

  renderForm = (props) => {
    const { meta } = props;
    let renderMethod = null;
    if ((meta.layout || []).length > 0)
      renderMethod = this.renderWithLayout;
    else
      renderMethod = this.renderWithFieldset;

    const formFields = renderMethod(props);
    return (<Formsy.Form
        onValid={this.enableButton}
        onInvalid={this.disableButton}
        onValidSubmit={this.submitForm}
      >
        {formFields}
        <RaisedButton
          type="submit"
          label="Save"
          disabled={!this.state.canSubmit}
        />
      </Formsy.Form>)
  };

  render () {
    const { meta, data } = this.props;
    if (_.isEmpty(meta) || _.isEmpty(data)) {
      return null;
    }

    const modelTitle = meta.name;
    const form = this.renderForm(this.props);

    return (<Card style={paperStyles}>
      <h1>{modelTitle}</h1>
      {form}
    </Card>);
  }
}

function mapStateToProps(state, ownProps) {
  const { app, model, pk } = ownProps.routeParams;
  const modelId = `${app}:${model}`;

  return {
    app,
    model,
    modelId,
    objectId: pk,
    data: state.api.objData[modelId] || {},
    meta: state.api.meta[modelId] || {}
  }
}

export default connect(mapStateToProps)(ModelDetailView)
