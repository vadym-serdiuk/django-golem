import React from 'react';
import { Route, IndexRoute } from 'react-router';

import { checkStatus } from 'utils/routerInterceptor';

import App from 'containers/App';
import AppPublic from 'containers/AppPublic';
import AppPrivate from 'containers/AppPrivate';

import Main from 'containers/Main';
import Login from 'containers/Login';
import NotFound from 'containers/NotFound';

export default function createRoutes() {
  return (
    <Route path={basePath} component={App}>
      <Route component={AppPrivate}>
        <IndexRoute component={Main} onEnter={checkStatus} />
      </Route>
      <Route component={AppPublic}>
        <Route path={`${basePath}login/`} component={Login} onEnter={checkStatus} />
      </Route>
      <Route path="*" component={NotFound} />
    </Route>
  );
}
