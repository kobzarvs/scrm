var AppDispatcher = require('../dispatcher/AppDispatcher');
var AppConstants = require('../constants/AppConstants'),
    ActionTypes = AppConstants.ActionTypes,
    PayloadSources = AppConstants.PayloadSources;

var AppActions = {

  login: function() {
    AppDispatcher.handleViewAction({
      actionType: ActionTypes.LOGIN
    });
  },

  logout: function() {
    AppDispatcher.handleViewAction({
      actionType: ActionTypes.LOGOUT
    });
  },

  getServerTime: function() {
    AppDispatcher.handleViewAction({
      actionType: ActionTypes.GET_SERVER_TIME
    });
  },

  setOnline: function() {
    AppDispatcher.handleViewAction({
      actionType: ActionTypes.SET_EVENT_SOURCE_ONLINE
    });
  },



};

module.exports = AppActions;
