(function () {
    var fieldName = "PercentComplete";
    AL.registerJSLinkField(fieldName, {
        View: function (ctx) {
            return AL.renderJSLinkField("ProgressBar.js", {
                percentComplete: parseInt(ctx.CurrentItem.PercentComplete.replace("%", ""))
            });
        }
    });
})();