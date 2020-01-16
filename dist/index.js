"use strict";

Object.defineProperty(exports, "__esModule", {
    value: !0
});

const mixinsAfterInit = "__afterMixins";

class MixinAssertError extends Error {}

function haveMixin(e, i, t) {
    return "object" == typeof e && "mixins" in e && "object" == typeof e.mixins && i.mixinName in e.mixins && "object" == typeof e.mixins[i.mixinName];
}

function haveMixins(e, i, t) {
    if (!("object" == typeof e && "mixins" in e && "object" == typeof e.mixins)) return !1;
    for (const t of i) if (!1 === haveMixin(e, t)) return !1;
    return !0;
}

function isMixin(e) {
    var i, t, n, r, o, s, a;
    return "object" == typeof e && "string" == typeof (null === (i = e) || void 0 === i ? void 0 : i.mixinName) && "object" == typeof (null === (t = e) || void 0 === t ? void 0 : t.target) && "object" == typeof (null === (r = null === (n = e) || void 0 === n ? void 0 : n.target) || void 0 === r ? void 0 : r.mixins) && (null === (o = e) || void 0 === o ? void 0 : o.mixinName) in (null === (a = null === (s = e) || void 0 === s ? void 0 : s.target) || void 0 === a ? void 0 : a.mixins);
}

function assertHaveMixin(e, i, t, n) {
    if (!1 === haveMixin(e, i)) throw n instanceof Error ? n : new MixinAssertError(null != n ? n : `The object does not have mixin '${i.mixinName}'`);
}

function assertHaveMixins(e, i, t, n) {
    if (!1 === haveMixins(e, i)) throw n instanceof Error ? n : new MixinAssertError(null != n ? n : `The object does not have one or more of mixins ${i.map(e => `'${e.mixinName}'`).join(", ")}`);
}

function mixin(e) {
    const i = e;
    return Object.assign({
        target: void 0,
        origin: {}
    }, i);
}

function useMixinsForObject(e, i, t, n, r, o, s, a, c, f, l) {
    return applyMixinsInternal(e, !0, i, t, n, r, o, s, a, c, f, l), e;
}

function useMixins(e, i, t, n, r, o, s, a, c, f, l) {
    var u;
    return (u = class extends e {
        constructor(...e) {
            super(...e), applyMixinsInternal(this, !0, i, t, n, r, o, s, a, c, f, l);
        }
    }).__m_b_type = e, u;
}

function applyMixins(e, ...i) {
    return applyMixinsInternal(e, !1, ...i);
}

function mixingProps(e, i, t) {
    for (const n of Object.keys(e)) {
        const r = e[n];
        if (!(n in i)) {
            const e = "function" == typeof r.value, o = !!r.get, s = !!r.set;
            if (e) Reflect.defineProperty(i, n, {
                enumerable: !1,
                configurable: !0,
                writable: !1,
                value: (...e) => t[n](...e)
            }); else if (o || s) {
                const e = {
                    enumerable: !1,
                    configurable: !0
                };
                o && (e.get = function() {
                    return t[n];
                }), s && (e.set = function(e) {
                    t[n] = e;
                }), Reflect.defineProperty(i, n, e);
            } else Reflect.defineProperty(i, n, {
                enumerable: !1,
                configurable: !0,
                get: () => t[n],
                set(e) {
                    t[n] = e;
                }
            });
        }
    }
}

function applyMixinsInternal(e, i, ...t) {
    "object" != typeof e.mixins && (e.mixins = {}), t = t.filter(e => !!e);
    for (const i of t) {
        const t = Object.assign({}, i), n = t.mixinName;
        e.mixins[n] = t, t.target = e;
    }
    for (const t of Object.values(e.mixins)) {
        if ("setup" in t && "function" == typeof t.setup) {
            const e = t.setup();
            if (void 0 !== e) for (const [i, n] of Object.entries(e)) t[i] = n;
        }
        if (i) {
            mixingProps(getMixables(t), e, t);
        }
        if (void 0 !== t.rewrite) {
            const i = t._rewrite = t.rewrite(t);
            for (const n of Object.keys(i)) {
                const r = getOriginalPropertyDescriptor(e, n), o = Reflect.getOwnPropertyDescriptor(i, n);
                if (r && o) {
                    if (!(n in t.origin)) {
                        const e = Object.assign({}, r);
                        "function" == typeof e.value && (e.value = e.value.bind(t.target)), "function" == typeof e.get && (e.get = e.get.bind(t.target)), 
                        "function" == typeof e.set && (e.set = e.set.bind(t.target)), Reflect.defineProperty(t.origin, n, e);
                    }
                    const i = "function" == typeof o.value, s = !!o.get, a = !!o.set, c = "function" == typeof r.value, f = !!r.get, l = !!r.set, u = Object.assign({}, r);
                    if (delete u.value, delete u.get, delete u.set, c ? i ? u.value = o.value.bind(t.target) : s && (u.value = function() {
                        return o.value;
                    }) : f || l ? (f && (i && o.value.length <= 0 ? u.get = o.value.bind(t.target) : u.get = s ? o.get : r.get), 
                    l && (u.set = a ? o.set : r.set, delete u.writable)) : i ? u.value = o.value() : s || a ? (s && (u.get = o.get), 
                    a && (u.set = o.set), delete u.writable) : void 0 !== o.value && (u.value = o.value), 
                    "get" in u || "set" in u || "value" in u) {
                        Reflect.deleteProperty(e, n);
                        try {
                            Reflect.defineProperty(e, n, u);
                        } catch (e) {}
                    }
                }
            }
        }
    }
    for (const i of Object.values(e.mixins)) i.init && i.init();
    mixinsAfterInit in e && "function" == typeof e[mixinsAfterInit] && e[mixinsAfterInit]();
}

const noPermitenMixableProperties = [ "__proto__", "init", "setup", "target", "mixinName" ];

function getMixables(e) {
    const i = {}, t = Object.getOwnPropertyNames(e).filter(e => !1 === noPermitenMixableProperties.includes(e));
    for (const n of t) {
        const t = Object.getOwnPropertyDescriptor(e, n);
        void 0 !== t && (i[n] = t);
    }
    return i;
}

function getOriginalPropertyDescriptor(e, i) {
    return e.hasOwnProperty(i) ? Object.getOwnPropertyDescriptor(e, i) : i in e ? getOriginalPropertyDescriptor(Object.getPrototypeOf(e), i) : void 0;
}

function mixinsProp(e, i, t, n, r, o, s, a, c, f) {
    return (l, u) => {
        let x, p = 0;
        Reflect.defineProperty(l, u, {
            get: () => 0 === p ? (p++, !1) : (1 === p && (p++, Reflect.deleteProperty(l, u), 
            applyMixins(l, e, i, t, n, r, o, s, a, c, f)), x),
            set(e) {
                x = e;
            }
        });
    };
}

exports.MixinAssertError = MixinAssertError, exports.applyMixins = applyMixins, 
exports.assertHaveMixin = assertHaveMixin, exports.assertHaveMixins = assertHaveMixins, 
exports.haveMixin = haveMixin, exports.haveMixins = haveMixins, exports.isMixin = isMixin, 
exports.mixin = mixin, exports.mixinsProp = mixinsProp, exports.useMixins = useMixins, 
exports.useMixinsForObject = useMixinsForObject;
