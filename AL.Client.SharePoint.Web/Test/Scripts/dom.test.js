describe("TESTING DOM", function () {

    it("selecting element", function () {
        var elem = dom.select("body");
        assert(elem != null);
    });

    it("selecting elements", function () {
        var elems = dom.selectAll("div");
        assert(elems.length > 0);
    });

    it("getting parents", function () {
        var elem = dom.select("div");
        var parents = dom(elem).parents("body");
        assert(parents.length > 0);
    });
});