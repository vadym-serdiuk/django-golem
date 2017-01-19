// @flow

/**
 * @module Sagas/Session
 * @desc Session
 */

import { takeEvery } from 'redux-saga';
import { put, call, fork } from 'redux-saga/effects';

import { goTo } from 'actions';
import { ActionTypes } from 'constants/index';
import { ENDPOINTS } from 'constants/api';
import request from 'utils/api';

export function* login(action) {
  try {

    const options = {
      endpoint: ENDPOINTS.login,
      method: 'POST',
      payload: action.payload
    };
    yield call(request, options);

    yield put({
      type: ActionTypes.GET_INITIAL_DATA
    });

    yield put(goTo(basePath));

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

function* watchLogin() {
  yield* takeEvery(ActionTypes.USER_LOGIN_REQUEST, login);
}

function* watchLogout() {
  yield* takeEvery(ActionTypes.USER_LOGOUT_REQUEST, logout);
}

/**
 * Session Sagas
 */
export default function* app() {
  yield [
    fork(watchLogin),
    fork(watchLogout)
  ];
}
