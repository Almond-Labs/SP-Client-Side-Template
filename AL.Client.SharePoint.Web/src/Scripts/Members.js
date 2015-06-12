//! require("React_Members.js", "React_Members")
//! require('bootstrap')
//! require('sp.js', 'sp')
//! require('dom')
var Members = (function () {
    function Members() {
        this._div = document.createElement("div");
        this._div.className = "AL";
        this._component = React.render(React.createElement(React_Members), this._div);
        this._component.setState({ onSave: this.onSave.bind(this), editMode: sp.page.inEditMode });
    }

    Members.prototype = {
        set users(val) {
            this._component.setState({ users: val });
        },
        render: function (element) {
            element.appendChild(this._div);
        },
        onSave: function (users, callback) {
            var parent = dom(this._div).parent("[webpartid]");
            var wpId = parent.getAttribute("webpartid");
            sp.csom.webparts.updateProperties(wpId, function (currentProperties) {
                var content = currentProperties.Content;
                var optionsRegex = /(var\s*options\s*=\s*)({[^}]*})/;
                var matches = content.match(optionsRegex);
                var options = JSON.parse(matches[2]);
                options.users = users;
                var newOptions = matches[1] + JSON.stringify(options);
                content = content.replace(optionsRegex, newOptions);
                return { Content: content };
            }).done(callback).fail(callback);
        }
    };

    (typeof exports !== 'undefined')
        && exports(Members);

    return Members;
})();