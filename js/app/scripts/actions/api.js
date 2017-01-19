import { ActionTypes } from 'constants/index';


export function getModelListData(path, modelId) {
  return {
    type: ActionTypes.GET_MODEL_LIST_DATA,
    path,
    modelId
  };
}

export function getModelListMetaData(path, modelId) {
  return {
    type: ActionTypes.GET_MODEL_LIST_METADATA,
    path,
    modelId
  };
}
