import React from 'react';
import Paper from 'material-ui/Paper';
import Subheader from 'material-ui/Subheader';
import Table from 'components/Table';
import { connect } from 'react-redux';
import { getModelListData, getModelListMetaData } from 'actions/api';


class ModelListView extends React.Component {

  componentWillMount() {
    this.requestModel(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.modelId !== nextProps.modelId)
      this.requestModel(nextProps);
  }

  requestModel({meta, modelId}) {
    const apiPath = `api/${meta.listUrl}`;
    this.props.dispatch(getModelListMetaData(apiPath, modelId));
    this.props.dispatch(getModelListData(apiPath, modelId))
  }

  render() {
    const paperStyles = {
      width: '100%',
      height: '100vh',
      padding: '10px'
    };
    const { app, model, meta, data } = this.props;
    if (meta !== {}) {
      const modelTitle = meta.name;
      return (<Paper style={paperStyles}>
        <Subheader>{modelTitle}</Subheader>
        {<Table fields={meta.fields} data={data} />}
      </Paper>);
    } else {
      return null;
    }
  }
}

ModelListView.propTypes = {
  app: React.PropTypes.string.isRequired,
  model: React.PropTypes.string.isRequired,
  modelId: React.PropTypes.string.isRequired,
  data: React.PropTypes.array.isRequired,
  meta: React.PropTypes.object.isRequired,
  dispatch: React.PropTypes.func.isRequired
};

function mapStateToProps(state, ownProps) {
  const { app, model } = ownProps.routeParams;
  const modelId = `${app}:${model}`;

  return {
    app,
    model,
    modelId,
    data: state.api.data[modelId] || [],
    meta: state.api.meta[modelId] || {}
  }
}

export default connect(mapStateToProps)(ModelListView)
