/* #Module.js
 * Module to manage and load other javascript modules. Exports global
 * module variable. Internal module class is exposed as `module.Module`
 *
 * ####exports
 * `var module = { Module: constructor() }`
 * 
 * **Usage**
 * ```
 * //loads module deployed to the same directory as module.js
 * module.require("other.js", function(other) {
 *   other.doStuff();
 * });
 * 
 * //defines a module without loading it. Module can later be loaded by name.
 * module.define({ name: "other", url: "/different/location/other.js" });
 * ```
 */

// module start
var module = (function () {

    var deferred;

    /*
     * ######processCallbackQueue: `function(queue, args)`
     * Call all methods in the passed array with the provided arguments
     *  
     * **Parameters**  
     * queue `Array` Array of callback methods  
     * args `Array` Argument array to pass to callback methods
     */
    function processCallbackQueue(queue, args) {
        while (queue.length > 0) {
            queue.pop().apply(null, args);
        }
    }

    /*
     * ######requestScript: `function(url, success, failure)`
     * Makes an HTTP request for a script file. Provides success
     * and failure callbacks.
     *
     * **Parameters**  
     * url `string` url Url of script file  
     * success `function(string)` Success callback  
     * failure `function(int)` Failure callback
     */
    function requestScript(url, success, failure) {
        var req = new XMLHttpRequest();
        req.onreadystatechange = function () {
            if (req.readyState === XMLHttpRequest.DONE) {
                if (req.status === 200) {
                    success(req.responseText);
                }
                else {
                    failure(req.status);
                }
            }
        }
        req.open("GET", url);
        req.send();
    }
     
    /**
     * ######executeModule: `function(body, parameters, aliases)`
     * Attemps to execute the javascript body with the provided
     * parameters/parameter names and return an exported object.
     *
     * **Parameters**  
     * body `String` String of javascript  
     * parameters `Array` Array of objects to be passed as parameters  
     * aliases `Array` Array of strings to be used as parameter names
     *  within the javascript block  
     * **Returns**  
     * `object` Value exported from the module
     */
    function executeModule(body, parameters, aliases) {
        body = "(function(" + aliases.join(",") + ") { " + body + "})";
        var externalModule = {};
        var func = eval(body);
        /*var externalModule = {};
        var allFunctionParameters = aliases.concat(["externalModule", body]);*/
        //var func = Function.apply(null, allFunctionParameters);
        var allParameters = parameters.concat(externalModule);
        func.apply(null, allParameters);
        return externalModule.exports;
    }

    function require(reference, alias) {
        return { reference: reference, alias: alias };
    }

    var requireRegex = /^\s*\/\/!\s*(require\([^\)]+\))/;
    var moduleRegex = /{\s*modulePlaceholder\s*:\s*(true|!0)\s*}/;
    var moduleReplace = "externalModule";

    function readModuleBody(body, requiredModules, moduleParameters) {
        if (!body.match(moduleRegex))
            throw "Unable to find module placeholder. Expecting: '{ modulePlaceholder : true }'";

        body = body.replace(moduleRegex, moduleReplace);

        var match = null;
        while (match = body.match(requireRegex)) {
            var module = eval(match[1]);
            requiredModules.push(module.reference);
            moduleParameters.push(module.alias || "none");
            body = body.replace(requireRegex, "");
        }

        return body;
    }

    function loadModule(self, module, callback) {
        module.state = moduleState.loading;
        if (module.url.match(/.css$/)) {
            var link = document.createElement("link");
            link.setAttribute("rel", "stylesheet");
            link.setAttribute("href", module.url);
            document.getElementsByTagName("head")[0].appendChild(link);
            module.state = moduleState.loaded;
            module.value = null;
            callback(module);
        }
        else {
            requestScript(module.url, function (body) {
                module.value = null;
                if (module.global) {
                    (1, eval)(body);
                    callback(module);
                }
                else {
                    var requiredModules = [];
                    var moduleParameters = [];
                    try {
                        body = readModuleBody(body, requiredModules, moduleParameters);
                    }
                    catch (err) {
                        throw "Error reading module '" + module.name + "' at '" + module.url + "' -- " + err;
                    }

                    requiredModules.push(function () {
                        var moduleValues = Array.prototype.slice.call(arguments);
                        module.value = executeModule(body, moduleValues, moduleParameters);
                        module.state = moduleState.loaded;
                        callback(module);
                    });
                    self.require.apply(self, requiredModules);
                }
            }, function (err) {
                throw "Unable to load module: '" + module.name + "' at: '" + module.url + "' -- " + err;
            });
        }
    }

    function findModule(moduleCache, name) {
        for (var x = 0; x < moduleCache.length && moduleCache[x].name !== name; x++) { }
        return moduleCache[x];
    }

    function defineModule(self, moduleReference, skipCheck) {
        if (!skipCheck && findModule(self._moduleCache, moduleReference.name))
            throw "Module with name: '" + moduleReference.name + "' is already defined";

        var module = {
            state: moduleState.defined,
            callbackQueue: [],
            name: moduleReference.name,
            url: moduleReference.url,
            global: moduleReference.global
        };
        self._moduleCache.unshift(module);
        return module;
    }

    function fillModuleReference(mod, defaultUrl) {
        if (typeof mod === "string")
            mod = { name: mod, url: defaultUrl + mod };
        else if (mod.url) {
            mod.name = mod.name || mod.url.substring(mod.url.lastIndexOf("/") + 1);
        }
        return mod;
    }

    function getModule(self, moduleReference, callback) {
        moduleReference = fillModuleReference(moduleReference, self.defaultUrl);
        var module = findModule(self._moduleCache, moduleReference.name) ||
            defineModule(self, moduleReference);

        if (module.state === moduleState.loaded)
            callback(module);
        else {
            module.callbackQueue.push(callback);
            if (module.state === moduleState.defined) {
                loadModule(self, module, function (module) {
                    processCallbackQueue(module.callbackQueue, [module]);
                });
            }
        }
    }

    function getModuleValue(self, moduleReference, callback) {
        getModule(self, moduleReference, function (module) {
            callback(module.value);
        });
    }

    function requireModules(self, moduleReferences, callback) {
        var values = [];
        var promises = moduleReferences.map(function (c, i) {
            var def = new deferred();
            getModuleValue(self, c, function (value) {
                values[i] = value;
                def.resolve(value);
            });
            return def.promise();
        });

        deferred.all(promises).done(function () {
            if (callback)
                callback.apply(null, values);
        });
    }

    var state = {
        pending: 0,
        ready: 1
    }

    var moduleState = {
        defined: 0,
        loading: 1,
        loaded: 2,
        error: 3
    }

    function initModule(self) {
        var scriptTag = document.querySelector("script[src$='/module.js']");
        var baseUrl = scriptTag.src.replace("module.js", "");
        self._defaultUrl = baseUrl;
        getModuleValue(self, "deferred.js", function (val) {
            self._state = state.ready;
            deferred = val;
            processCallbackQueue(self._onreadyQueue);
        });
    }

    

    /** 
     * ##Class
     * #####Module: `constructor(options)`
     * Class providing functionality to load, cache and manage
     * JavaScript modules
     * 
     * **Parameters**  
     * **`options`** `object` Options variable (unused)
     */
    function Module(options) {
        this._state = state.pending;
        this._onreadyQueue = [];
        this._moduleCache = [];
        this._options = options || {};
        this._defaultUrl = null;

        initModule(this);
    }

    Module.prototype = {
        // ######defaultUrl: `get()`
        // **Returns**  
        // `string` Default module path
        get defaultUrl() {
            return this._defaultUrl;
        },
        // ######onready: `set(function())`
        // Set onready callback. Callbacks fire after module object finishes initializing.
        set onready(val) {
            this._onreadyQueue.unshift(val);
            if (this._state === state.ready)
                processCallbackQueue(this._onreadyQueue);
        },
        // ######define: `function(...moduleReferences)`  
        // Predefine a module
        //
        // **Parameters**  
        // **`...moduleReference`** `string|{name:string, url:string}` pass one to many 
        // filenames or moduleReference objects
        define: function () {
            var self = this;
            var modules = Array.prototype.slice.call(arguments);
            this.onready = function () {
                for (var x = 0; x < modules.length; x++) {
                    var moduleReference = fillModuleReference(modules[x], self.defaultUrl);
                    defineModule(self, moduleReference);
                }
            }
        },
        // ######require: `function(...moduleReferences, function(...modules))`
        // Load specified modules
        //
        // **Parameters**  
        // **`...moduleReference`** `string|{name:string, url:string}`   
        // One to many filename or moduleReference objects  
        // **`callback`** `function(...values)`  
        // Callback method that receives export values from required modules
        require: function () {
            var self = this;
            var args = Array.prototype.slice.call(arguments);
            var callback = args.splice(args.length - 1)[0];
            if (args.length === 0)
                callback();
            else {
                this.onready = function () {
                    requireModules(self, args, callback);
                }
            }
        }
    } 

    var ret = new Module();
    ret.Module = Module;
    return ret;
})();