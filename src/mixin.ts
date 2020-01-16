import {
    AnyObject,
    BuildMixinsIntersection,
    ConfigComplex,
    Constructor,
    ConstructorWithStatic,
    ExtractMixinsProp, ExtractMixinsTargets,
    Mixin,
    MixinFull,
    mixinsAfterInit,
    MixinsProp,
} from "./types";

///////////////////////

export function mixin<
    Name extends string,
    Config extends AnyObject,
    PartialKeys extends Array<keyof Config> = [],
    Target extends AnyObject = AnyObject
>(
    config: (Config | ConfigComplex<Name, Config, PartialKeys, Target>) & ThisType<MixinFull<Name, Config, Target>>
): MixinFull<Name, Config, Target> {
    const cfg: ConfigComplex<Name, Config> = config as any;
    const result = {
        target: undefined as any as Target,
        origin: {},
        ...cfg,
    };
    return result as MixinFull<Name, Config, Target>;
}

/////////////////////////////

export function useMixinsForObject<
    T extends ExtractMixinsTargets<M1, M2, M3, M4, M5, M6, M7, M8, M9, M10>,
    M1 extends Mixin<any, any, any>,
    M2 extends Mixin<any, any, any> = never,
    M3 extends Mixin<any, any, any> = never,
    M4 extends Mixin<any, any, any> = never,
    M5 extends Mixin<any, any, any> = never,
    M6 extends Mixin<any, any, any> = never,
    M7 extends Mixin<any, any, any> = never,
    M8 extends Mixin<any, any, any> = never,
    M9 extends Mixin<any, any, any> = never,
    M10 extends Mixin<any, any, any> = never,
    >(
    target: T,
    m1: M1, m2?: M2, m3?: M3, m4?: M4, m5?: M5, m6?: M6, m7?: M7, m8?: M8, m9?: M9, m10?: M10,
): Omit<T, 'mixins'> &
    Omit<BuildMixinsIntersection<M1, M2, M3, M4, M5, M6, M7, M8, M9, M10>, keyof T> &
    { mixins: ExtractMixinsProp<T> & MixinsProp<[M1, M2, M3, M4, M5, M6, M7, M8, M9, M10]> } {
    applyMixinsInternal(
        target,
        true,
        m1, m2, m3, m4, m5, m6, m7, m8, m9, m10,
    );
    return target as any;
}

export function useMixinsForObject_test<
    T extends ExtractMixinsTargets<M1, M2, M3, M4, M5, M6, M7, M8, M9, M10>,
    M1 extends Mixin<any, any, any>,
    M2 extends Mixin<any, any, any> = never,
    M3 extends Mixin<any, any, any> = never,
    M4 extends Mixin<any, any, any> = never,
    M5 extends Mixin<any, any, any> = never,
    M6 extends Mixin<any, any, any> = never,
    M7 extends Mixin<any, any, any> = never,
    M8 extends Mixin<any, any, any> = never,
    M9 extends Mixin<any, any, any> = never,
    M10 extends Mixin<any, any, any> = never,
    >(
    target: T,
    m1: M1, m2?: M2, m3?: M3, m4?: M4, m5?: M5, m6?: M6, m7?: M7, m8?: M8, m9?: M9, m10?: M10,
): T { return target; }
/////////////////////////////

export function useMixins<
    Target extends ExtractMixinsTargets<M1, M2, M3, M4, M5, M6, M7, M8, M9, M10>,
    Ctor extends Constructor<Target>,
    Instance extends InstanceType<Ctor>,
    CtorArguments extends ConstructorParameters<Ctor>,
    NewInstance extends Omit<Instance, 'mixins' | '__m_b_type'> &
        Omit<BuildMixinsIntersection<M1, M2, M3, M4, M5, M6, M7, M8, M9, M10>, keyof Instance> &
        { mixins: ExtractMixinsProp<Instance> & MixinsProp<[M1, M2, M3, M4, M5, M6, M7, M8, M9, M10]> },
    M1 extends Mixin<any, any, any>,
    M2 extends Mixin<any, any, any> = never,
    M3 extends Mixin<any, any, any> = never,
    M4 extends Mixin<any, any, any> = never,
    M5 extends Mixin<any, any, any> = never,
    M6 extends Mixin<any, any, any> = never,
    M7 extends Mixin<any, any, any> = never,
    M8 extends Mixin<any, any, any> = never,
    M9 extends Mixin<any, any, any> = never,
    M10 extends Mixin<any, any, any> = never,
    >(
    klass: Ctor,
    m1: M1, m2?: M2, m3?: M3, m4?: M4, m5?: M5, m6?: M6, m7?: M7, m8?: M8, m9?: M9, m10?: M10,
): ConstructorWithStatic<NewInstance, Ctor> & { __m_b_type: Ctor } {
    return class extends (klass as any) {
        // tslint:disable-next-line:variable-name
        static __m_b_type = klass;

        constructor(...args: any[]) {
            super(...args);
            applyMixinsInternal(
                this as any,
                true,
                m1, m2, m3, m4, m5, m6, m7, m8, m9, m10,
            );
        }
    } as any;
}

