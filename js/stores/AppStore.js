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
	  		clearInterval(tid);
		    console.log("tid: " + tid);
			action();
		}
	}.bind(this), interval);
}



ad = AppDispatcher.register(function(payload) {
	var action = payload.action;

	switch(payload.source) {

		//
		//	STORAGE ACTIONS
		//
		case PayloadSources.STORAGE_ACTION:
			console.log("PayloadSources.STORAGE_ACTION", payload.action);

			switch(action.actionType) {
				default:
					return true;
			}
			break;


		//
		//	LOGIN ACTIONS
		//
		case PayloadSources.LOGIN_ACTION:
			console.log("PayloadSources.LOGIN_ACTION", payload.action);

			switch(action.actionType) {

				case ActionTypes.LOGIN:

					fdb.authWithOAuthPopup("facebook", function(error, authData) {
					  if (error) {
					    console.log("Login Failed!", error);

					  } else {
					    AppStore.email = authData.facebook.email;
					    AppStore.uid = authData.uid;

					    console.log(authData.facebook.cachedUserProfile);
					    AppStore.user = authData.facebook.cachedUserProfile;
					    					    
					    fdb = new Firebase(FIREBASE + AppStore.uid);

					    simpleStorage.set('email', AppStore.email, {TTL: 1000*30});
					    onChangeStorage('email', AppActions.logout, 1000);
					    AppActions.loginSuccess();
					  }
					}, {
						scope: "email"
					});
					break;

				case ActionTypes.LOGIN_SUCCESS:
					console.log("handle: login success");
					break;

				case ActionTypes.LOGOUT:
					AppStore.email = null;
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
				default:
					return true;
		}
		break;
	}

	AppStore.emitChange();

	return true;
});


module.exports = AppStore;
