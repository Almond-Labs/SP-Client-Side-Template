var fs = require('fs');

var body = fs.readFileSync("./src/Styles/bootstrap.css", "utf8");

var selectorRegex = /\s*[^{}/]+?\{/g
var filterRegex = [/@media/i];
var prefix = ".bootstrap ";

var output = [];

var parts = body.split(selectorRegex);
var matches = body.match(selectorRegex);
/*console.log(parts.length);
console.log(parts[0]);
console.log(matches.length);
console.log(matches[0]);*/

var x = 0;
for ( ; x < matches.length; x++) {
    var part = parts[x];
    var match = matches[x];
    output.push(part);
    var y = 0;
    for (; y < filterRegex.length && !match.match(filterRegex[y]) ; y++) { }
    if (y >= filterRegex.length) {
        var selectorParts = match.split(",");
        selectorParts = selectorParts.map(function (c) {
            return prefix + c;
        });
        var newSelector = selectorParts.join(", ");
        output.push(newSelector);
    }
    else {
        output.push(match);
    }
}
output.push(parts[x]);

var outFile = output.join("\r\n");
fs.writeFileSync("./src/Styles/prefixed.boostrap.css", outFile, "utf8");


