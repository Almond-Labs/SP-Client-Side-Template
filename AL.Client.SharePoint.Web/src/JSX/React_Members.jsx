//! require('react')
//! require('SPReact.js', 'SPReact')
var React_Members = (function () {

	var MembersEdit = React.createClass({
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
				<div>
					<div className="row">
						<div className="col-md-5">
							<SPReact.PeoplePicker users={this.state.users} onUpdate={this.onPeoplePickerUpdate} />
						</div>
						<div className="col-md-5">
							<input type="button" className="btn btn-primary" value="Save changes" onClick={this.onSave} />
						</div>
					</div>
					<div className="row">
					{	this.state.onSaveStatus === null ? null :
						<div className="col-md-5">
						{	this.state.onSaveStatus === "success" ?
							<div className="alert alert-success">Save successful</div> :
							<div className="alert alert-danger">Error saving list name</div>	}
						</div>	}
					</div>
				</div>
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

    var Members = React.createClass({
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
				<div className="container-fluid">
				{	this.state.editMode ?
					<MembersEdit users={this.state.users} onSave={this.state.onSave} /> :
					<SPReact.UserPresence users={this.state.users} />	}
				</div>
            );
        }
    });

    (typeof exports !== 'undefined')
        && exports(Members);

    return Members;
})();