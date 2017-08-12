import { ActionTypes } from 'constants/index';


export function getModelListData(path, modelId) {
  return {
    type: ActionTypes.GET_MODEL_LIST_DATA,
    path,
    modelId,
  };
}

export function getModelObjectData(path, modelId, objectId) {
  return {
    type: ActionTypes.GET_MODEL_OBJECT_DATA,
    path,
    modelId,
    objectId,
  };
}

export function getModelMetaData(path, modelId) {
  return {
    type: ActionTypes.GET_MODEL_METADATA,
    path,
    modelId,
  };
}

export function saveObject(path, data, modelId, objectId) {
  return {
    type: ActionTypes.SAVE_OBJECT,
    path,
    data,
    modelId,
    objectId,
  };
}
