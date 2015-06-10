//! require('react')
//! require('SPReact.js', 'SPReact')
var React_MyTasks = (function () {

	var MyTasksDisplay = React.createClass({
		getInitialState: function() {
			return {
				listName: null,
				listData: [],
				errorMessage: null
			};
		},
		getDefaultProps: function() {
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
				<div className="panel panel-primary">
					<div className="panel-heading">
						<h3 className="panel-title">{this.state.listName}</h3>
					</div>
					<div className="panel-body">
					{	this.state.errorMessage ?
						<div className="alert alert-danger">{this.state.errorMessage}</div> :
						null	}
					{	this.state.listData.length === 0 ?
						<div className="alert alert-info">No list data</div> :
						<table className="table">
							<tr>
								<th>Title</th>
								<th>Assigned To</th>
							</tr>
							{	this.state.listData.map(function(c, i) {
									return (
										<tr key={i}>
											<td>{c.Title}</td>
											<td><SPReact.User users={c.AssignedToId} /></td>
										</tr>
									);
								})	}
						</table>	}
					</div>
				</div>
            );
		}
	});

	var MyTasksEdit = React.createClass({
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
				<div>
					<div className="row">
						<div className="col-md-5">
							<input type="text" className="form-control" placeholder="List name..." value={this.state.listName} onChange={this.onListNameChange} />
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

    var MyTasks = React.createClass({
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
				<div className="container-fluid">
				{	this.state.editMode ?
					<MyTasksEdit listName={this.state.listName} onSave={this.state.onSave} /> :
					<MyTasksDisplay listName={this.state.listName} listData={this.state.listData} errorMessage={this.state.errorMessage} />	}
				</div>
            );
        }
    });

    (typeof exports !== 'undefined')
        && exports(MyTasks);

    return MyTasks;
})();