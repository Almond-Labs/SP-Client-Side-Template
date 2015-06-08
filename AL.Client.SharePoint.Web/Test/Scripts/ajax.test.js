describe("TESTING AJAX", function () {

    it("direct ajax GET", function (done) {
        ajax({
            method: "GET",
            url: "/src/Scripts/ajax.js"
        }).done(function (data) {
            //console.log(data);
            done();
        });
    });

});