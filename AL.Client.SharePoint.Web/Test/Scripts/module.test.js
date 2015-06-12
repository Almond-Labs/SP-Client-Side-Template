describe("MODULE.js", function () {
    var mod = module;
    var baseUrl = "/src/Scripts";
    //mod.baseUrl = baseUrl;
    beforeEach(function () {
        mod = new module.Module({ defaultUrl: baseUrl });
        //mod.define({ url: "/src/scripts/refs/react.min.js", name: "react" });
    });

    it("load/init module.js", function (done) {
        mod.onready = function () {
            done();
        }
    });

    it("load ajax module", function (done) {
        mod.require("ajax.js", function (ajax) {
            done();
        });
    });

    it("load ajax module twice", function (done) {
        mod.require("ajax.js", function (ajax) {
            ajax.addedProp = true;
            mod.require("ajax.js", function (ajax) {
                assert(ajax.addedProp)
                done();
            });
        });
    });

    it("load ajax module by name", function (done) {
        mod.require("ajax", function (ajax) {
            assert(ajax);
            done();
        });
    });

    it("load ajax module by url", function (done) {
        mod.require({ url: "/src/Scripts/ajax.js" }, function (ajax) {
            done();
        });
    });

    it("load multiple modules", function (done) {
        mod.require("ajax.js", "dom.js", function (ajax, dom) {
            assert(ajax && dom);
            done();
        });
    });

    it("load global module, react.js", function (done) {
        mod.define({ name: "react", url: "/src/references/react.min.js", global: true });
        mod.require("react", function () {
            assert(React);
            done();
        });
    });

    it("load global module twice, react.js", function (done) {
        var count = 0;
        mod.define({ name: "react", url: "/src/references/react.min.js", global: true });
        mod.require("react", function () {
            assert(React);
            count++;
            if (count === 2)
                done();
        });

        mod.require("react", function () {
            assert(React);
            count++;
            if (count === 2)
                done();
        });
    });

    it("load css file bootstrap.css", function (done) {
        mod.require({ url: mod.defaultUrl + "../Styles/bootstrap.css" }, function () {
            done();
        });
    })
});