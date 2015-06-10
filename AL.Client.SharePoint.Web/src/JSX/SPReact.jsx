//! require('sp.js', 'sp')
//! require('deferred.js', 'deferred')
//! require('react')
var SPReact = (function () {

    var SPReact = {};

    SPReact.UserPresence = React.createClass({
        getDefaultProps: function () {
            return {
                users: []
            };
        },
		getInitialState: function() {
			var users = Array.isArray(this.props.users) ? 
				this.props.users : 
				this.props.users.results ? 
					this.props.users.results :
					[this.props.users];

            return {
                users: users,
				userHtml: []
            }
        },
        componentWillReceiveProps: function (newProps) {
			var users = Array.isArray(newProps.users) ? 
				newProps.users : 
				newProps.users.results ? 
					newProps.users.results :
					[newProps.users];

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
				var presenceMarkup = Array.prototype.slice.call(arguments);
				self.state.selfUpdate = true;
				self.setState({userHtml: presenceMarkup}, function() {
					ProcessImn();
					self.state.selfUpdate = false;
				});
			});
        },
		componentDidMount: function() {
			this.componentDidUpdate();
		},
        render: function () {
			return (
				<div>
				{	this.state.userHtml.map(function(c) {
						return <div dangerouslySetInnerHTML={{ __html: c[0] }}></div>
					})	}
				</div>
			);
        }
    });

    (typeof exports !== 'undefined')
        && exports(SPReact);

    return SPReact;
})();