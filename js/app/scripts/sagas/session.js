// @flow

/**
 * @module Sagas/Session
 * @desc Session
 */

import { takeEvery } from 'redux-saga';
import { all, put, call, fork } from 'redux-saga/effects';

import { goTo } from 'actions';
import { ActionTypes } from 'constants/index';
import { ENDPOINTS } from 'constants/api';
import request from 'utils/api';

export function* login(action) {
  try {

    const options = {
      endpoint: ENDPOINTS.login,
      method: 'POST',
      payload: JSON.stringify(action.payload)
    };
    yield call(request, options);

    let url = basePath;
    if (action.next)
      url = action.next;

    yield put({
      type: ActionTypes.GET_INITIAL_DATA,
      callbackAction: goTo(url)
    });

  } catch (err) {
    /* istanbul ignore next */
    yield put({
      type: ActionTypes.USER_LOGIN_FAILURE,
      payload: err
    });
  }
}


export function* logout() {
  try {
    const options = {
      endpoint: ENDPOINTS.logout,
      method: 'POST'
    };
    yield call(request, options);

    yield put({
      type: ActionTypes.USER_LOGOUT_SUCCESS
    });
    yield put(goTo(basePath));
  } catch (err) {
    /* istanbul ignore next */
    yield put({
      type: ActionTypes.USER_LOGOUT_FAILURE,
      payload: err
    });
  }
}

/**
 * Session Sagas
 */
export default function* app() {
  yield all([
    takeEvery(ActionTypes.USER_LOGIN_REQUEST, login),
    takeEvery(ActionTypes.USER_LOGOUT_REQUEST, logout),
  ]);
}
