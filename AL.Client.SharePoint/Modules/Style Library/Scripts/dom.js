var dom=function(){function a(a){return new b(a)}function b(a){this._element=a}a.selectAll=document.querySelectorAll.bind(document),a.select=document.querySelector.bind(document),b.prototype={parents:function(b){for(var c=[],d=a.selectAll(b),e=0;e<d.length;e++)d[e].contains(this._element)&&c.push(d[e]);return c},parent:function(b){for(var c=null,d=a.selectAll(b),e=0;e<d.length&&!c;e++)d[e].contains(this._element)&&(c=d[e]);return c}};var c={modulePlaceholder:!0};return c.exports=a}();