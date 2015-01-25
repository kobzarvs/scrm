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



var MainMenu = React.createClass({
  getInitialState: function() {
    return {
      email: AppStore.email
    }
  },  

  onChange: function(e) {
    if (this.isMounted())
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

    var mainMenu;

    mainMenu = <div className="ui fixed inverted main menu">
      <a className="active item">
        <i className="home icon"></i> Home
      </a>
      <a className="item">
        <i className="mail icon"></i> Messages
      </a>

      <div className="right menu">
        <div className="item">
          <i className="facebook square icon"></i> Logout
        </div>
        <div className="item" style={{padding:0, margin:0}}>
          <img src={AppStore.user.picture.data.url} style={{height:34, width:34, padding:0, margin:0}} />
        </div>
      </div>
    </div>

    if (AppStore.email) {
//        userInfo = <div><b>User: </b> {AppStore.email}</div>


    } else {
//        userInfo = <input type="button" onClick={this.onclick} value="Logout" />
    }

    return mainMenu;
  }

});




var App = React.createClass({
	getInitialState: function() {

		return {
		}
	},  

 	componentDidMount: function() {
 		AppStore.addChangeListener(this.onChange);
 	},

  componentWillUnmount: function() {
    console.log("unmount");
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


    if (!AppStore.email) {
      s = <LoginScreen />

    } else {
      s = <MainMenu />
    }

    return (
      <div>
        {s}
      </div>
    )
  }

});

module.exports = App;


