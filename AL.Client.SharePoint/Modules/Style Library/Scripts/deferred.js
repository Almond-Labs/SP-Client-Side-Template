var deferred=function(){function a(a,b){for(;a.length>0;){var c=a.pop();c.apply(null,b)}}function b(a,d,e){return e=e||[],d=d||new c,a.length>0?a[0].done(function(){var c=Array.prototype.slice.call(arguments);e.push(c),b(a.slice(1),d,e)}).fail(function(){d.reject.apply(d,arguments)}):d.resolve.apply(d,e),d.promise()}function c(){this.state=d.pending,this.successQueue=[],this.failureQueue=[],this.value=null}var d={pending:0,fulfilled:1,rejected:2};c.all=function(a){return b(Array.prototype.slice.call(a))},c.prototype={resolve:function(){if(this.state!==d.pending)throw"Deferred already resolved/rejected";return 1===arguments.length&&arguments[0]&&arguments[0].isPromise?void arguments[0].done(this.resolve.bind(this)):(this.value=arguments,a(this.successQueue,this.value),void(this.state=d.fulfilled))},reject:function(){if(this.state!==d.pending)throw"Deferred already resolved/rejected";this.value=arguments,a(this.failureQueue,this.value),this.state=d.rejected},promise:function(){return{isPromise:!0,done:this.done.bind(this),fail:this.fail.bind(this)}},done:function(b){return this.successQueue.unshift(b),this.state===d.fulfilled&&a(this.successQueue,this.value),this.promise()},fail:function(b){return this.failureQueue.unshift(b),this.state===d.rejected&&a(this.failureQueue,this.value),this.promise()}};var e={modulePlaceholder:!0};return e.exports=c}();