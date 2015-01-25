var React = require('react');
var cx = require('react/lib/cx');

var AppStore = require('../stores/AppStore');
var AppActions = require('../actions/AppActions');
var AppConstants = require('../constants/AppConstants'),
		ActionTypes = AppConstants.ActionTypes,
		PayloadSources = AppConstants.PayloadSources;

var AppDispatcher = require('../dispatcher/AppDispatcher');



var LoginScreen = React.createClass({
	mixins: [],
	
	
	getInitialState: function() {
		return {
			
		};
	},
	

	// Invoked once, both on the client and server, immediately before the initial rendering occurs.
	// If you call setState within this method, render() will see the updated state and will be executed
	// only once despite the state change.
  	componentWillMount: function() {
  	},

	// Invoked once, only on the client (not on the server), immediately after the initial rendering occurs.
	// At this point in the lifecycle, the component has a DOM representation which you can access via this.getDOMNode().
	// If you want to integrate with other JavaScript frameworks, set timers using setTimeout or setInterval,
	// or send AJAX requests, perform those operations in this method.
  	componentDidMount: function() {
  	},

	// Invoked when a component is receiving new props.
	// This method is not called for the initial render.
	// Use this as an opportunity to react to a prop transition
	// before render() is called by updating the state using this.setState().
	// The old props can be accessed via this.props.
	// Calling this.setState() within this function will not trigger an additional render.
	componentWillReceiveProps: function(nextProps) {
	},
  	
	// Invoked before rendering when new props or state are being received.
	// This method is not called for the initial render or when forceUpdate is used.
	// Use this as an opportunity to return false when you're certain that the transition
	// to the new props and state will not require a component update.
	shouldComponentUpdate: function(nextProps, nextState) {
		return true;
	},


	// Invoked immediately before rendering when new props or state are being received.
	// This method is not called for the initial render.
	// Use this as an opportunity to perform preparation before an update occurs.
	componentWillUpdate: function(props, state) {
	},

	// Invoked immediately after updating occurs. This method is not called for the initial render.
	// Use this as an opportunity to operate on the DOM when the component has been updated.
	componentDidUpdate:function() {
	},
  	

	// Invoked immediately before a component is unmounted from the DOM.
	// Perform any necessary cleanup in this method, such as invalidating
	// timers or cleaning up any DOM elements that were created in componentDidMount.
  	componentWillUnmount: function() {
	},
	
	login: function(e) {
		e.stopPropagation();
		e.preventDefault();

	    AppActions.login();
	},

	render: function() {
		
		return (
			<div className={cx({"ui dimmer page":true, "transition visible active":!AppStore.email})}>
				<div className="content modal">
    				<div className="center">
    					<h2 className="ui inverted icon header" onClick={this.login} onTouchEnd={this.login}>
						<i className="massive facebook square icon"></i>
						Login
						</h2>
					</div>
				</div>
			</div>
		);
	}

});


module.exports = LoginScreen;
