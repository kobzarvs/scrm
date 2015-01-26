
var keyMirror = require('keymirror');

module.exports = {

  FIREBASE: "https://blistering-heat-2586.firebaseio.com/",

  ActionTypes: keyMirror({
    LOGIN: null,
    LOGIN_SUCCESS: null,
    LOGIN_FAILED: null,
    SESSION_EXPIRED: null,
    LOGOUT: null,

    STORAGE_VALUE_EXPIRED: null,
  }),

  PayloadSources: keyMirror({
    STORAGE_ACTION: null,
    VIEW_ACTION: null,
    LOGIN_ACTION: null
  })

};
