//! require("React_ProgressBar.js", "React_ProgressBar")
//! require('bootstrap')
var ProgressBar = (function () {
    
    function ProgressBar() {
        this._div = document.createElement("div");
        this._div.className = "AL";
        this._component = React.render(React.createElement(React_ProgressBar), this._div);
    }

    ProgressBar.prototype = {
        set percentComplete(val) {
            this._component.setState({ percentComplete: val });
        },
        set status(val) {
            this._component.setState({ status: val });
        },
        render: function (element) {
            element.appendChild(this._div);
        }
    };

    (typeof exports !== 'undefined')
        && exports(ProgressBar);

    return ProgressBar;
})();