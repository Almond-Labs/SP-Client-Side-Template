//! require("deferred.js", "deferred")
var ajax=function(){function a(a){if(!a.method)throw"options.method property is required";if(!a.url)throw"options.url property is required";var b=new XMLHttpRequest;b.open(a.method,a.url);for(var c in a.headers)b.setRequestHeader(c,a.headers[c]);var d=new deferred;return b.onreadystatechange=function(){b.readyState===XMLHttpRequest.DONE&&(200===b.status?d.resolve(b.responseText):d.reject(b.status))},b.send(a.data),d.promise()}a.get=function(b,c){return c.Accept=c.Accept||"text/plain",a({url:b,method:"GET",headers:c})},a.getJSON=function(b,c,d){d=d||{};var e=new deferred;return d.Accept=c||"application/json",a.get(b,d).done(function(a){var b=JSON.parse(a);e.resolve(b)}).fail(e.reject.bind(e)),e.promise()},a.post=function(b,c,d){return d=d||{},d["Content-Type"]=d["Content-Type"]||"application/x-www-form-urlencoded",a({url:b,method:"POST",data:c,headers:d})},a.postJSON=function(b,c,d,e){c=c||{},e=e||{};var f=new deferred;return e["Content-Type"]=e["Content-Type"]||"application/json",e.Accept=d||"application/json",a.post(b,JSON.stringify(c),e).done(function(a){var b=JSON.parse(a);f.resolve(b)}).fail(f.reject.bind(f)),f.promise()};var b={modulePlaceholder:!0};return b.exports=a}();