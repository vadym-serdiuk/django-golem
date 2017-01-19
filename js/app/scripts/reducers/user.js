import { REHYDRATE } from 'redux-persist/constants';
import { createReducer } from 'utils/helpers';

import { ActionTypes } from 'constants/index';

export const userState = {
  authenticated: null
};

export default {
  user: createReducer(userState, {
    [ActionTypes.USER_LOGOUT_SUCCESS]() {
      return {authenticated: false}
    },
    [ActionTypes.PUSH_INITIAL_DATA](state, action) {
      if (action.payload.user.authenticated) {
        return {...state, ...action.payload.user};
      }
      else
        return {authenticated: false};
    }
  })
};
