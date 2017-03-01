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
export function login({username, password}, next) {
  return {
    type: ActionTypes.USER_LOGIN_REQUEST,
    payload: {
      username, password
    },
    next
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
