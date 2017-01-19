import React from 'react';
import {ListItem, List} from 'material-ui/List';
import Drawer from 'material-ui/Drawer';
import Subheader from 'material-ui/Subheader';
import { autobind } from 'core-decorators';
import {goTo} from 'actions/app';

import { connect } from 'react-redux';
import _ from 'lodash';

class AppMenu extends React.Component {
  @autobind
  onMenuClick = (href) =>
    (e) => {
      this.props.dispatch(goTo(basePath + href));
      e.preventDefault();
      e.stopPropagation();
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
      <Drawer open={this.props.open}>
        <Subheader>Applications</Subheader>
        <List>
          {apps}
        </List>
      </Drawer>
    );
  };
}

function mapStateToProps(state) {
  return {
    appList: state.api.appList
  }
}

export default connect(mapStateToProps)(AppMenu)
