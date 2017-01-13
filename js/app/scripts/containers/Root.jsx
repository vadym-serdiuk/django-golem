import 'vendor/reactotronConfig';
import React from 'react';
import { Provider, connect } from 'react-redux';
import { Router } from 'react-router';
import createRoutes from 'routes';
import cookie from 'cookie';
import { putCsrfToken } from 'actions/app'

const routes = createRoutes();

class Root extends React.Component {
  static propTypes = {
    history: React.PropTypes.object.isRequired,
    store: React.PropTypes.object.isRequired,
    dispatch: React.PropTypes.func.isRequired
  };

  componentDidMount = () => {
    const cookiesObj = cookie.parse(document.cookie);
    const CSRFToken = cookiesObj.csrftoken;
    this.props.dispatch(putCsrfToken(CSRFToken));
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
