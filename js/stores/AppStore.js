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

var _ = require('lodash');

// var simpleStorage = {
// 	get: function() {
// 		console.log("get");
// 	},
// 	set: function() {
// 		console.log("set");
// 	}

// };
var simpleStorage = require('../../lib/simpleStorage.js');

var CHANGE_EVENT = 'change';
var AppStore = {};


//console.log("simpleStorage: " + simpleStorage.get());


AppStore = _.assign({}, EventEmitter.prototype, {
	userInfo: undefined,

	getState: function() {
	    this.userInfo = simpleStorage.get('userInfo');
		return this.userInfo;
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
	},


	// Устанавливает наблюдение за переменной в локальном хранилище
	onChangeStorage: function(key, action, interval) {
		var ttl = simpleStorage.get('__ttlList') || {};

		if (ttl[key]!==undefined) {
		  	clearInterval(ttl[key]);
		} else {
			ttl[key] = [action, interval];
			simpleStorage.set('__ttlList', ttl);
		}

		tid = setInterval(function(){
			var val = simpleStorage.get(key);

			if (val === undefined) {
		  		clearInterval(tid);
				var ttl = simpleStorage.get('__ttlList') || {};

				if (ttl[key]!==undefined) {
					delete ttl[key];
					simpleStorage.set('__ttlList', ttl);
				}

				AppDispatcher.handleStorageAction({
			      actionType: action
			    });
			}
		}.bind(this), interval);
	},


	// Восстанавливает обработчики для всех наблюдаемых переменных локального хранилища
	initStorage: function() {
		var ttl = simpleStorage.get('__ttlList') || {};

		_.forIn(ttl, function(value, key) {
			if (simpleStorage.get(key) !== undefined)
				this.onChangeStorage(key, value[0], value[1]);
		}.bind(this));
	},

	init: function() {

		ad = AppDispatcher.register(function(payload) {
			var action = payload.action;

			switch(payload.source) {

				//
				//	STORAGE ACTIONS
				//
				case PayloadSources.STORAGE_ACTION:
//					console.log("STORAGE_ACTION", payload.action);

					switch(action.actionType) {
						case ActionTypes.SESSION_EXPIRED:
							AppStore.userInfo = undefined;
							break;

						default:
							return true;
					}
					break;


				//
				//	LOGIN ACTIONS
				//
				case PayloadSources.LOGIN_ACTION:
					// console.log("LOGIN_ACTION", payload.action);

					switch(action.actionType) {

						case ActionTypes.LOGIN:

							fdb.authWithOAuthPopup("facebook", function(error, authData) {
							  if (error) {
							    AppActions.loginFailed();

							  } else {
							    AppStore.userInfo = authData.facebook.cachedUserProfile;
							    					    
							    fdb = new Firebase(FIREBASE + AppStore.uid);

							    simpleStorage.set('userInfo', AppStore.userInfo, {TTL: 1000*5});
							    AppStore.onChangeStorage('userInfo', ActionTypes.SESSION_EXPIRED, 500);
							    AppActions.loginSuccess();
							  }
							}, {
								scope: "email"
							});
							break;

						case ActionTypes.LOGIN_SUCCESS:

							break;

						case ActionTypes.LOGIN_FAILED:

							AppStore.userInfo = undefined;
							break;

						case ActionTypes.LOGOUT:
							AppStore.userInfo = undefined;
							break;

						default:
							return true;
					}
					break;

				//
				//	VIEW ACTIONS
				//
				case PayloadSources.VIEW_ACTION:
					// console.log("VIEW_ACTION", payload.action);

					switch(action.actionType) {
						default:
							return true;
				}
				break;
			}

			AppStore.emitChange();

			return true;
		});

		return ad;
	}
});



module.exports = AppStore;
