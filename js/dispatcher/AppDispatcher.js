var assign = require('object-assign');

var AppConstants = require('../constants/AppConstants'),
    ActionTypes = AppConstants.ActionTypes,
    PayloadSources = AppConstants.PayloadSources;

var Dispatcher = require('flux').Dispatcher;


var AppDispatcher = assign(new Dispatcher(), {
  handleServerAction: function(action) {
    setTimeout(function() {
      this.dispatch({
        source: PayloadSources.SERVER_ACTION,
        action: action
      });
    }.bind(this), 0);
  },

  handleViewAction: function(action) {
    setTimeout(function() {
      this.dispatch({
        source: PayloadSources.VIEW_ACTION,
        action: action
      });
    }.bind(this), 0);
  }
});



module.exports = AppDispatcher;
