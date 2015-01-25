var assign = require('object-assign');
var EventEmitter = require('events').EventEmitter;

var AppConstants = require('../constants/AppConstants'),
		FIREBASE = AppConstants.FIREBASE,
		ActionTypes = AppConstants.ActionTypes,
		PayloadSources = AppConstants.PayloadSources;

var AppDispatcher = require('../dispatcher/AppDispatcher');
var AppActions = require('../actions/AppActions');

var Firebase = require("firebase"),
	fdb = new Firebase(FIREBASE);

var CHANGE_EVENT = 'change';

var AppStore;


AppStore = assign({}, EventEmitter.prototype, {
	email: null,
	uid: null,

	getState: function() {
		return {
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


function onChangeStorage(key, action, interval) {
	tid = setInterval(function(){
		var val = simpleStorage.get(key);
		console.log(val);
		if (val === undefined) {
			action();
		    console.log("tid: " + tid);
	  		clearInterval(tid);
		}
	}.bind(this), interval);
}



ad = AppDispatcher.register(function(payload) {
	var action = payload.action;

	switch(payload.source) {

		//
		//	VIEW ACTIONS
		//
		case PayloadSources.STORAGE_ACTION:
			console.log("PayloadSources.STORAGE_ACTION", payload.action);

			switch(action.actionType) {

				case ActionTypes.LOGIN_SUCCESS:
					console.log("handle: login success");
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
				
				case ActionTypes.LOGOUT:
					AppStore.email = null;
					break;

				case ActionTypes.LOGIN:

					fdb.authWithOAuthPopup("facebook", function(error, authData) {
					  if (error) {
					    console.log("Login Failed!", error);
					  } else {
					    AppStore.email = authData.facebook.email;
					    AppStore.uid = authData.uid;
					    
					    console.log('UID: '+AppStore.uid);
					    fdb = new Firebase(FIREBASE + AppStore.uid);

					    simpleStorage.set('email', AppStore.email, {TTL: 1000*5});
					    onChangeStorage('email', AppActions.logout, 1000);

					    AppDispatcher.handleStorageAction({
				  			actionType: ActionTypes.LOGIN_SUCCESS
				  		});
					  }
					}, {
						scope: "email"
					});
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
