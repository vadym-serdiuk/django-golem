import keyMirror from 'fbjs/lib/keyMirror';

/**
 * @namespace Constants
 * @desc App constants
 */

/**
 * @constant {Object} ActionTypes
 * @memberof Constants
 */
export const ActionTypes = keyMirror({
  USER_LOGIN_REQUEST: undefined,
  USER_LOGIN_SUCCESS: undefined,
  USER_LOGIN_FAILURE: undefined,
  USER_LOGOUT_REQUEST: undefined,
  USER_LOGOUT_SUCCESS: undefined,
  USER_LOGOUT_FAILURE: undefined,

  SHOW_ALERT: undefined,
  HIDE_ALERT: undefined,

  GET_INITIAL_DATA: undefined,
  PUSH_INITIAL_DATA: undefined,

  GET_MODEL_LIST_DATA: undefined,
  PUSH_MODEL_LIST_DATA: undefined,

  GET_MODEL_LIST_METADATA: undefined,
  PUSH_MODEL_LIST_METADATA: undefined,

  SAVE_NEW_OBJECT: undefined,
  SAVE_OBJECT: undefined,

  OPEN_SIDEBAR_MENU: undefined,
  CLOSE_SIDEBAR_MENU: undefined,

  ERROR: undefined,
});



