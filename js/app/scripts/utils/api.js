// @flow

/**
 * API functions
 * @module API
 */
import { XHR, CSRF_HEADER_KEY } from 'constants/api';

/**
 * Fetch data outside the FSA flow
 *
 * @instance
 * @param {Object} action
 * @param {string} [action.endpoint] - URL Endpoint
 * @param {string} [action.method] - Request method ( GET, POST, PUT, ... ).
 * @param {string} [action.payload] - Request body.
 * @param {Object} [action.headers]
 *
 * @returns {Promise}
 */
export default function request(action:Object = {}) {
  const errors = [];

  if (!action.method) {
    action.method = 'GET';
  }

  if (!action.endpoint) {
    errors.push('endpoint');
  }

  if (!action.payload && (action.method !== 'GET' && action.method !== 'DELETE')) {
    errors.push('payload');
  }

  const headers = Object.assign({}, {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  }, action.headers);

  if (['POST', 'PUT'].indexOf(action.method) >= 0) {
    if (!action.csrfToken)
      errors.push('csrfToken');
    else
      headers[CSRF_HEADER_KEY] = action.csrfToken
  }

  if (errors.length) {
    throw new Error(`Error! You must pass \`${errors.join('`, `')}\``);
  }

  return new Promise((resolve, reject) => {
    const params = {
      headers,
      method: action.method
    };

    if (params.method !== 'GET') {
      params.body = JSON.stringify(action.payload);
    }

    const endpoint = basePath + action.endpoint;
    params.credentials = 'same-origin';
    fetch(endpoint, params)
      .then(response => {
        if (response.status >= 400) {
          const error = new Error(response.statusText);
          error.response = response;
          throw error;
        } else {
          return response;
        }
      })
      .then(response => {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.indexOf('application/json') > -1) {
          return response.json();
        }

        return response.text();
      })
      .then(data => {
        resolve(data);
      })
      .catch(error => {
        /* istanbul ignore else */
        if (error.response) {
          const contentType = error.response.headers.get('content-type');

          if (contentType && contentType.indexOf('application/json') > -1) {
            error.response.json().then(json => {
              reject({
                status: XHR.FAIL,
                code: error.response.status,
                error: error.response.statusText,
                data: json
              });
            });

            return;
          }

          error.response.text().then(text =>
            reject({
              status: XHR.FAIL,
              code: error.response.status,
              error: error.response.statusText,
              data: text
            })
          );
        }
      });
  });
}
