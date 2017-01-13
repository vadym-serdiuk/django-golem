/**
 * @module Actions/User
 * @desc User Actions
 */

import { ActionTypes } from 'constants/index';

/**
 * Login
 *
 * @returns {Object}
 */
export function login({username, password}) {
  return {
    type: ActionTypes.USER_LOGIN_REQUEST,
    payload: {
      username, password
    }
  };
}

/**
 * Logout
 *
 * @returns {Object}
 */
export function logOut() {
  return {
    type: ActionTypes.USER_LOGOUT_REQUEST
  };
}
