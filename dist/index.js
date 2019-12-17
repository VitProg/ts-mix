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
    }([ function(module, exports, __webpack_require__) {
        var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;
        var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_LOCAL_MODULE_1__;
        var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_LOCAL_MODULE_2__;
        var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_LOCAL_MODULE_3__;
        var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_LOCAL_MODULE_4__;
        var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;
        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [ __webpack_require__, exports ], __WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports) {
            "use strict";
            Object.defineProperty(exports, "__esModule", {
                value: true
            });
        }.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [ __webpack_require__, exports ], __WEBPACK_LOCAL_MODULE_1__ = function(require, exports) {
            "use strict";
            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            exports.mixinsAfterInit = "__afterMixins";
        }.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__));
        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [ __webpack_require__, exports, __WEBPACK_LOCAL_MODULE_1__ ], 
        __WEBPACK_LOCAL_MODULE_2__ = function(require, exports, types_1) {
            "use strict";
            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            function mixin(config) {
                const cfg = config;
                return Object.assign({
                    target: undefined
                }, cfg);
            }
            exports.mixin = mixin;
            function applyMixinsForClass(targetClass, ...mixins) {
                return class extends targetClass {
                    constructor(...args) {
                        super(...args);
                        applyMixins(this, mixins);
                    }
                };
            }
            exports.applyMixinsForClass = applyMixinsForClass;
            function applyMixinsForObject(target, ...mixins) {
                const result = Object.assign({}, target);
                applyMixins(result, mixins);
                return result;
            }
            exports.applyMixinsForObject = applyMixinsForObject;
            function applyMixins(target, mixins) {
                if (typeof target.mixins !== "object") {
                    target.mixins = {};
                }
                for (const mixin of mixins) {
                    const mixinName = mixin.mixinName;
                    target.mixins[mixinName] = mixin;
                    mixin.target = target;
                    if ("setup" in mixin && typeof mixin.setup === "function") {
                        const setupResult = mixin.setup();
                        if (typeof setupResult !== "undefined") {
                            for (const [key, value] of Object.entries(setupResult)) {
                                mixin[key] = value;
                            }
                        }
                    }
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
                if (types_1.mixinsAfterInit in target && typeof target[types_1.mixinsAfterInit] === "function") {
                    target[types_1.mixinsAfterInit]();
                }
            }
            exports.applyMixins = applyMixins;
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
        }.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__));
        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [ __webpack_require__, exports, __WEBPACK_LOCAL_MODULE_2__ ], 
        __WEBPACK_LOCAL_MODULE_3__ = function(require, exports, mixin_1) {
            "use strict";
            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            function use(...mixins) {
                return function(ctor) {
                    return mixin_1.applyMixinsForClass(ctor, ...mixins);
                };
            }
            exports.use = use;
            function useProxy(...mixins) {
                return function(ctor) {
                    const newClass = new Proxy(ctor, {
                        construct(target, args) {
                            const result = Reflect.construct(target, args);
                            mixin_1.applyMixins(result, mixins);
                            return result;
                        }
                    });
                    return newClass;
                };
            }
            exports.useProxy = useProxy;
        }.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__));
        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [ __webpack_require__, exports ], __WEBPACK_LOCAL_MODULE_4__ = function(require, exports) {
            "use strict";
            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            function haveMixin(v, mixin) {
                return typeof v === "object" && "mixins" in v && typeof v.mixins === "object" && mixin.mixinName in v.mixins && typeof v.mixins[mixin.mixinName] === "object";
            }
            exports.haveMixin = haveMixin;
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
            exports.haveMixins = haveMixins;
            function isMixin(value) {
                return typeof value === "object" && "mixinName" in value && "target" in value;
            }
            exports.isMixin = isMixin;
        }.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__));
        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [ __webpack_require__, exports, __WEBPACK_LOCAL_MODULE_3__, __WEBPACK_LOCAL_MODULE_4__, __WEBPACK_LOCAL_MODULE_2__ ], 
        __WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, decorators_1, type_guards_1, mixin_2) {
            "use strict";
            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            exports.use = decorators_1.use;
            exports.useProxy = decorators_1.useProxy;
            exports.haveMixins = type_guards_1.haveMixins;
            exports.haveMixin = type_guards_1.haveMixin;
            exports.mixin = mixin_2.mixin;
            exports.applyMixinsForObject = mixin_2.applyMixinsForObject;
            exports.applyMixinsForClass = mixin_2.applyMixinsForClass;
        }.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
    } ]);
});