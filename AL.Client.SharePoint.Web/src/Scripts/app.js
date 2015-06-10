module.define({ name: "react", url: module.defaultUrl + "../References/react.min.js", global: true });
module.define({ name: "bootstrap", url: module.defaultUrl + "../Styles/AL.bootstrap.css", global: true });

var AL = (function () {
    var clientControlId = 0;

    return {
        format: function() {
            var args = Array.prototype.slice.call(arguments);
            var baseString = args.splice(0, 1)[0];
            for (var x = 0; x < args.length; x++) {
                baseString = baseString.replace("{" + x + "}", args[x]);
            }
            return baseString;
        },
        renderClientControl: function(moduleFilename, elementId, options) {
            module.require(moduleFilename, function(constructor) {
                var ctrl = new constructor();
                ctrl.render(document.getElementById(elementId));
                for (var key in options) {
                    ctrl[key] = options[key];
                }
            });
        },
        renderClientWebPart: function (moduleFilename, options) {
            var elemId = "ClientWebPart_" + clientControlId++;
            document.write(AL.format("<div id='{0}'></div>", elemId))
            AL.renderClientControl(moduleFilename, elemId, options);
        },
        renderJSLinkField: function (moduleFilename, options) {
            var elemId = "JSLinkControl_" + clientControlId++;

            setTimeout(function () {
                AL.renderClientControl(moduleFilename, elemId, options);
            }, 0);

            return AL.format("<div id='{0}'></div>", elemId);
        },
        registerJSLinkField: function (fieldName, viewOverrides) {
            var fieldCtx = {};
            fieldCtx.Templates = {};
            fieldCtx.Templates.Fields = {};
            fieldCtx.Templates.Fields[fieldName] = viewOverrides;

            SPClientTemplates.TemplateManager.RegisterTemplateOverrides(fieldCtx);
        }
    };

})();