var React = require('react');
var cx = require('react/lib/cx');

var AppStore = require('../stores/AppStore');
var AppActions = require('../actions/AppActions');
var AppConstants = require('../constants/AppConstants'),
    ActionTypes = AppConstants.ActionTypes,
    PayloadSources = AppConstants.PayloadSources;

var AppDispatcher = require('../dispatcher/AppDispatcher');



var Desktop = React.createClass({
  getInitialState: function() {
    return {}
  },  

  onChange: function(e) {
    if (this.isMounted())
      this.setState({});
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
    var userInfo = this.props.userInfo;
    var mainMenu = <div />

    if (userInfo !== {}) {
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
            <img src={userInfo.picture.data.url} style={{height:34, width:34, padding:0, margin:0}} />
          </div>
        </div>
      </div>
    } else {
//        userInfo = <input type="button" onClick={this.onclick} value="Logout" />
    }

    return mainMenu;
  }

});

module.exports = Desktop;
