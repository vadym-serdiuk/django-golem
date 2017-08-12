import keyMirror from 'fbjs/lib/keyMirror';

export const XHR = keyMirror({
  SUCCESS: undefined,
  FAIL: undefined
});

export const ENDPOINTS = {
  login: 'api/login/',
  logout: 'api/logout/',
  initialData: 'api/initial-data/'
};

export const CSRF_HEADER_KEY = 'X-CSRFToken';
