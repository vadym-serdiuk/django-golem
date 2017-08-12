// @flow

/**
 * @module Sagas/Session
 * @desc Session
 */

import { takeEvery } from 'redux-saga';
import { all, put, call } from 'redux-saga/effects';

import { goTo } from 'actions';
import { ActionTypes } from 'constants/index';
import { ENDPOINTS } from 'constants/api';
import request from 'utils/api';


export function* getInitialData(action) {
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
    else {
      yield put({
        type: ActionTypes.USER_LOGIN_FAILURE,
        payload: 'Session inactive'
      });

      if (action.authErrorAction)
        yield put(action.authErrorAction);
    }

    if (action.callbackAction)
      yield put(action.callbackAction);

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


export function* getModelMetaData({path, modelId}) {
  try {

    const options = {
      endpoint: path,
      method: 'OPTIONS'
    };
    const response = yield call(request, options);
    yield put({
      type: ActionTypes.PUSH_MODEL_METADATA,
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


export function* getObjectData({path, modelId, objectId}) {
  try {

    const options = {
      endpoint: path,
      method: 'GET'
    };
    const response = yield call(request, options);
    yield put({
      type: ActionTypes.PUSH_MODEL_OBJECT_DATA,
      payload: response,
      modelId,
      objectId,
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


export function* saveObject({path, modelId, objectId, data}) {
  try {

    const options = {
      endpoint: path,
      method: 'PATCH',
      payload: data,
      contentType: 'multipart/form-data',
    };
    const response = yield call(request, options);
    yield put({
      type: ActionTypes.PUSH_MODEL_OBJECT_DATA,
      payload: response,
      modelId,
      objectId,
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


/**
 * API Sagas
 */
export default function* api() {
  yield all([
    takeEvery(ActionTypes.GET_MODEL_METADATA, getModelMetaData),
    takeEvery(ActionTypes.GET_MODEL_LIST_DATA, getListData),
    takeEvery(ActionTypes.GET_MODEL_OBJECT_DATA, getObjectData),
    takeEvery(ActionTypes.GET_INITIAL_DATA, getInitialData),
    takeEvery(ActionTypes.SAVE_OBJECT, saveObject)
  ]);
}
