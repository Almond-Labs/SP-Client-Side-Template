
var Demo = React.createClass({displayName: "Demo",
	getDefaultProps: function() {
		return {
			name: null
		};
	},
	getInitialState: function() {
		return {
			name: this.props.name
		};
	},
	render: function() {
		return (
			React.createElement(AlertWrapper, null, 
				React.createElement(SubDemo, {name: this.state.name})
			)
		);
	}
});

var SubDemo = React.createClass({displayName: "SubDemo",
	getDefaultProps: function() {
		return {
			message: "Hello",
			name: null
		}
	},
	getInitialState: function() {
		return {
			message: this.props.message,
			name: this.props.name
		}
	},
	componentWillReceiveProps: function(newProps) {
		this.setState({
			message: newProps.message,
			name: newProps.name
		});
	},
	render: function() {
		return (
			React.createElement("span", null, this.state.message, " ", this.state.name, "!")
		);
	}
});

var AlertWrapper = React.createClass({displayName: "AlertWrapper",
	render: function() {
		return (
			React.createElement("div", {className: "alert alert-info"}, 
				this.props.children
			)
		);
	}
});