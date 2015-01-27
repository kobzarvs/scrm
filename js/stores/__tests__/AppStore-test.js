'use strict';

jest.autoMockOff();


var AppStore, ad, simpleStorage, AppActions;

function getData(f) {
	var userInfo = {
		id: "798547670218447",
		last_name: "Кобзарь",
		name: "Валерий Кобзарь",
		email: 'kobzarvs@gmail.com',
		picture: {
			data: {
				url: "https://fbcdn-profile-a.akamaihd.net/hprofile-ak-xpf1/v/t1.0-1/s100x100/296422_382653581807860_132097568_n.jpg?oh=98847c035c3cd20be6a23129e095f743&oe=5555B5B1&__gda__=1432058505_5f4255a3ccbb59d55f1109d2f3ef36be"
			}
		}
	};

	var testData = {
		'__ttlList': f ? {'userInfo': ['SESSION_EXPIRED', 1000]} : {},
		'userInfo': userInfo
	}

	return testData;
}


describe('AppStore', function() {
	beforeEach(function() {
		simpleStorage = require('../../../lib/simpleStorage');
		AppActions = require('../../actions/AppActions');
		ad = require('../../dispatcher/AppDispatcher');
	});


	describe('init', function() {
		it('должен проходить инициализацию при отсутствии данных о предыдущей сессии', function() {
			jest.mock('../../../lib/simpleStorage');
			simpleStorage = require('../../../lib/simpleStorage');
			AppStore = require('../AppStore');

			ad.register = jest.genMockFunction();

			AppStore.init();
			expect(ad.register).toBeCalled();
			expect(ad.register.mock.calls.length).toBe(1);
			expect(simpleStorage.get.mock.calls.length).toBe(1);

			var state = AppStore.getState();
			expect(simpleStorage.get.mock.calls.length).toBe(2);
			expect(state).toBe(undefined);
		});


		it('после обновления страницы должен получать данные о пользователеиз локального хранилища', function() {
			jest.mock('../../../lib/simpleStorage');
			simpleStorage = require('../../../lib/simpleStorage');
			jest.dontMock('../AppStore');
			AppStore = require('../AppStore');

			AppStore.onChangeStorage = jest.genMockFunction();
			ad.register = jest.genMockFunction();

			simpleStorage.__set_data(getData());

			AppStore.init();
			expect(ad.register).toBeCalled();
			expect(ad.register.mock.calls.length).toBe(1);

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
