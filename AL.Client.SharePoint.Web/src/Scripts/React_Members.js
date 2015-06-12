//! require('react')
//! require('SPReact.js', 'SPReact')
var React_Members = (function () {

	var MembersEdit = React.createClass({displayName: "MembersEdit",
		getDefaultProps: function() {
			return {
				users: [],
				onSave: function() {}
			};
		},
		getInitialState: function() {
			return {
				users: this.props.users,
				onSaveStatus: null
			};
		},
		componentWillReceiveProps: function(newProps) {
			this.setState({users : newProps.users});
		},
		render: function() {
			return (
				React.createElement("div", null, 
					React.createElement("div", {className: "row"}, 
						React.createElement("div", {className: "col-md-5"}, 
							React.createElement(SPReact.PeoplePicker, {users: this.state.users, onUpdate: this.onPeoplePickerUpdate})
						), 
						React.createElement("div", {className: "col-md-5"}, 
							React.createElement("input", {type: "button", className: "btn btn-primary", value: "Save changes", onClick: this.onSave})
						)
					), 
					React.createElement("div", {className: "row"}, 
						this.state.onSaveStatus === null ? null :
						React.createElement("div", {className: "col-md-5"}, 
							this.state.onSaveStatus === "success" ?
							React.createElement("div", {className: "alert alert-success"}, "Save successful") :
							React.createElement("div", {className: "alert alert-danger"}, "Error saving list name")	
						)	
					)
				)
			)
		},
		onPeoplePickerUpdate: function(newUsers) {
			this.setState({users: newUsers});
		},
		onSave: function() {
			this.props.onSave(this.state.users, this.onSaveCallback.bind(this));
		},
		onSaveCallback: function(err) {
			var self = this;
			this.setState({ onSaveStatus: err ? "failure" : "success" }, function() {
				if (self.state.onSaveStatus === "success") {
					setTimeout(function() {
						window.location = window.location.href;
					}, 5000);
				}
			});
		}
	});

    var Members = React.createClass({displayName: "Members",
		getDefaultProps: function() {
			return {
				users: [],
				onSave: function() {}
			};
		},
		getInitialState: function() {
			return {
				users: this.props.users,
				onSave: this.props.onSave
			};
		},
        render: function() {
            return (
				React.createElement("div", {className: "container-fluid"}, 
					this.state.editMode ?
					React.createElement(MembersEdit, {users: this.state.users, onSave: this.state.onSave}) :
					React.createElement(SPReact.UserPresence, {users: this.state.users})	
				)
            );
        }
    });

    (typeof exports !== 'undefined')
        && exports(Members);

    return Members;
})();