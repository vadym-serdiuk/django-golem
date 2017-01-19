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


export function* getInitialData() {
  try {

    const options = {
      endpoint: ENDPOINTS.initialData,
      method: 'GET'
    };
    const response = yield call(request, options);
    if (response.user.authenticated)
      yield put({
        type: ActionTypes.PUSH_INITIAL_DATA,
        payload: response
      });
    else
      yield put({
        type: ActionTypes.USER_LOGIN_FAILURE,
        payload: err
      });

  } catch (err) {
    /* istanbul ignore next */
    yield put({
      type: ActionTypes.SHOW_ALERT,
      payload: {
        message: err,
        type: 'error',
        withTimeout: true
      }
    });
  }
}


export function* getListMetaData({path, modelId}) {
  try {

    const options = {
      endpoint: path,
      method: 'OPTIONS'
    };
    const response = yield call(request, options);
    yield put({
      type: ActionTypes.PUSH_MODEL_LIST_METADATA,
      payload: response,
      modelId
    });

  } catch (err) {
    /* istanbul ignore next */
    yield put({
      type: ActionTypes.SHOW_ALERT,
      payload: {
        message: err,
        type: 'error',
        withTimeout: true
      }
    });
  }
}


export function* getListData({path, modelId}) {
  try {

    const options = {
      endpoint: path,
      method: 'GET'
    };
    const response = yield call(request, options);
    yield put({
      type: ActionTypes.PUSH_MODEL_LIST_DATA,
      payload: response,
      modelId
    });

  } catch (err) {
    /* istanbul ignore next */
    yield put({
      type: ActionTypes.SHOW_ALERT,
      payload: {
        message: err,
        type: 'error',
        withTimeout: true
      }
    });
  }
}


function* watchGetListMetaData() {
  yield* takeEvery(ActionTypes.GET_MODEL_LIST_METADATA, getListMetaData);
}


function* watchGetListData() {
  yield* takeEvery(ActionTypes.GET_MODEL_LIST_DATA, getListData);
}


function* watchGetInitialData() {
  yield* takeEvery(ActionTypes.GET_INITIAL_DATA, getInitialData);
}


/**
 * API Sagas
 */
export default function* api() {
  yield [
    fork(watchGetListMetaData),
    fork(watchGetListData),
    fork(watchGetInitialData)
  ];
}
