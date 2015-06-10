var dom = (function () {

    function dom(element) {
        return new Dom(element);
    }

    dom.selectAll = document.querySelectorAll.bind(document);
    dom.select = document.querySelector.bind(document);

    function Dom(element) {
        this._element = element;
    }

    Dom.prototype = {
        parents: function (selector) {
            var parents = [];
            var foundElements = dom.selectAll(selector);
            for (var x = 0; x < foundElements.length; x++) {
                if (foundElements[x].contains(this._element))
                    parents.push(foundElements[x]);
            }
            return parents;
        },
        parent: function (selector) {
            var parent = null
            var foundElements = dom.selectAll(selector);
            for (var x = 0; x < foundElements.length && !parent; x++) {
                if (foundElements[x].contains(this._element))
                    parent = foundElements[x];
            }
            return parent;
        }
    };

    (typeof exports !== 'undefined')
        && exports(dom);

    return dom;
})();