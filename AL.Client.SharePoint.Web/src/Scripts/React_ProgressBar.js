//! require('react')
var React_ProgressBar = (function () {

    var ProgressBar = React.createClass({displayName: "ProgressBar",
		getDefaultProps: function() {
			return {
				percentComplete: 0,
				status: "info"
			};
		},
		getInitialState: function() {
			return {
				percentComplete: this.props.percentComplete,
				status: this.props.status
			};
		},
        render: function() {
			var progressStatus = "progress-bar-" + this.state.status;
            return (
				React.createElement("div", {className: "progress"}, 
					React.createElement("div", {className: "progress-bar " + progressStatus, style: { width: this.state.percentComplete + "%"}}, 
						this.state.percentComplete, "%"
					)
				)
            );
        }
    });

    (typeof exports !== 'undefined')
        && exports(ProgressBar);

    return ProgressBar;
})();