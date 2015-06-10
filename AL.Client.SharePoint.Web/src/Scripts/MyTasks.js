//! require("React_MyTasks.js", "React_MyTasks")
//! require('bootstrap')
//! require('sp.js', 'sp')
var MyTasks = (function () {
    /* MyTasks class wraps react template to show tasks assigned to the
    current user

    - Tags: ['Class']
    - Name: 'MyTasks'
    - Example: 
"var div = document.getElementById('myTasksDiv');
var myTasks = new MyTasks();
myTasks.render(div);"
    */

    /* - Tags: ["Constructor"] */
    function MyTasks() {
        this._div = document.createElement("div");
        this._div.className = "AL";
        this._component = React.render(React.createElement(React_MyTasks), this._div);
        this._component.setState({ onSave: this.onSave.bind(this), editMode: sp.page.inEditMode });
    }

    MyTasks.prototype = {
        /* */
        set listName(val) {
            var self = this;
            this._component.setState({ listName: val }, function () {
                sp.context.webServerRelativeUrl.done(function (url) {
                    sp.getJSON(url + "/_api/web/lists/GetByTitle('" + val + "')/Items").done(function (result) {
                        self._component.setState({ listData: result.d.results });
                    }).fail(function () {
                        self._component.setState({ errorMessage: "Error encountered requesting list data" });
                    });
                });
            });
        },
        /* Append MyTasks to the passed element
        - Parameters:
          [{ name: 'element',
             type: 'DOMElement',
             description: 'Element to append component to' }]
        */
        render: function (element) {
            element.appendChild(this._div);
        },
        onSave: function (listName, callback) {
            var parent = dom(this._div).parent("[webpartid]");
            var wpId = parent.getAttribute("webpartid");
            sp.csom.webparts.updateProperties(wpId, function (currentProperties) {
                var content = currentProperties.Content;
                var optionsRegex = /(var\s*options\s*=\s*)({[^}]*})/;
                var matches = content.match(optionsRegex);
                var options = JSON.parse(matches[2]);
                options.listName = listName;
                var newOptions = matches[1] + JSON.stringify(options);
                content = content.replace(optionsRegex, newOptions);
                return { Content: content };
            }).done(callback).fail(callback);
        }
    };

    /* export MyTasks constructor */
    (typeof exports !== 'undefined')
        && exports(MyTasks);

    return MyTasks;
})();