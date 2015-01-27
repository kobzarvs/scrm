var React = require('react');
var cx = require('react/lib/cx');

var ClientList = require('./ClientList.react');
var LoginScreen = require('./LoginScreen.react');
var Desktop = require('./Desktop.react');

var AppStore = require('../stores/AppStore');
var AppActions = require('../actions/AppActions');
var AppConstants = require('../constants/AppConstants'),
    ActionTypes = AppConstants.ActionTypes,
    PayloadSources = AppConstants.PayloadSources;

var AppDispatcher = require('../dispatcher/AppDispatcher');



var App = React.createClass({
	getInitialState: function() {
    AppStore.init();
    AppStore.getState();
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

		return true;
	},

 	onChange: function(e) {
 		this.setState({});
 	},


  render: function() {

    if (AppStore.getState() === undefined) {
      s = <LoginScreen />

    } else {
      s = <Desktop userInfo={AppStore.getState()}/>
    }

    return (
      <div>
        {s}
      </div>
    )
  }

});

module.exports = App;


