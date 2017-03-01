import React from 'react';
import Paper from 'material-ui/Paper';
import Subheader from 'material-ui/Subheader';
import Table from 'components/Table';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import { getModelListData, getModelListMetaData } from 'actions/api';
import Pagination from 'components/Pagination';
import { goTo } from 'actions/app';

class ModelListView extends React.Component {
  constructor() {
    super();
    this.state = {
      currentPage: 1,
      perPage: 30
    }
  }

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

  @autobind
  onPageChange = (currentPage, perPage) => {
    this.state.currentPage = currentPage;
    this.state.perPage = perPage;
  };

  @autobind
  onRowClick = (pk) => {
    const { app, model } = this.props;
    this.props.dispatch(goTo(`${basePath}${app}/${model}/${pk}/`));
  };

  render() {
    const paperStyles = {
      width: '100%',
      height: '100vh',
      padding: '10px'
    };
    const { meta, data } = this.props;

    if (meta !== {}) {
      const modelTitle = meta.name;

      const totalRows = data.length;
      const { currentPage, perPage } = this.state;
      const startPosition = (currentPage - 1) * perPage;
      const endPosition = (currentPage) * perPage;
      const pageData = data.slice(startPosition, endPosition);

      return (<Paper style={paperStyles}>
        <Subheader>{modelTitle}</Subheader>
        <Table
          listFields={meta.listFields}
          data={pageData}
          onRowClick={this.onRowClick}
        />
        <Pagination onChange={this.onPageChange} total={totalRows} />
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
