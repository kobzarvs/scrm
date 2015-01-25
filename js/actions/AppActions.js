var AppDispatcher = require('../dispatcher/AppDispatcher');
var AppConstants = require('../constants/AppConstants'),
    ActionTypes = AppConstants.ActionTypes,
    PayloadSources = AppConstants.PayloadSources;

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

  loginSuccess: function() {
    AppDispatcher.handleLoginAction({
      actionType: ActionTypes.LOGIN_SUCCESS
    });
  }

};

module.exports = AppActions;
