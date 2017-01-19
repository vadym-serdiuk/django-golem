import 'vendor/reactotronConfig';
import React from 'react';
import { Provider, connect } from 'react-redux';
import { Router } from 'react-router';
import createRoutes from 'routes';
import { ActionTypes } from 'constants/index'

const routes = createRoutes();

class Root extends React.Component {
  static propTypes = {
    history: React.PropTypes.object.isRequired,
    store: React.PropTypes.object.isRequired,
    dispatch: React.PropTypes.func.isRequired
  };

  componentDidMount = () => {
    this.props.dispatch({type: ActionTypes.GET_INITIAL_DATA});
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

export default connect()(Root)
