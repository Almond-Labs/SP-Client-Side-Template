//! require('sp.js', 'sp')
//! require('deferred.js', 'deferred')
//! require('react')
var SPReact = (function () {

    var SPReact = {};

    SPReact.UserPresence = React.createClass({displayName: "UserPresence",
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
				React.createElement("div", null, 
					this.state.userHtml.map(function(c) {
						return React.createElement("div", {dangerouslySetInnerHTML: { __html: c[0]}})
					})	
				)
			);
        }
    });

	SPReact.PeoplePicker = React.createClass({displayName: "PeoplePicker",
		getDefaultProps: function () {
            return {
                users: [],
				onUpdate: function() {}
            };
        },
		getInitialState: function() {
            return {
                users: this.props.users
            }
        },
		componentWillReceiveProps: function(nextProps) {
			this.setState({users: nextProps.users});
		},
		shouldComponentUpdate: function(nextProps, nextState) {
			var update = !(nextState.users.length === this.state.users.length);
			for( var x=0; x<nextState.users.length && !update; x++ ) {
				update = nextState.users[x] !== this.state.users[x];
			}
			return update;
		},
		componentDidUpdate: function () {
			var self = this;
			var elem = React.findDOMNode(this);
			elem.innerHTML = "";
			sp.controls.peoplePicker(elem, function(newValues) {
				self.props.onUpdate(newValues);
			}, this.state.users);
		},
		componentDidMount: function() {
			this.componentDidUpdate();
		},
		render: function() {
			return (React.createElement("div", null));
		}
	});

    (typeof exports !== 'undefined')
        && exports(SPReact);

    return SPReact;
})();