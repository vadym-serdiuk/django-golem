// @flow

/**
 * @module Sagas/User
 * @desc User
 */

import { takeEvery, delay } from 'redux-saga';
import { put, call, fork, select } from 'redux-saga/effects';

import { goTo } from 'actions';
import { ActionTypes } from 'constants/index';
import { ENDPOINTS } from 'constants/api';
import request from 'utils/api';

/**
 * Login
 */
const getCsrfToken = state => state.app.CSRFToken;

export function* login(action) {
  try {
    const CSRFToken = yield select(getCsrfToken);

    const options = {
      endpoint: ENDPOINTS.login,
      method: 'POST',
      payload: action.payload,
      csrfToken: CSRFToken
    };
    const { token } = yield call(request, options);
    if (token > '') {
      yield put({
        type: ActionTypes.USER_LOGIN_SUCCESS,
        token
      });
      yield put(goTo(basePath));
    }
  } catch (err) {
    /* istanbul ignore next */
    yield put({
      type: ActionTypes.USER_LOGIN_FAILURE,
      payload: err
    });
  }
}

/**
 * Logout
 */
export function* logout() {
  try {
    yield call(delay, 200);

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
 * User Sagas
 */
export default function* app() {
  yield fork(watchLogin);
  yield fork(watchLogout);
}
