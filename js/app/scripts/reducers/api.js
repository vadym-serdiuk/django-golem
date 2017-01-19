import { createReducer } from 'utils/helpers';
import { ActionTypes } from 'constants/index';

export const initialState = {
  data: {},
  meta: {},
  appList: []
};

const time_re = /^([\+-]?\d{4}(?!\d{2}\b))((-?)((0[1-9]|1[0-2])(\3([12]\d|0[1-9]|3[01]))?|W([0-4]\d|5[0-2])(-?[1-7])?|(00[1-9]|0[1-9]\d|[12]\d{2}|3([0-5]\d|6[1-6])))([T\s]((([01]\d|2[0-3])((:?)[0-5]\d)?|24\:?00)([\.,]\d+(?!:))?)?(\17[0-5]\d([\.,]\d+)?)?([zZ]|([\+-])([01]\d|2[0-3]):?([0-5]\d)?)?)?)?$/

export default {
  api: createReducer(initialState, {
    [ActionTypes.PUSH_MODEL_LIST_DATA](state, action) {

      const payload = [...action.payload];
      _.each(payload, (row) => {
        _.each(_.keys(row), (field) => {
          let value = row[field];
          if (time_re.test(value))
            row[field] = new Date(value);
        });
      });

      const data = {...state.data, [action.modelId]: payload};
      return { ...state, data};
    },
    [ActionTypes.PUSH_MODEL_LIST_METADATA](state, action) {
      const meta = {
        ...state.meta,
        [action.modelId]: {
          ...state.meta[action.modelId],
          fields: action.payload.actions.POST
        }
      };
      return { ...state, meta};
    },
    [ActionTypes.PUSH_INITIAL_DATA](state, action) {
      const meta = {};
      _.each(action.payload.appList, (appObj, appName) => {
        _.each(appObj.models, (model) => {
          meta[model.id] = {
            name: model.name,
            app: appName,
            appLabel: appObj.name,
            perms: model.perms,
            listUrl: model.admin_url,
            addUrl: model.add_url,
            fields: {}
          };
        })
      });
      return {...state, appList: action.payload.appList, meta};
    },
    [ActionTypes.USER_LOGOUT_SUCCESS]() {
      return initialState;
    },
  })
};
