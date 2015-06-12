describe("TESTING REACT", function () {
    var mod = null;
    var baseUrl = "/src/Scripts";
    beforeEach(function () {
        mod = new module.Module();
        mod.define({ url: "/src/References/react.js", name: "react", global: true });
        mod.define({ url: "/src/Styles/AL.bootstrap.css", name: "bootstrap" });
        mod.defaultUrl = baseUrl;
    });

    it("basic rendering", function (done) {
        mod.require("React_MyTasks.js", function (MyTasks) {
            var div = document.createElement("div");
            React.render(React.createElement(MyTasks), div);
            console.log(div.innerHTML);
            done();
        });
    });

    /*it("wrapper object rendering", function (done) {
        //mod.scope(function (callback) {
            mod.require("MyTasks.js", function (myTasks) {
                var div = document.createElement("div");
                div.id = "MyTasks";
                document.getElementsByTagName("body")[0].appendChild(div);
                var mt = new myTasks();
                mt.name = "bob";
                mt.render(div);
                //callback();
                done();
            });
        //});
    });*/
});