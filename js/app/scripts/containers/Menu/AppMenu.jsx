import React from 'react';
import { ListItem, List } from 'material-ui/List';
import Drawer from 'material-ui/Drawer';
import Divider from 'material-ui/Divider';
import Subheader from 'material-ui/Subheader';
import { autobind } from 'core-decorators';
import { goTo, openSidebarMenu, closeSidebarMenu } from 'actions/app';
import { logOut } from 'actions/user';

import { connect } from 'react-redux';
import _ from 'lodash';

class AppMenu extends React.Component {
  @autobind
  onMenuClick = (href) =>
    (e) => {
      this.props.dispatch(closeSidebarMenu());
      this.props.dispatch(goTo(basePath + href));
      e.preventDefault();
      e.stopPropagation();
    };

  @autobind
  onLogout = () => {
    this.props.dispatch(closeSidebarMenu());
    return this.props.dispatch(logOut())
  };

  @autobind
  onRequestChange = (open) => {
    if (open) return this.props.dispatch(openSidebarMenu());
    return this.props.dispatch(closeSidebarMenu());
  };

  render() {

    const apps = _.map(this.props.appList, (appObj, appName) => {
      const modelsMenu = _.map(appObj.models, (model) => {
        return (<ListItem key={model.name} primaryText={model.name} href={basePath + model.admin_url} onClick={this.onMenuClick(model.admin_url)} />)
      });

      return (
        <ListItem
          key={appName}
          initiallyOpen={true}
          primaryText={appObj.name}
          primaryTogglesNestedList={true}
          nestedItems={modelsMenu}
        />
      )
    });

    return (
      <Drawer open={this.props.isSidebarOpened} docked={false} onRequestChange={this.onRequestChange}>
        <Subheader>Applications</Subheader>
        <List>
          {apps}
        </List>
        <Divider />
        <List>
          <ListItem
            key="logout-action"
            primaryText="Logout"
            onClick={this.onLogout}
          />
        </List>

      </Drawer>
    );
  };
}

function mapStateToProps(state) {
  return {
    appList: state.api.appList,
    isSidebarOpened: state.app.isSidebarOpened,
  }
}

export default connect(mapStateToProps)(AppMenu)