export function applyMixins<T extends AnyObject, Mixins extends Array<Mixin<any, any, any>>>(
    target: T, ...mixins: Mixins
): void {
    return applyMixinsInternal(target, false, ...mixins);
}

function mixingProps<T extends AnyObject, EX extends true | false>(
    propertyDescriptors: PropertyDescriptorMap, target: T, mixin: Mixin<any, any, any>
) {
    for (const propName of Object.keys(propertyDescriptors)) {
        const propDescription = propertyDescriptors[propName];

        if (!(propName in target)) {
            const isFunction = typeof propDescription.value === 'function';
            const isGetter = !!propDescription.get;
            const isSetter = !!propDescription.set;

            if (isFunction) {
                Reflect.defineProperty(target, propName, {
                    enumerable: false,
                    configurable: true,
                    writable: false,
                    value(this: typeof target, ...args: any[]) {
                        return mixin[propName](...args);
                    },
                });
            } else if (isGetter || isSetter) {
                const attributes: PropertyDescriptor = {
                    enumerable: false,
                    configurable: true,
                };
                if (isGetter) {
                    attributes.get = function(this: typeof target) {
                        return mixin[propName];
                    };
                }
                if (isSetter) {
                    attributes.set = function(this: typeof target, value: any) {
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
                    set(value: any) {
                        mixin[propName] = value;
                    },
                });
            }
        }
    }
}

