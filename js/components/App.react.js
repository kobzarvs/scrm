var React = require('react');
var cx = require('react/lib/cx');

var ClientList = require('./ClientList.react.js');

var AppStore = require('../stores/AppStore');
var AppActions = require('../actions/AppActions');
var AppConstants = require('../constants/AppConstants'),
		ActionTypes = AppConstants.ActionTypes,
		PayloadSources = AppConstants.PayloadSources;

var AppDispatcher = require('../dispatcher/AppDispatcher');

var connStatusText = {
	'EVENT_SOURCE_CONNECTING': 'Connecting...',
	'EVENT_SOURCE_ONLINE': 'Online',
	'EVENT_SOURCE_ERROR': 'Error',
	'EVENT_SOURCE_OFFLINE': 'Offline'
};



var UserInfo = React.createClass({
  getInitialState: function() {
    return {
      email: AppStore.email
    }
  },  

  onChange: function(e) {
    this.setState({email: AppStore.email});
  },

  componentDidMount: function() {
    AppStore.addChangeListener(this.onChange);
  },

  componentWillUnmount: function() {
    AppStore.removeChangeListener(this.onChange);
  },

  onclick: function(e) {
    console.log("login");
    AppActions.login();
  },

  render: function() {
    var connStatus = cx({
      'connection_status': true,
      'offline': (AppStore.eventSourceStatus == ActionTypes.EVENT_SOURCE_CONNECTING)
    });

    var userInfo;

    if (AppStore.email) {
        userInfo = <div><b>User: </b> {AppStore.email}</div>

    } else {
        userInfo = <input type="button" onClick={this.onclick} value="Login" />
    }

    return userInfo;
  }

});




var App = React.createClass({
	getInitialState: function() {

		return {
			time: ''
		}
	},  

 	componentDidMount: function() {
 		AppStore.addChangeListener(this.onChange);
 		AppActions.setOnline();
 	},

  componentWillUnmount: function() {
    AppStore.removeChangeListener(this.onChange);
  },

  shouldComponentUpdate: function(nextProps, nextState) {
 		var as = AppStore.getState();

 		if (!AppStore.waitForTime && as.time == null && AppStore.eventSourceStatus == ActionTypes.EVENT_SOURCE_ONLINE) {
 			AppStore.waitForTime = true;
			AppActions.getServerTime();
			console.log("query");
 		}

		return true;
	},

 	onChange: function(e) {
 		this.setState(AppStore.getState());
 	},

 	onclick: function(e) {
 		console.log("click");
		AppActions.getServerTime();
 	},

  render: function() {
  	var connStatus = cx({
  		'connection_status': true,
  		'offline': (AppStore.eventSourceStatus == ActionTypes.EVENT_SOURCE_CONNECTING)
  	});
    return (
      <div>
      	<b>Status: </b>
      	<span className={connStatus}>{connStatusText[AppStore.eventSourceStatus]}</span>
        <UserInfo />
        <br />
      	<b>Time: </b>{this.state.time}
      	<input type="button" onClick={this.onclick} value="Get Server Time" />
        <br />
        <ClientList></ClientList>
      </div>
    )
  }

});

module.exports = App;


