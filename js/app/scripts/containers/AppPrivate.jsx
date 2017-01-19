import React from 'react';
import AppBar from 'material-ui/AppBar';
import AppMenu from 'containers/Menu/AppMenu';

import { connect } from 'react-redux';

import SystemNotifications from 'components/SystemNotifications';
import { goTo } from 'actions/app'

export class AppPrivate extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      drawerOpen: true
    }
  };

  componentWillMount = () => {
    if (this.props.user.authenticated === null)
      return;
    this.checkUser();
  };

  componentDidUpdate = () => {
    if (this.props.user.authenticated === null)
      return;
    this.checkUser();
  };

  checkUser = () => {
    if (!this.props.user.authenticated) {
      const nextURI = this.props.location.pathname + encodeURIComponent(this.props.location.search);
      return this.props.dispatch(goTo(`${basePath}login/`, {query: {next: nextURI}}));
    }
  };

  render() {
    const { dispatch, user } = this.props;
    if (this.props.user.authenticated === null)
      return null;

    return (
      <div key="app" className="app app--private">
        <AppMenu open={this.state.drawerOpen} />
        <main className="app__main" style={{paddingLeft: '260px'}}>
          <AppBar title="Django Admin"
                  iconClassNameRight="muidocs-icon-navigation-expand-more" />
          {this.props.children}
        </main>
        <SystemNotifications />
      </div>
    );
  }
}

AppPrivate.propTypes = {
  children: React.PropTypes.node.isRequired,
  dispatch: React.PropTypes.func.isRequired,
  user: React.PropTypes.object.isRequired,
  app: React.PropTypes.object.isRequired,
  location: React.PropTypes.object.isRequired
};


/* istanbul ignore next */
function mapStateToProps(state) {
  return {
    user: state.user,
    app: state.app,
    location: state.routing.locationBeforeTransitions
  };
}

export default connect(mapStateToProps)(AppPrivate);
