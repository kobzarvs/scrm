var AppDispatcher = require('../dispatcher/AppDispatcher');
var AppConstants = require('../constants/AppConstants'),
    ActionTypes = AppConstants.ActionTypes,
    PayloadSources = AppConstants.PayloadSources;


var AppEventSource = {
	init: function(url, open_cb) {
		url = url || '/server-events';
		es = new EventSource(url);
		es.onmessage = this.onmessage;
		es.onopen = open_cb || this.onopen;
		es.onerror = this.onerror;
	},

	onmessage: function(e) {
  		//console.log(e);
  		AppDispatcher.handleServerAction(JSON.parse(e.data));
	},

	onopen: function(e) {
		//AppDispatcher.waitFor([client, server]);
  		AppDispatcher.handleServerAction({
  			actionType: ActionTypes.EVENT_SOURCE_ONLINE
  		});
	},

	onerror: function(e) {
  		if (this.readyState == EventSource.CONNECTING) {     
	  		AppDispatcher.handleServerAction({
	  			actionType: ActionTypes.EVENT_SOURCE_CONNECTING
	  		});
  		} else {
	  		AppDispatcher.handleServerAction({
	  			actionType: ActionTypes.EVENT_SOURCE_ERROR
	  		});
  		}
  	}
};

module.exports = AppEventSource;
