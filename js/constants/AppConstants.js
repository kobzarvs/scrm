
var keyMirror = require('keymirror');

module.exports = {

  ActionTypes: keyMirror({
    LOGIN: null,
    LOGIN_SUCCESS: null,
    SESSION_EXPIRED: null,

    SERVER_TIME: null,
    GET_SERVER_TIME: null,

    EVENT_SOURCE_OFFLINE: null,
    SET_EVENT_SOURCE_ONLINE: null,
    EVENT_SOURCE_ONLINE: null,
    EVENT_SOURCE_CONNECTING: null,
    EVENT_SOURCE_ERROR: null,
  }),

  PayloadSources: keyMirror({
    SERVER_ACTION: null,
    VIEW_ACTION: null
  })

};
