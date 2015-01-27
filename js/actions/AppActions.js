var AppDispatcher = require('../dispatcher/AppDispatcher');
var AppConstants = require('../constants/AppConstants'),
    ActionTypes = AppConstants.ActionTypes,
    PayloadSources = AppConstants.PayloadSources;

//console.log(AppConstants);

var AppActions = {

  login: function() {
    AppDispatcher.handleLoginAction({
      actionType: ActionTypes.LOGIN
    });
  },

  logout: function() {
    AppDispatcher.handleLoginAction({
      actionType: ActionTypes.LOGOUT
    });
  },

  sessionExpired: function() {
    AppDispatcher.handleLoginAction({
      actionType: ActionTypes.SESSION_EXPIRED
    });
  },

  loginSuccess: function() {
    AppDispatcher.handleLoginAction({
      actionType: ActionTypes.LOGIN_SUCCESS
    });
  },

  loginFailed: function() {
    AppDispatcher.handleLoginAction({
      actionType: ActionTypes.LOGIN_FAILED
    });
  }

};

module.exports = AppActions;
