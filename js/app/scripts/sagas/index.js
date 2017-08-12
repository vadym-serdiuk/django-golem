import { fork } from 'redux-saga/effects';

import session from './session';
import api from './api';

/**
 * rootSaga
 */
export default function* rootSaga() {
  yield [
    fork(session),
    fork(api)
  ];
}
