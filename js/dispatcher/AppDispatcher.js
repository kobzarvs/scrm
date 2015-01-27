//var assign = require('object-assign');
var _ = require('lodash');

var AppConstants = require('../constants/AppConstants'),
    ActionTypes = AppConstants.ActionTypes,
    PayloadSources = AppConstants.PayloadSources;

var Dispatcher = require('flux').Dispatcher;

var AppDispatcher = new Dispatcher();
_.assign(AppDispatcher, {
  handleStorageAction: function(action) {
//    setTimeout(function() {
      this.dispatch({
        source: PayloadSources.STORAGE_ACTION,
        action: action
      });
//    }.bind(this), 0);
  },

  handleLoginAction: function(action) {
//    setTimeout(function() {
      this.dispatch({
        source: PayloadSources.LOGIN_ACTION,
        action: action
      });
//    }.bind(this), 0);
  },

  handleViewAction: function(action) {
//    setTimeout(function() {
      this.dispatch({
        source: PayloadSources.VIEW_ACTION,
        action: action
      });
//    }.bind(this), 0);
  }
});


module.exports = AppDispatcher;
