import React from 'react';
import { Route, IndexRoute } from 'react-router';

import { checkStatus } from 'utils/routerInterceptor';

import App from 'containers/App';
import AppPublic from 'containers/AppPublic';
import AppPrivate from 'containers/AppPrivate';
import DjangoAppView from 'containers/Django/AppView';
import DjangoModelListView from 'containers/Django/ModelListView';
import DjangoModelDetailView from 'containers/Django/ModelDetailView';

import Main from 'containers/Main';
import Login from 'containers/Login';
import NotFound from 'containers/NotFound';

export default function createRoutes() {
  return (
    <Route path={basePath} component={App}>
      <Route component={AppPrivate}>
        <IndexRoute component={Main}/>
        <Route path={`${basePath}:app/`} component={DjangoAppView}/>
        <Route path={`${basePath}:app/:model/`} component={DjangoModelListView}/>
        <Route path={`${basePath}:app/:model/:pk/`} component={DjangoModelDetailView}/>
      </Route>
      <Route component={AppPublic}>
        <Route path={`${basePath}login/`} component={Login} />
      </Route>
      <Route path="*" component={NotFound} />
    </Route>
  );
}
