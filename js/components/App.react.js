var React = require('react');
var cx = require('react/lib/cx');

var ClientList = require('./ClientList.react');
var LoginScreen = require('./LoginScreen.react');

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

    var userInfo;

    if (AppStore.email) {
        userInfo = <div><b>User: </b> {AppStore.email}</div>

    } else {
        userInfo = <input type="button" onClick={this.onclick} value="Logout" />
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
 	},

  componentWillUnmount: function() {
    AppStore.removeChangeListener(this.onChange);
  },

  shouldComponentUpdate: function(nextProps, nextState) {
 		var as = AppStore.getState();

		return true;
	},

 	onChange: function(e) {
 		this.setState(AppStore.getState());
 	},

  render: function() {
  	var connStatus = cx({
  		'connection_status': true,
  		'offline': (AppStore.eventSourceStatus == ActionTypes.EVENT_SOURCE_CONNECTING)
  	});

    if (!AppStore.email) {
      
      return <LoginScreen />

    } else {
      return (
        <div>
          <UserInfo />

          <br />

          <ClientList></ClientList>
        </div>
      )
    }
  }

});

module.exports = App;


