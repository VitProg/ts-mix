(function webpackUniversalModuleDefinition(root, factory) {
    if (typeof exports === "object" && typeof module === "object") module.exports = factory(); else if (typeof define === "function" && define.amd) define([], factory); else if (typeof exports === "object") exports["ts-mix"] = factory(); else root["ts-mix"] = factory();
})(window, function() {
    return function(modules) {
        var installedModules = {};
        function __webpack_require__(moduleId) {
            if (installedModules[moduleId]) {
                return installedModules[moduleId].exports;
            }
            var module = installedModules[moduleId] = {
                i: moduleId,
                l: false,
                exports: {}
            };
            modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
            module.l = true;
            return module.exports;
        }
        __webpack_require__.m = modules;
        __webpack_require__.c = installedModules;
        __webpack_require__.d = function(exports, name, getter) {
            if (!__webpack_require__.o(exports, name)) {
                Object.defineProperty(exports, name, {
                    enumerable: true,
                    get: getter
                });
            }
        };
        __webpack_require__.r = function(exports) {
            if (typeof Symbol !== "undefined" && Symbol.toStringTag) {
                Object.defineProperty(exports, Symbol.toStringTag, {
                    value: "Module"
                });
            }
            Object.defineProperty(exports, "__esModule", {
                value: true
            });
        };
        __webpack_require__.t = function(value, mode) {
            if (mode & 1) value = __webpack_require__(value);
            if (mode & 8) return value;
            if (mode & 4 && typeof value === "object" && value && value.__esModule) return value;
            var ns = Object.create(null);
            __webpack_require__.r(ns);
            Object.defineProperty(ns, "default", {
                enumerable: true,
                value: value
            });
            if (mode & 2 && typeof value != "string") for (var key in value) __webpack_require__.d(ns, key, function(key) {
                return value[key];
            }.bind(null, key));
            return ns;
        };
        __webpack_require__.n = function(module) {
            var getter = module && module.__esModule ? function getDefault() {
                return module["default"];
            } : function getModuleExports() {
                return module;
            };
            __webpack_require__.d(getter, "a", getter);
            return getter;
        };
        __webpack_require__.o = function(object, property) {
            return Object.prototype.hasOwnProperty.call(object, property);
        };
        __webpack_require__.p = "/";
        return __webpack_require__(__webpack_require__.s = 0);
    }([ function(module, __webpack_exports__, __webpack_require__) {
        "use strict";
        __webpack_require__.r(__webpack_exports__);
        function mixin(config) {
            return Object.assign({
                target: undefined
            }, config);
        }
        function applyMixinsForClass(targetClass, ...mixins) {
            return class extends targetClass {
                constructor(...args) {
                    super(...args);
                    applyMixins(this, mixins);
                }
            };
        }
        function applyMixinsForObject(target, ...mixins) {
            const result = Object.assign({}, target);
            applyMixins(result, mixins);
            return result;
        }
        function applyMixins(target, mixins) {
            if (typeof target.mixins !== "object") {
                target.mixins = {};
            }
            for (const mixin of mixins) {
                const mixinName = mixin.mixinName;
                target.mixins[mixinName] = mixin;
                mixin.target = target;
                const mixables = getMixables(mixin);
                for (const propName of Object.keys(mixables)) {
                    const propDescription = mixables[propName];
                    if (!(propName in target)) {
                        if (typeof propDescription.value === "function") {
                            Reflect.defineProperty(target, propName, {
                                enumerable: false,
                                configurable: true,
                                writable: false,
                                value(...args) {
                                    return mixin[propName](...args);
                                }
                            });
                        } else if (propDescription.get || propDescription.set) {
                            const attributes = {
                                enumerable: false,
                                configurable: true
                            };
                            if (propDescription.get) {
                                attributes.get = function() {
                                    return mixin[propName];
                                };
                            }
                            if (propDescription.set) {
                                attributes.set = function(value) {
                                    mixin[propName] = value;
                                };
                            }
                            Reflect.defineProperty(target, propName, attributes);
                        } else {
                            Reflect.defineProperty(target, propName, {
                                enumerable: false,
                                configurable: true,
                                get() {
                                    return mixin[propName];
                                },
                                set(value) {
                                    mixin[propName] = value;
                                }
                            });
                        }
                    }
                }
            }
            for (const mixin of mixins) {
                mixin.init && mixin.init();
            }
        }
        function getMixables(obj) {
            const map = {};
            const propNames = Object.getOwnPropertyNames(obj).filter(i => i !== "init" && i !== "target" && i !== "mixinName");
            for (const propName of propNames) {
                const descriptor = Object.getOwnPropertyDescriptor(obj, propName);
                if (descriptor === undefined) {
                    continue;
                }
                map[propName] = descriptor;
            }
            return map;
        }
        function use(...mixins) {
            return function(ctor) {
                return applyMixinsForClass(ctor, ...mixins);
            };
        }
        function useProxy(...mixins) {
            return function(ctor) {
                const newClass = new Proxy(ctor, {
                    construct(target, args) {
                        const result = Reflect.construct(target, args);
                        applyMixins(result, mixins);
                        return result;
                    }
                });
                return newClass;
            };
        }
        function haveMixin(v, mixin) {
            return typeof v === "object" && "mixins" in v && typeof v.mixins === "object" && mixin.mixinName in v.mixins && typeof v.mixins[mixin.mixinName] === "object";
        }
        function haveMixins(v, ...mixins) {
            const baseCheck = typeof v === "object" && "mixins" in v && typeof v.mixins === "object";
            if (!baseCheck) {
                return false;
            }
            for (const mixin of mixins) {
                if (haveMixin(v, mixin) === false) {
                    return false;
                }
            }
            return true;
        }
        function isMixin(value) {
            return typeof value === "object" && "mixinName" in value && "target" in value;
        }
        __webpack_require__.d(__webpack_exports__, "use", function() {
            return use;
        });
        __webpack_require__.d(__webpack_exports__, "useProxy", function() {
            return useProxy;
        });
        __webpack_require__.d(__webpack_exports__, "haveMixins", function() {
            return haveMixins;
        });
        __webpack_require__.d(__webpack_exports__, "haveMixin", function() {
            return haveMixin;
        });
        __webpack_require__.d(__webpack_exports__, "mixin", function() {
            return mixin;
        });
        __webpack_require__.d(__webpack_exports__, "applyMixinsForObject", function() {
            return applyMixinsForObject;
        });
        __webpack_require__.d(__webpack_exports__, "applyMixinsForClass", function() {
            return applyMixinsForClass;
        });
    } ]);
});