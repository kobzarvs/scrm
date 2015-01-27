'use strict';

jest.autoMockOff();

var getData = require('../../../lib/fixtures.js');

var React, App, TestUtils, simpleStorage;

describe('App.react', function() {
	beforeEach(function() {
		jest.mock('../../../lib/simpleStorage');
		simpleStorage = require('../../../lib/simpleStorage');

	    React = require('react/addons');
	    App = require('../App.react');
	    TestUtils = React.addons.TestUtils;
	});


	it('должен предложить залогиниться', function() {
		//simpleStorage.__set_data(getData(false));
		//console.log(simpleStorage.data);

		var actions = require('../../actions/AppActions');
		actions.login = jest.genMockFn();

	    var React = require('react/addons');
	    var App = require('../App.react');
	    var TestUtils = React.addons.TestUtils;

	    var app = TestUtils.renderIntoDocument(
	      <App />
	    );

	    //console.log(app.getDOMNode().innerHTML);
	    //console.log(app.getDOMNode().textContent);

	    var login = TestUtils.findRenderedDOMComponentWithTag(app, 'h2');
	    expect(login.getDOMNode().textContent).toEqual('Login');

	    expect(actions.login).not.toBeCalled();
	    TestUtils.Simulate.click(login);
	    expect(actions.login).toBeCalled();


	});


	it('должен вывести рабочий стол и по истечении срока разлогиниться', function() {
		simpleStorage.__set_data(getData(true));

	    App = require('../App.react');

	    var app = TestUtils.renderIntoDocument(
	      <App />
	    );

//		jest.runOnlyPendingTimers();

	    expect(app.getDOMNode().textContent).toContain('Logout');

		delete simpleStorage.data.userInfo;
		jest.runOnlyPendingTimers();

	    expect(app.getDOMNode().textContent).toContain('Login');
	});



});

