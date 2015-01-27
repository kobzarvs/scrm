'use strict';


jest.autoMockOff();


var AppStore, assign, ad, simpleStorage;

describe('AppStore', function() {
	beforeEach(function() {
		simpleStorage = require('../../../lib/simpleStorage');
		AppActions = require('../../actions/AppActions');
		ad = require('../../dispatcher/AppDispatcher');
		AppStore = require('../AppStore');
	});



	it('should initialize', function() {
		ad.register = jest.genMockFunction();
		AppStore.onChangeStorage = jest.genMockFunction();
		simpleStorage.get = jest.genMockFunction();

		AppStore.init();
		expect(ad.register).toBeCalled();
		expect(ad.register.mock.calls.length).toBe(1);

		AppStore.initStorage();
		expect(AppStore.onChangeStorage).not.toBeCalled();
		expect(simpleStorage.get.mock.calls.length).toBe(1);

		AppStore.getState();
		expect(simpleStorage.get.mock.calls.length).toBe(2);
	});



	it('should emit change events', function() {
		AppStore.init();
		AppStore.initStorage();
		AppStore.getState();

		AppStore.emit = jest.genMockFunction();
		AppActions.login();
		expect(AppStore.emit).toBeCalledWith('change');

		AppStore.emitChange = jest.genMockFunction();
		AppActions.login();
	});


	it('should add/remove event listeners', function() {
		AppStore.on = jest.genMockFunction();
		AppStore.removeListener = jest.genMockFunction();

		var onChange = jest.genMockFunction();

 		AppStore.addChangeListener(onChange);
		expect(AppStore.on).toBeCalledWith('change', Function);
 		
 		AppStore.removeChangeListener(onChange);
		expect(AppStore.removeListener).toBeCalledWith('change', Function);
	});


	it('should execute event listeners', function() {
		AppStore.init();
		var onChange = jest.genMockFunction();

 		AppStore.addChangeListener(onChange);
 		AppActions.login();
		expect(onChange).toBeCalled();

 		AppStore.removeChangeListener(onChange);
 		AppActions.login();
		expect(onChange.mock.calls.length).toBe(1);
	});

});
