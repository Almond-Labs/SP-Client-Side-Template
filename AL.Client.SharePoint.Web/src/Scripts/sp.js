//! require("deferred.js", "deferred")
//! require("ajax.js", "ajax")
var sp = (function () {
    var sp = {
        loadScripts: function (scripts) {
            scripts = Array.isArray(scripts) ? scripts : [scripts];
            var def = new deferred();

            sp.context.webServerRelativeUrl.done(function (url) {
                for (var x = 0; x < scripts.length; x++) {
                    if (!_v_dictSod[scripts[x]]) {
                        SP.SOD.registerSod(scripts[x], url + '/_layouts/15/' + scripts[x]);
                    }
                }

                var promises = scripts.map(function(c) {
                	var scriptDef = new deferred();
                	SP.SOD.loadMultiple([c], function() {
                		scriptDef.resolve();
                	});
                	return scriptDef.promise();
                });

                deferred.all(promises).done(def.resolve.bind(def));
            });

            return def.promise();
        },
        getJSON: function (url) {
            return ajax.getJSON(url, "application/json; odata=verbose");
        },
        postJSON: function (url, data, digest) {
            data = data || {};
            var def = new deferred();
            if (!digest) {
                sp.context.digest.done(function (value) {
                    sp.postJSON(url, data, value)
                        .done(def.resolve.bind(def))
                        .fail(def.reject.bind(def));
                });
            }
            else {
                ajax.postJSON(url, data, "application/json; odata=verbose", {
                    "X-RequestDigest": digest,
                    "Content-Type": "application/json; odata=verbose"
                }).done(def.resolve.bind(def))
                  .fail(def.reject.bind(def));
            }
            return def.promise();
        },
        context: {
            pageInfo: function (property) {
                var def = new deferred();
                if (!_spPageContextInfo) {
                    sp.loadScripts("sp.js").done(function () {
                        var val = property ? _spPageContextInfo[property] : _spPageContextInfo;
                        def.resolve(val);
                    });
                }
                else {
                    var val = property ? _spPageContextInfo[property] : _spPageContextInfo;
                    def.resolve(val);
                }
                return def.promise();
            },
            get webServerRelativeUrl() {
                var def = new deferred();
                sp.context.pageInfo("webServerRelativeUrl").done(function (val) {
                    val = val.replace(/\/$/, "");
                    def.resolve(val);
                });
                return def.promise();
            },
            get digest() {
                var def = new deferred();
                sp.context.webServerRelativeUrl.done(function (url) {
                    sp.postJSON(url + "/_api/contextinfo", {}, "temp").done(function (data) {
                        def.resolve(data.d.GetContextWebInformation.FormDigestValue);
                    });
                });
                return def.promise();
            }
        },
        user: {
            getById: function(userId) {
                var def = new deferred();
                sp.context.webServerRelativeUrl.done(function (url) {
                    sp.getJSON(url + "/_api/web/GetUserById(" + userId + ")")
                        .done(def.resolve.bind(def))
                        .fail(def.resolve.bind(def));
                });
                return def.promise();
            },
        },
        csom: {
            webparts: {
                getProperties: function (wpId) {
                    var def = new deferred();

                    var clientContext = SP.ClientContext.get_current();
                    var oFile = clientContext.get_web()
                        .getFileByServerRelativeUrl(_spPageContextInfo.serverRequestPath);
                    var limitedWebPartManager =
                        oFile.getLimitedWebPartManager(SP.WebParts.PersonalizationScope.shared);
                    var collWebPart = limitedWebPartManager.get_webParts();

                    clientContext.load(collWebPart);
                    clientContext.executeQueryAsync(function () {
                        var webPartDef = null;
                        for (var x = 0; x < collWebPart.get_count() && !webPartDef; x++) {
                            var temp = collWebPart.get_item(x);
                            if (temp.get_id().toString() === wpId) {
                                webPartDef = temp;
                            }
                        }
                        if (!webPartDef) {
                            def.reject("Web Part: " + wpId + " not found on page: "
                                + _spPageContextInfo.webServerRelativeUrl);
                            return;
                        }
                        var webPartProperties = webPartDef.get_webPart().get_properties();
                        clientContext.load(webPartProperties);
                        clientContext.executeQueryAsync(function () {
                            def.resolve(webPartProperties, webPartDef, clientContext);
                        }, function () {
                            def.reject("Failed to load web part properties");
                        });
                    }, function () {
                        def.reject("Failed to load web part collection");
                    });

                    return def.promise();
                },
                saveProperties: function (wpId, obj) {
                    var def = new deferred();

                    sp.csom.webparts.getProperties(wpId).done(function (webPartProperties, webPartDef, clientContext) {
                        for (var key in obj) {
                            webPartProperties.set_item(key, obj[key]);
                        }
                        webPartDef.saveWebPartChanges();
                        clientContext.executeQueryAsync(function () {
                            def.resolve();
                        }, function () {
                            def.reject("Failed to save web part properties");
                        });
                    }).fail(def.reject.bind(def));

                    return def.promise();
                },
                updateProperties: function (wpId, processProperties) {
                    var def = new deferred();
                    sp.csom.webparts.getProperties(wpId).done(function (webPartProperties) {
                        var obj = processProperties(webPartProperties.get_fieldValues());
                        sp.csom.webparts.saveProperties(wpId, obj)
                            .done(def.resolve.bind(def))
                            .fail(def.reject.bind(def));
                    }).fail(def.reject.bind(def));
                    return def.promise();
                }
            },
            user: {
                profileProperties: function (userName, profileProperties) {
                    var def = new deferred();
                    /*console.log("params");
                    console.debug(arguments);*/

                    if (userName === parseInt(userName)) {
                        sp.user.getById(userName).done(function (user) {
                            //console.debug(user);
                            sp.csom.user.profileProperties(user.d.LoginName, profileProperties)
                                .done(def.resolve.bind(def))
                                .fail(def.reject.bind(def));
                        }).fail(function () {
                            def.reject("Error encountered resolving user with Id: " + userName);
                        });
                    }
                    else {
                        sp.loadScripts(["sp.js", "SP.UserProfiles.js"]).done(function () {
                            var clientContext = SP.ClientContext.get_current();
                            //console.log("username: " + userName);
                            var userProfilePropertiesForUser = new SP.UserProfiles.UserProfilePropertiesForUser(clientContext, userName, profileProperties);
                            var peopleManager = new SP.UserProfiles.PeopleManager(clientContext);
                            var userProps = peopleManager.getUserProfilePropertiesFor(userProfilePropertiesForUser);
                            clientContext.load(userProfilePropertiesForUser);
                            //console.log("before eqas");
                            clientContext.executeQueryAsync(function () {
                                //console.log("after eqas");
                                var properties = {};
                                for (var x = 0; x < profileProperties.length; x++) {
                                    properties[profileProperties[x]] = userProps[x];
                                }
                                def.resolve(properties);
                            }, function () {
                                def.reject("Unable to load profile for user: " + userName + " -- Properties: " + profileProperties.join(", "));
                            });
                        });
                    }

                    return def.promise();
                },
                renderUserPresence: function (userName, schemaOverride) {
                    schemaOverride = schemaOverride || { "WithPictureDetail": "1", "PictureSize": "Size_36px" };
                    var def = new deferred();

                    var properties = ["PreferredName", "PictureURL", "AccountName", "Title", "WorkEmail", "SipAddress"];
                    sp.csom.user.profileProperties(userName, properties).done(function (user) {
                        var renderCtx = new ContextInfo();
                        renderCtx.Templates = {};
                        renderCtx.Templates["Fields"] = {};

                        var listSchema = { "EffectivePresenceEnabled": "1", "PresenceAlt": "User Presence" };
                        var userData = {
                            "id": user.AccountName, "department": user.Role, "jobTitle": user.Title,
                            "title": user.PreferredName, "email": user.WorkEmail, "picture": user.PictureURL, "sip": user.SipAddress
                        };
                        sp.loadScripts("clienttemplates.js").done(function () {
                            var html = RenderUserFieldWorker(renderCtx, schemaOverride, userData, listSchema);
                            def.resolve(html);
                        });
                    });

                    return def.promise();
                }
            }
        },
        page: {
            get inEditMode() {
                var inEditMode = null;
                if (document.forms[MSOWebPartPageFormName].MSOLayout_InDesignMode) {
                    inEditMode = document.forms[MSOWebPartPageFormName].MSOLayout_InDesignMode.value == "1";
                }
                var wikiInEditMode = null;
                if (document.forms[MSOWebPartPageFormName]._wikiPageMode) {
                    wikiInEditMode = document.forms[MSOWebPartPageFormName]._wikiPageMode.value == "Edit";
                }

                return !!(inEditMode || wikiInEditMode);
            }
        }
    }

    var module = { modulePlaceholder: true };
    return module.exports = sp;
})();