var assign = require('object-assign');
var EventEmitter = require('events').EventEmitter;

var AppConstants = require('../constants/AppConstants'),
		ActionTypes = AppConstants.ActionTypes,
		PayloadSources = AppConstants.PayloadSources;

var AppDispatcher = require('../dispatcher/AppDispatcher');
var AppEventSource = require('../dispatcher/AppEventSource');
var AppActions = require('../actions/AppActions');

var Firebase = require("firebase");
var fdb = new Firebase("https://blistering-heat-2586.firebaseio.com/");



var CHANGE_EVENT = 'change';

var time = null;
var AppStore;


AppStore = assign({}, EventEmitter.prototype, {
	waitForTime: false,
	eventSourceStatus: ActionTypes.EVENT_SOURCE_OFFLINE,
	email: null,
	uid: null,

	getState: function() {
		return {
			time: time,
			eventSourceStatus: this.eventSourceStatus,
			user: {
				email: this.email,
				uid: this.uid
			}
		}
	},

	emitChange: function() {
		this.emit(CHANGE_EVENT);
	},

	/**
	 * @param {function} callback
	 */
	addChangeListener: function(callback) {
		this.on(CHANGE_EVENT, callback);
	},

	/**
	 * @param {function} callback
	 */
	removeChangeListener: function(callback) {
		this.removeListener(CHANGE_EVENT, callback);
	}
});




ad = AppDispatcher.register(function(payload) {
	var action = payload.action;

	switch(payload.source) {

		//
		//	VIEW ACTIONS
		//
		case PayloadSources.SERVER_ACTION:
			console.log("PayloadSources.SERVER_ACTION", payload.action);

			switch(action.actionType) {
				case ActionTypes.SERVER_TIME:
					time = action.data.time
					var data = {}
					data = {
						server_time: time
					};
					console.log(data);
					if (AppStore.email)
						fdb.set(data);
					break;

				case ActionTypes.EVENT_SOURCE_ONLINE:
					console.log("Online");
					AppStore.eventSourceStatus = ActionTypes.EVENT_SOURCE_ONLINE;
					break;

				case ActionTypes.LOGIN_SUCCESS:
					console.log("login success");
					break;

				case ActionTypes.SESSION_EXPIRED:
					console.log("session expired!");
					break;

				case ActionTypes.EVENT_SOURCE_CONNECTING:
					console.log("Connection lost! Connectiong...");
					AppStore.eventSourceStatus = ActionTypes.EVENT_SOURCE_CONNECTING;
					break;

				case ActionTypes.EVENT_SOURCE_ERROR:
					console.log("Connection Error");
					AppStore.eventSourceStatus = ActionTypes.EVENT_SOURCE_ERROR;
					break;

				default:
					return true;
			}
			break;


		//
		//	VIEW ACTIONS
		//
		case PayloadSources.VIEW_ACTION:
			console.log("PayloadSources.VIEW_ACTION", payload.action);

			switch(action.actionType) {
				
				case ActionTypes.LOGIN:
					fdb.authWithOAuthPopup("facebook", function(error, authData) {
					  if (error) {
					    console.log("Login Failed!", error);
					  } else {
					    console.log("Authenticated successfully with payload:", authData.facebook.email);
					    AppStore.email = authData.facebook.email;
					    AppStore.uid = authData.uid;
					    
					    simpleStorage.set('email', AppStore.email, {TTL: 1000*30});
					    var tid = setInterval(function(){
					    	email = simpleStorage.get('email');
					    	console.log(email);
					    	if (!email) {
					    		AppStore.email = null;
		
							    AppDispatcher.handleServerAction({
						  			actionType: ActionTypes.SESSION_EXPIRED
						  		});
							    console.log("tid: " + tid);
						  		clearInterval(tid);
					    	}
					    }.bind(this), 1000);

					    console.log('UID: '+AppStore.uid);
					    fdb = new Firebase("https://blistering-heat-2586.firebaseio.com/"+AppStore.uid);

					    AppDispatcher.handleServerAction({
				  			actionType: ActionTypes.LOGIN_SUCCESS
				  		});
					  }
					}, {
						scope: "email"
					});
					break;

				case ActionTypes.GET_SERVER_TIME:
					$.get( "/GET_SERVER_TIME" );
					break;

				case ActionTypes.SET_EVENT_SOURCE_ONLINE:
					console.log("Connecting...");
					AppStore.eventSourceStatus = ActionTypes.EVENT_SOURCE_CONNECTING;
					AppEventSource.init('/server-events');
					break;

				default:
					return true;
		}
		break;
	}

	AppStore.emitChange();

	return true;
});


module.exports = AppStore;
