import 'vendor/reactotronConfig';
import React from 'react';
import { Provider, connect } from 'react-redux';
import { Router } from 'react-router';
import createRoutes from 'routes';
import { ActionTypes } from 'constants/index'
import { goTo } from 'actions/app';

const routes = createRoutes();

class Root extends React.Component {
  static propTypes = {
    history: React.PropTypes.object.isRequired,
    store: React.PropTypes.object.isRequired,
    dispatch: React.PropTypes.func.isRequired,
    location: React.PropTypes.object.isRequired
  };

  componentDidMount = () => {
    const nextURI = this.props.location.pathname + encodeURIComponent(this.props.location.search);

    this.props.dispatch(
      {type: ActionTypes.GET_INITIAL_DATA,
       authErrorAction: goTo(`${basePath}login/`, {query: {next: nextURI}})
    });
  };

  /* istanbul ignore next */
  render() {
    const { store, history } = this.props;

    return (
      <Provider store={store}>
        <Router history={history} routes={routes} />
      </Provider>
    );
  }
}

/* istanbul ignore next */
function mapStateToProps(state) {
  return {
    location: state.routing.locationBeforeTransitions
  };
}

export default connect(mapStateToProps)(Root)
