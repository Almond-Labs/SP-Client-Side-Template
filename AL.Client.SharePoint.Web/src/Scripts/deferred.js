var deferred = (function () {

    var state = {
        pending: 0,
        fulfilled: 1,
        rejected: 2
    };

    function processCallbackQueue(queue, arguments) {
        while (queue.length > 0) {
            var callback = queue.pop();
            callback.apply(null, arguments);
        }
    }

    function waitForPromises(arr, def, result) {
        result = result || [];
        def = def || new Deferred();

        if (arr.length > 0) {
            arr[0].done(function () {
                var values = Array.prototype.slice.call(arguments);
                result.push(values);
                waitForPromises(arr.slice(1), def, result);
            }).fail(function () {
                def.reject.apply(def, arguments);
            });
        }
        else {
            def.resolve.apply(def, result);
        }

        return def.promise();
    }

    function Deferred() {
        this.state = state.pending;
        this.successQueue = [];
        this.failureQueue = [];
        this.value = null;
    }

    Deferred.all = function (promiseArray) {
        return waitForPromises(Array.prototype.slice.call(promiseArray));
    };

    Deferred.prototype = {
        resolve: function () {
            if (this.state === state.pending) {
                if (arguments.length === 1 && arguments[0] && arguments[0].isPromise) {
                    arguments[0].done(this.resolve.bind(this));
                    return;
                }
                this.value = arguments;
                processCallbackQueue(this.successQueue, this.value);
                this.state = state.fulfilled;
            }
            else {
                throw "Deferred already resolved/rejected";
            }
        },
        reject: function () {
            if (this.state === state.pending) {
                this.value = arguments;
                processCallbackQueue(this.failureQueue, this.value);
                this.state = state.rejected;
            }
            else {
                throw "Deferred already resolved/rejected";
            }
        },
        promise: function () {
            return {
                isPromise: true,
                done: this.done.bind(this),
                fail: this.fail.bind(this)
            };
        },
        done: function (callback) {
            this.successQueue.unshift(callback);
            if (this.state === state.fulfilled)
                processCallbackQueue(this.successQueue, this.value);

            return this.promise();
        },
        fail: function (callback) {
            this.failureQueue.unshift(callback);
            if (this.state === state.rejected)
                processCallbackQueue(this.failureQueue, this.value);

            return this.promise();
        }
    };

    (typeof exports !== 'undefined')
        && exports(Deferred);

    return Deferred;
})();