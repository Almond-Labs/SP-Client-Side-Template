//! require('react')
//! require('SPReact.js', 'SPReact')
//! require('React_ProgressBar.js', 'React_ProgressBar')
var React_MyTasks = (function () {

	var MyTasksDisplay = React.createClass({displayName: "MyTasksDisplay",
		getDefaultProps: function() {
			return {
				listName: null,
				listData: [],
				errorMessage: null
			};
		},
		getInitialState: function() {
			return {
				listName: null,
				listData: [],
				errorMessage: null
			};
		},
		componentWillReceiveProps: function(newProps) {
			this.setState({
				listName: newProps.listName,
				listData: newProps.listData,
				errorMessage: newProps.errorMessage
			});
		},
		render: function() {
			return (
				React.createElement("div", {className: "panel panel-primary"}, 
					React.createElement("div", {className: "panel-heading"}, 
						React.createElement("h3", {className: "panel-title"}, this.state.listName)
					), 
					React.createElement("div", {className: "panel-body"}, 
						this.state.errorMessage ?
						React.createElement("div", {className: "alert alert-danger"}, this.state.errorMessage) :
						null, 	
						this.state.listData.length === 0 ?
						React.createElement("div", {className: "alert alert-info"}, "No list data") :
						React.createElement("table", {className: "table"}, 
							React.createElement("tr", null, 
								React.createElement("th", null, "Title"), 
								React.createElement("th", null, "Assigned To"), 
								React.createElement("th", null, "Progress")
							), 
								this.state.listData.map(function(c, i) {
									var status = c.PercentComplete === 1 ? "success" : "info";
									var statusMessage = c.PercentComplete === 1 ? "Done!" : "";
									var diffDays = 0
									if (c.DueDate && status !== "success") {
										var oneDay = 24*60*60*1000;
										var dueDate = new Date(Date.parse(c.DueDate));
										var today = new Date();
										var diffDays = Math.round((dueDate.getTime() - today.getTime())/(oneDay));
										if (diffDays <= 0) {
											status = "danger";
											statusMessage = "due " + Math.abs(diffDays) + " ago!";
										}
										else if (diffDays < 7) {
											status = "warning";
											statusMessage = "due in " + diffDays + " days!";
										}
									}

									return (
										React.createElement("tr", {key: i}, 
											React.createElement("td", null, c.Title), 
											React.createElement("td", null, React.createElement(SPReact.UserPresence, {users: c.AssignedToId})), 
											React.createElement("td", null, 
												React.createElement(React_ProgressBar, {percentComplete: c.PercentComplete * 100, status: status}), 
												React.createElement("p", null, statusMessage)
											)
										)
									);
								})	
						)	
					)
				)
            );
		}
	});

	var MyTasksEdit = React.createClass({displayName: "MyTasksEdit",
		getInitialState: function() {
			return {
				listName: null,
				onSaveStatus: null
			};
		},
		getDefaultProps: function() {
			return {
				listName: null,
				onSave: function() {}
			};
		},
		componentWillReceiveProps: function(newProps) {
			this.setState({listName : newProps.listName});
		},
		render: function() {
			return (
				React.createElement("div", null, 
					React.createElement("div", {className: "row"}, 
						React.createElement("div", {className: "col-md-5"}, 
							React.createElement("input", {type: "text", className: "form-control", placeholder: "List name...", value: this.state.listName, onChange: this.onListNameChange})
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
		onListNameChange: function(event) {
			var value = event.target.value;
			this.setState({listName: value});
		},
		onSave: function() {
			this.props.onSave(this.state.listName, this.onSaveCallback.bind(this));
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

    var MyTasks = React.createClass({displayName: "MyTasks",
		getInitialState: function() {
			return {
				listName: null,
				listData: [],
				errorMessage: null,
				editMode: false,
				onSave: function() {}
			};
		},
        render: function() {
            return (
				React.createElement("div", {className: "container-fluid"}, 
					this.state.editMode ?
					React.createElement(MyTasksEdit, {listName: this.state.listName, onSave: this.state.onSave}) :
					React.createElement(MyTasksDisplay, {listName: this.state.listName, listData: this.state.listData, errorMessage: this.state.errorMessage})	
				)
            );
        }
    });

    (typeof exports !== 'undefined')
        && exports(MyTasks);

    return MyTasks;
})();