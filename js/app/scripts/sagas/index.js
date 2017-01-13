import { fork } from 'redux-saga/effects';

import session from './session';

/**
 * rootSaga
 */
export default function* rootSaga() {
  yield fork(session);
}
