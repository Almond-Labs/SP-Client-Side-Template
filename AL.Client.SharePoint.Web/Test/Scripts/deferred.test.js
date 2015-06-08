describe("DEFERRED.js", function () {
    var def;
    var prom;
    beforeEach(function () {
        def = new deferred();
        prom = def.promise();
    });

    it("promise success", function (done) {
        prom.done(function (val) {
            assert(val.prop === "value");
            done();
        }).fail(function (val) {
            assert(false);
        });

        setTimeout(function () {
            def.resolve({ prop: "value" });
        }, 10);
    });

    it("promise fail", function (done) {
        prom.done(function (val) {
            assert(false);
        }).fail(function (val) {
            assert(val.prop === "value");
            done();
        });

        setTimeout(function () {
            def.reject({ prop: "value" });
        }, 10);
    });

    it("multiple callbacks", function (done) {
        var count = 0;
        function callback(val) {
            assert(val.prop === "value");
            count++;
            if (count === 2)
                done();
        }

        prom.done(callback);
        prom.done(callback);

        setTimeout(function () {
            def.resolve({ prop: "value" });
        }, 10);
    });

    it("callback post resolve", function (done) {
        var count = 0;

        setTimeout(function () {
            def.resolve({ prop: "value" });
            prom.done(function (val) {
                assert(val.prop === "value");
                done();
            });
        }, 10);
    });

    it("deferred.all success", function (done) {
        var def1 = new deferred();
        var def2 = new deferred();
        var def3 = new deferred();

        deferred.all([def1.promise(), def2.promise(), def3.promise()]).done(function () {
            done();
        }).fail(function () {
            assert(false);
        });

        setTimeout(def1.resolve.bind(def1), 400);
        setTimeout(def2.resolve.bind(def2), 10);
        setTimeout(def3.resolve.bind(def3), 10);
    });

    it("nested promises", function (done) {
        var def1 = new deferred();
        var prom1 = def1.promise();
        prom1.done(function (val) {
            assert(val.prop === "nested");
            done();
        });

        setTimeout(function () {
            var def2 = new deferred();
            var prom2 = def2.promise();
            
            def1.resolve(prom2);

            setTimeout(function () {
                def2.resolve({ prop: "nested" });
            }, 100);
        }, 100);
    });
});