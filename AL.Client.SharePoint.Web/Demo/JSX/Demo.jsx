
var Demo = React.createClass({
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
			<AlertWrapper>
				<SubDemo name={this.state.name} />
			</AlertWrapper>
		);
	}
});

var SubDemo = React.createClass({
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
			<span>{this.state.message} {this.state.name}!</span>
		);
	}
});

var AlertWrapper = React.createClass({
	render: function() {
		return (
			<div className="alert alert-info">
				{this.props.children}
			</div>
		);
	}
});