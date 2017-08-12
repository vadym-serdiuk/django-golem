import React from 'react';
import AppBar from 'material-ui/AppBar';
import AppMenu from 'containers/Menu/AppMenu';

import { connect } from 'react-redux';
import { autobind } from 'core-decorators';

import SystemNotifications from 'components/SystemNotifications';
import { goTo, openSidebarMenu } from 'actions/app';

export class AppPrivate extends React.Component {

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

  @autobind
  onAppBarLeftButtonClick = () => {
    return this.props.dispatch(openSidebarMenu());
  };

  render() {
    const { user } = this.props;
    if (user.authenticated === null)
      return null;

    return (
      <div key="app" className="app app--private">
        <AppMenu />
        <main className="app__main">
          <AppBar title="Django Admin"
                  iconClassNameRight="muidocs-icon-navigation-expand-more"
                  onLeftIconButtonTouchTap={this.onAppBarLeftButtonClick}
          />
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
