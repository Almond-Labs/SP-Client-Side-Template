//! require('sp.js', 'sp')
//! require('deferred.js', 'deferred')
//! require('react')
var SPReact = (function () {

    var SPReact = {};

    SPReact.User = React.createClass({
        getDefaultProps: function () {
            return {
                users: []
            };
        },
		getInitialState: function() {
			var users = Array.isArray(this.props.users) ? this.props.users : [this.props.users];
            return {
                users: users,
				userHtml: []
            }
        },
        componentWillReceiveProps: function (newProps) {
			console.log("SPReact.User willReceiveProps");
			console.debug(newProps);
			var users = Array.isArray(newProps.users) ? newProps.users : [newProps.users];
            this.setState({
                users: users
            });
        },
        componentDidUpdate: function() {
			if (this.state.selfUpdate)
				return;

			var self = this;
			var promises = this.state.users.map(function(c) {
				return sp.csom.user.renderUserPresence(c);
			});
			deferred.all(promises).done(function() {
				console.log("SPReact.User didUpdate deferred.all callback");
				console.debug(arguments);
				var presenceMarkup = Array.prototype.slice.call(arguments);
				console.log("SPReact.User.didUpdate deferred.all");
				console.debug(presenceMarkup);
				self.state.selfUpdate = true;
				self.setState({userHtml: presenceMarkup}, function() {
					ProcessImn();
					self.state.selfUpdate = false;
				});
			});
        },
		componentDidMount: function() {
			console.log("SPReact.User componentDidMount");
			this.componentDidUpdate();
		},
        render: function () {
			console.log("SPReact.User render");
			return (
				<div>
				{	this.state.userHtml.map(function(c) {
						return <div dangerouslySetInnerHTML={{ __html: c[0] }}></div>
					})	}
				</div>
			);
        }
    });

    var module = { modulePlaceholder: true };
    return module.exports = SPReact;
})();