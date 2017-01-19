// @flow

/**
 * Router methods
 * @module routerInterceptor
 */

import scroll from 'scroll';
import scrollDoc from 'scroll-doc';
import ease from 'ease-component';

const page = scrollDoc();

/**
 * Scroll to the top before navigate
 * @param {Object} nextState
 * @param {Object} transition
 * @param {function} callback
 */
export function scrollBefore(nextState, transition, callback) {
  scroll.top(page, 0, { ease: ease.inBounce }, () => {
    callback();
  });
}

/**
 * Check user status and redirect if not authorized
 * @param {Object} nextState
 * @param {Object} transition
 * @param {function} callback
 *
 */
export function routeLocationDidUpdate(nextState, transition, callback) {
  return scrollBefore(nextState, transition, callback);
}