function applyMixinsInternal<T extends AnyObject, EX extends true | false, Mixins extends Array<Mixin<any, any, any>>>(
    target: T, extendFromMixins: EX, ...mixins: Mixins
): void {
    if (typeof target.mixins !== 'object') {
        (target.mixins as AnyObject) = {};
    }

    mixins = mixins.filter(m => !!m) as Mixins;

    for (const mixinOrig of mixins) {
        const mixin = {...mixinOrig};

        const mixinName = mixin.mixinName;
        (target.mixins as AnyObject)[mixinName] = mixin;
        mixin.target = target as any;
    }

    for (const mixin of Object.values(target.mixins as Record<string, Mixin<any, any, any>>)) {
        if ('setup' in mixin && typeof mixin.setup === 'function') {
            const setupResult = mixin.setup();
            if (typeof setupResult !== 'undefined') {
                for (const [key, value] of Object.entries(setupResult)) {
                    mixin[key] = value;
                }
            }
        }

        if (extendFromMixins) {
            const mixables = getMixables(mixin);

            mixingProps(mixables, target, mixin);
        }

        if (typeof mixin.rewrite !== 'undefined') {
            const rewrites = mixin._rewrite = mixin.rewrite(mixin);

            for (const propName of Object.keys(rewrites)) {
                const originalDescriptor = getOriginalPropertyDescriptor(target, propName);
                const rewriteDescriptor = Reflect.getOwnPropertyDescriptor(rewrites, propName);
                if (originalDescriptor && rewriteDescriptor) {
                    if (!(propName in mixin.origin)) {
                        const toOriginDescriptor = {
                            ...originalDescriptor,
                        };
                        if (typeof toOriginDescriptor.value === 'function') {
                            toOriginDescriptor.value = toOriginDescriptor.value.bind(mixin.target);
                        }
                        if (typeof toOriginDescriptor.get === 'function') {
                            toOriginDescriptor.get = toOriginDescriptor.get.bind(mixin.target);
                        }
                        if (typeof toOriginDescriptor.set === 'function') {
                            toOriginDescriptor.set = toOriginDescriptor.set.bind(mixin.target);
                        }
                        Reflect.defineProperty(mixin.origin, propName, toOriginDescriptor);
                    }

                    const isRewriteFunction = typeof rewriteDescriptor.value === 'function';
                    const isRewriteGetter = !!rewriteDescriptor.get;
                    const isRewriteSetter = !!rewriteDescriptor.set;

                    const isOriginalFunction = typeof originalDescriptor.value === 'function';
                    const isOriginalGetter = !!originalDescriptor.get;
                    const isOriginalSetter = !!originalDescriptor.set;

                    const newDescriptor = {...originalDescriptor};
                    delete newDescriptor.value;
                    delete newDescriptor.get;
                    delete newDescriptor.set;

                    if (isOriginalFunction) {
                        if (isRewriteFunction) {
                            newDescriptor.value = rewriteDescriptor.value.bind(mixin.target);
                        } else if (isRewriteGetter) {
                            newDescriptor.value = function(this: any) {
                                return rewriteDescriptor.value;
                            };
                        }
                    } else if (isOriginalGetter || isOriginalSetter) {
                        if (isOriginalGetter) {
                            if (isRewriteFunction && rewriteDescriptor.value.length <= 0) {
                                newDescriptor.get = rewriteDescriptor.value.bind(mixin.target);
                            } else if (isRewriteGetter) {
                                newDescriptor.get = rewriteDescriptor.get;
                            } else {
                                newDescriptor.get = originalDescriptor.get;
                            }
                        }
                        if (isOriginalSetter) {
                            if (isRewriteSetter) {
                                newDescriptor.set = rewriteDescriptor.set;
                            } else {
                                newDescriptor.set = originalDescriptor.set;
                            }
                            delete newDescriptor.writable;
                        }
                    } else {
                        if (isRewriteFunction) {
                            newDescriptor.value = rewriteDescriptor.value();
                        } else {
                            // if (isRewriteGetter && !isRewriteSetter && newDescriptor.writable)) {
                            //     let rVal = originalDescriptor.value;
                            //
                            //     newDescriptor.get = function(this: any) {
                            //         return rVal;
                            //     };
                            //     newDescriptor.set = function(this: any, newVal: any) {
                            //         rVal = newVal;
                            //     };
                            //     delete newDescriptor.writable;
                            if (isRewriteGetter || isRewriteSetter) {
                                if (isRewriteGetter) {
                                    newDescriptor.get = rewriteDescriptor.get;
                                }
                                if (isRewriteSetter) {
                                    newDescriptor.set = rewriteDescriptor.set;
                                }
                                delete newDescriptor.writable;
                            } else if (typeof rewriteDescriptor.value !== 'undefined') {
                                newDescriptor.value = rewriteDescriptor.value;
                            }

                        }
                    }

                    if ('get' in newDescriptor || 'set' in newDescriptor || 'value' in newDescriptor) {
                        Reflect.deleteProperty(target, propName);
                        try {
                            Reflect.defineProperty(target, propName, newDescriptor);
                        } catch(e) {
                            debugger
                        }
                    }
                }
            }
        }
    }

    for (const mixin of Object.values(target.mixins as Record<string, Mixin<any, any, any>>)) {
        mixin.init && mixin.init();
    }

    if (mixinsAfterInit in target && typeof target[mixinsAfterInit] === 'function') {
        target[mixinsAfterInit]();
    }

    // return target;
}

const noPermitenMixableProperties = ['__proto__', 'init', 'setup', 'target', 'mixinName'];

/**
 * Returns a map of mixables. That is things that can be mixed in
 */
function getMixables(obj: object): PropertyDescriptorMap {
    const map: PropertyDescriptorMap = {};
    const propNames = Object.getOwnPropertyNames(obj).filter(i => noPermitenMixableProperties.includes(i) === false);

    for (const propName of propNames) {
        const descriptor = Object.getOwnPropertyDescriptor(obj, propName);

        if (descriptor === undefined) {
            continue;
        }

        map[propName] = descriptor;
    }

    return map;
}

export function getOriginalPropertyDescriptor(object: {}, key: string): PropertyDescriptor | undefined {
    if (object.hasOwnProperty(key)) {
        return Object.getOwnPropertyDescriptor(object, key);
    } else if (key in object) {
        return getOriginalPropertyDescriptor(Object.getPrototypeOf(object), key);
    } else {
        return undefined;
    }
}
