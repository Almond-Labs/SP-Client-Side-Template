//! require('react')
var React_ProgressBar = (function () {

    var ProgressBar = React.createClass({
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
				<div className="progress">
					<div className={"progress-bar " + progressStatus} style={{ width: this.state.percentComplete + "%" }}>
						{this.state.percentComplete}%
					</div>
				</div>
            );
        }
    });

    (typeof exports !== 'undefined')
        && exports(ProgressBar);

    return ProgressBar;
})();