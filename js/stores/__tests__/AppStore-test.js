'use strict';

jest.autoMockOff();


var AppStore, ad, simpleStorage, AppActions;

var getData = require('../../../lib/fixtures');

describe('AppStore', function() {
	beforeEach(function() {
		simpleStorage = require('../../../lib/simpleStorage');
		AppActions = require('../../actions/AppActions');
		ad = require('../../dispatcher/AppDispatcher');
	});


	describe('init', function() {
		beforeEach(function() {
			jest.mock('../../../lib/simpleStorage');
			simpleStorage = require('../../../lib/simpleStorage');
			AppStore = require('../AppStore');
			ad.register = jest.genMockFunction();
		});

		it('должен проходить инициализацию при отсутствии данных о предыдущей сессии', function() {
			AppStore.init();
			expect(ad.register).toBeCalled();

			var state = AppStore.getState();
			expect(state).toBe(undefined);
		});


		it('после обновления страницы должен получать данные о пользователе из локального хранилища', function() {
			AppStore.onChangeStorage = jest.genMockFunction();

			simpleStorage.__set_data(getData());

			AppStore.init();
			expect(ad.register).toBeCalled();

			var state = AppStore.getState();
			expect(state.email).toBe('kobzarvs@gmail.com');
		});
	});


	describe('emitChange', function() {
		it('должен рассылать события подписчикам', function() {
		 	AppStore = require('../AppStore');
			AppStore.init();
			AppStore.getState();

			AppStore.emit = jest.genMockFunction();
			AppActions.login();
			expect(AppStore.emit).toBeCalledWith('change');

			AppStore.emitChange = jest.genMockFunction();
			AppActions.login();
			expect(AppStore.emitChange).toBeCalled();
		});
	});


	describe('addChangeListener / removeListener', function() {
		it('должен добавлять и удалять обработчики подписчиков ', function() {
		 	AppStore = require('../AppStore');
			AppStore.on = jest.genMockFunction();
			AppStore.removeListener = jest.genMockFunction();

			var onChange = jest.genMockFunction();

	 		AppStore.addChangeListener(onChange);
			expect(AppStore.on).toBeCalledWith('change', Function);
	 		
	 		AppStore.removeChangeListener(onChange);
			expect(AppStore.removeListener).toBeCalledWith('change', Function);
		});
	});


	it('должен запускать обработчики подписчиков при возникновении события change', function() {
	 	AppStore = require('../AppStore');
		AppStore.init();
		var onChange = jest.genMockFunction();

 		AppStore.addChangeListener(onChange);
 		AppActions.login();
		expect(onChange).toBeCalled();

 		AppStore.removeChangeListener(onChange);
 		AppActions.login();
		expect(onChange.mock.calls.length).toBe(1);
	});


	describe('onChangeStorage', function() {
		beforeEach(function() {
			jest.mock('../../../lib/simpleStorage');
			ss = require('../../../lib/simpleStorage');

		 	AppStore = require('../AppStore');

			ss.__set_data(getData(true));
			_ = require('lodash');

			AppStore.init();
		});


		it('должен восстановить обработчики перечисленные в __ttlList', function() {
			expect(setInterval).toBeCalled();
			
			jest.runOnlyPendingTimers();

			expect(ss.data.__ttlList.userInfo).toBeDefined();
			expect(ss.data.__ttlList.userInfo[0]).toBe('SESSION_EXPIRED');
			expect(ss.data.__ttlList.userInfo[1]).toBe(1000);
		});	

		it('при отсутствии переменной в хранилище должен запускать обработчик и удалить его из __ttlList', function() {
			ad.handleStorageAction = jest.genMockFunction();

			// удаление данных о пользователе по окончании времени сессии
			delete ss.data['userInfo'];

			jest.runOnlyPendingTimers();

			expect(ss.data.__ttlList.userInfo).toBeUndefined();
			expect(ad.handleStorageAction).toBeCalledWith({actionType: 'SESSION_EXPIRED'});
		});	
	});
});
