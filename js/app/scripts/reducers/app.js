import { createReducer } from 'utils/helpers';
import { ActionTypes } from 'constants/index';
import { LOCATION_CHANGE } from 'react-router-redux'

export const initialState = {
  notifications: {},
  isSidebarOpened: false,
};

export default {
  app: createReducer(initialState, {
    [ActionTypes.SHOW_ALERT](state, action) {
      const id = Math.random() * 10000000;
      const notifications = {
        ...state.notifications,
        [id]: {
          visible: true,
          message: action.message,
          type: action.type,
          withTimeout: action.withTimeout === true
        }
      };

      return { ...state, notifications };
    },
    [ActionTypes.HIDE_ALERT](state, action) {
      const notifications = {
        ...state.notifications,
        [action.id]: {
          visible: false,
        }
      };

      return { ...state, notifications };
    },

    [LOCATION_CHANGE](state, params) {
      return state;
    },

    [ActionTypes.OPEN_SIDEBAR_MENU](state) {
      return {...state, isSidebarOpened: true};
    },

    [ActionTypes.CLOSE_SIDEBAR_MENU](state) {
      return {...state, isSidebarOpened: false};
    },

    [ActionTypes.USER_LOGOUT_SUCCESS]() {
      return initialState;
    },
  })
};
