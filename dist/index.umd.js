!function(e, t) {
    "object" == typeof exports && "undefined" != typeof module ? t(exports) : "function" == typeof define && define.amd ? define([ "exports" ], t) : t((e = e || self)["ts-mix"] = {});
}(this, function(e) {
    "use strict";
    const t = "__afterMixins";
    class n extends Error {}
    function i(e, t, n) {
        return "object" == typeof e && "mixins" in e && "object" == typeof e.mixins && t.mixinName in e.mixins && "object" == typeof e.mixins[t.mixinName];
    }
    function o(e, t, n) {
        if (!("object" == typeof e && "mixins" in e && "object" == typeof e.mixins)) return !1;
        for (const n of t) if (!1 === i(e, n)) return !1;
        return !0;
    }
    function r(e, ...t) {
        return f(e, !1, ...t);
    }
    function s(e, t, n) {
        for (const i of Object.keys(e)) {
            const o = e[i];
            if (!(i in t)) {
                const e = "function" == typeof o.value, r = !!o.get, s = !!o.set;
                if (e) Reflect.defineProperty(t, i, {
                    enumerable: !1,
                    configurable: !0,
                    writable: !1,
                    value: (...e) => n[i](...e)
                }); else if (r || s) {
                    const e = {
                        enumerable: !1,
                        configurable: !0
                    };
                    r && (e.get = function() {
                        return n[i];
                    }), s && (e.set = function(e) {
                        n[i] = e;
                    }), Reflect.defineProperty(t, i, e);
                } else Reflect.defineProperty(t, i, {
                    enumerable: !1,
                    configurable: !0,
                    get: () => n[i],
                    set(e) {
                        n[i] = e;
                    }
                });
            }
        }
    }
    function f(e, n, ...i) {
        "object" != typeof e.mixins && (e.mixins = {}), i = i.filter(e => !!e);
        for (const t of i) {
            const n = Object.assign({}, t), i = n.mixinName;
            e.mixins[i] = n, n.target = e;
        }
        for (const t of Object.values(e.mixins)) {
            if ("setup" in t && "function" == typeof t.setup) {
                const e = t.setup();
                if (void 0 !== e) for (const [n, i] of Object.entries(e)) t[n] = i;
            }
            if (n) {
                s(u(t), e, t);
            }
            if (void 0 !== t.rewrite) {
                const n = t._rewrite = t.rewrite(t);
                for (const i of Object.keys(n)) {
                    const o = l(e, i), r = Reflect.getOwnPropertyDescriptor(n, i);
                    if (o && r) {
                        if (!(i in t.origin)) {
                            const e = Object.assign({}, o);
                            "function" == typeof e.value && (e.value = e.value.bind(t.target)), "function" == typeof e.get && (e.get = e.get.bind(t.target)), 
                            "function" == typeof e.set && (e.set = e.set.bind(t.target)), Reflect.defineProperty(t.origin, i, e);
                        }
                        const n = "function" == typeof r.value, s = !!r.get, f = !!r.set, c = "function" == typeof o.value, u = !!o.get, l = !!o.set, a = Object.assign({}, o);
                        if (delete a.value, delete a.get, delete a.set, c ? n ? a.value = r.value.bind(t.target) : s && (a.value = function() {
                            return r.value;
                        }) : u || l ? (u && (n && r.value.length <= 0 ? a.get = r.value.bind(t.target) : a.get = s ? r.get : o.get), 
                        l && (a.set = f ? r.set : o.set, delete a.writable)) : n ? a.value = r.value() : s || f ? (s && (a.get = r.get), 
                        f && (a.set = r.set), delete a.writable) : void 0 !== r.value && (a.value = r.value), 
                        "get" in a || "set" in a || "value" in a) {
                            Reflect.deleteProperty(e, i);
                            try {
                                Reflect.defineProperty(e, i, a);
                            } catch (e) {}
                        }
                    }
                }
            }
        }
        for (const t of Object.values(e.mixins)) t.init && t.init();
        t in e && "function" == typeof e[t] && e[t]();
    }
    const c = [ "__proto__", "init", "setup", "target", "mixinName" ];
    function u(e) {
        const t = {}, n = Object.getOwnPropertyNames(e).filter(e => !1 === c.includes(e));
        for (const i of n) {
            const n = Object.getOwnPropertyDescriptor(e, i);
            void 0 !== n && (t[i] = n);
        }
        return t;
    }
    function l(e, t) {
        return e.hasOwnProperty(t) ? Object.getOwnPropertyDescriptor(e, t) : t in e ? l(Object.getPrototypeOf(e), t) : void 0;
    }
    e.MixinAssertError = n, e.applyMixins = r, e.assertHaveMixin = function(e, t, o, r) {
        if (!1 === i(e, t)) throw r instanceof Error ? r : new n(null != r ? r : `The object does not have mixin '${t.mixinName}'`);
    }, e.assertHaveMixins = function(e, t, i, r) {
        if (!1 === o(e, t)) throw r instanceof Error ? r : new n(null != r ? r : `The object does not have one or more of mixins ${t.map(e => `'${e.mixinName}'`).join(", ")}`);
    }, e.haveMixin = i, e.haveMixins = o, e.isMixin = function(e) {
        var t, n, i, o, r, s, f;
        return "object" == typeof e && "string" == typeof (null === (t = e) || void 0 === t ? void 0 : t.mixinName) && "object" == typeof (null === (n = e) || void 0 === n ? void 0 : n.target) && "object" == typeof (null === (o = null === (i = e) || void 0 === i ? void 0 : i.target) || void 0 === o ? void 0 : o.mixins) && (null === (r = e) || void 0 === r ? void 0 : r.mixinName) in (null === (f = null === (s = e) || void 0 === s ? void 0 : s.target) || void 0 === f ? void 0 : f.mixins);
    }, e.mixin = function(e) {
        const t = e;
        return Object.assign({
            target: void 0,
            origin: {}
        }, t);
    }, e.mixinsProp = function(e, t, n, i, o, s, f, c, u, l) {
        return (a, p) => {
            let d, v = 0;
            Reflect.defineProperty(a, p, {
                get: () => 0 === v ? (v++, !1) : (1 === v && (v++, Reflect.deleteProperty(a, p), 
                r(a, e, t, n, i, o, s, f, c, u, l)), d),
                set(e) {
                    d = e;
                }
            });
        };
    }, e.useMixins = function(e, t, n, i, o, r, s, c, u, l, a) {
        var p;
        return (p = class extends e {
            constructor(...e) {
                super(...e), f(this, !0, t, n, i, o, r, s, c, u, l, a);
            }
        }).__m_b_type = e, p;
    }, e.useMixinsForObject = function(e, t, n, i, o, r, s, c, u, l, a) {
        return f(e, !0, t, n, i, o, r, s, c, u, l, a), e;
    }, Object.defineProperty(e, "__esModule", {
        value: !0
    });
});
