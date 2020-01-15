import {
    AnyObject,
    BuildMixinsIntersection,
    ConfigComplex,
    Constructor,
    ConstructorWithStatic,
    ExtractMixinsProp,
    Mixin,
    MixinFull,
    mixinsAfterInit,
    MixinsProp
} from "./types";

///////////////////////

export function mixin<Name extends string, Config extends AnyObject, PartialKeys extends Array<keyof Config> = []>(
    config: (Config | ConfigComplex<Name, Config, PartialKeys>) & ThisType<MixinFull<Name, Config>>
): MixinFull<Name, Config> {
    const cfg: ConfigComplex<Name, Config> = config as any;
    return {
        target: undefined as any,
        ...cfg,
    };
}

/////////////////////////////

export function useMixinsForObject<T extends AnyObject,
    Mixins extends Array<Mixin<any, any>>,
    M1 extends Mixin<any, any>,
    M2 extends Mixin<any, any> = never,
    M3 extends Mixin<any, any> = never,
    M4 extends Mixin<any, any> = never,
    M5 extends Mixin<any, any> = never,
    M6 extends Mixin<any, any> = never,
    M7 extends Mixin<any, any> = never,
    M8 extends Mixin<any, any> = never,
    M9 extends Mixin<any, any> = never,
    M10 extends Mixin<any, any> = never,
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

/////////////////////////////

export function useMixins<Ctor extends Constructor<any>,
    Instance extends InstanceType<Ctor>,
    CtorArguments extends ConstructorParameters<Ctor>,
    NewInstance extends Omit<Instance, 'mixins' | '__m_b_type'> &
        Omit<BuildMixinsIntersection<M1, M2, M3, M4, M5, M6, M7, M8, M9, M10>, keyof Instance> &
        { mixins: ExtractMixinsProp<Instance> & MixinsProp<[M1, M2, M3, M4, M5, M6, M7, M8, M9, M10]> },
    M1 extends Mixin<any, any>,
    M2 extends Mixin<any, any> = never,
    M3 extends Mixin<any, any> = never,
    M4 extends Mixin<any, any> = never,
    M5 extends Mixin<any, any> = never,
    M6 extends Mixin<any, any> = never,
    M7 extends Mixin<any, any> = never,
    M8 extends Mixin<any, any> = never,
    M9 extends Mixin<any, any> = never,
    M10 extends Mixin<any, any> = never,
    >(
    klass: Ctor,
    m1: M1, m2?: M2, m3?: M3, m4?: M4, m5?: M5, m6?: M6, m7?: M7, m8?: M8, m9?: M9, m10?: M10,
): ConstructorWithStatic<NewInstance, Ctor> & { __m_b_type: Ctor } {
    return class extends klass {
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

export function applyMixins<T extends AnyObject, Mixins extends Array<Mixin<any, any>>>(
    target: T, ...mixins: Mixins
): void {
    return applyMixinsInternal(target, false, ...mixins);
}

function applyMixinsInternal<T extends AnyObject, EX extends true | false, Mixins extends Array<Mixin<any, any>>>(
    target: T, extendFromMixins: EX, ...mixins: Mixins
): void {
    if (typeof target.mixins !== 'object') {
        (target.mixins as AnyObject) = {};
    }

    mixins = mixins.filter(m => !!m) as Mixins;

    for (const mixinOrig of mixins) {
        if (!mixinOrig) {
            continue;
        }
        const mixin = {...mixinOrig};

        const mixinName = mixin.mixinName;
        (target.mixins as AnyObject)[mixinName] = mixin;
        mixin.target = target as any;

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

            for (const propName of Object.keys(mixables)) {
                const propDescription = mixables[propName];

                if (!(propName in target)) {
                    if (typeof propDescription.value === 'function') {
                        Reflect.defineProperty(target, propName, {
                            enumerable: false,
                            configurable: true,
                            writable: false,
                            value(this: typeof target, ...args: any[]) {
                                return mixin[propName](...args);
                            },
                        });
                    } else if (propDescription.get || propDescription.set) {
                        const attributes: PropertyDescriptor = {
                            enumerable: false,
                            configurable: true,
                        };
                        if (propDescription.get) {
                            attributes.get = function(this: typeof target) {
                                return mixin[propName];
                            };
                        }
                        if (propDescription.set) {
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
    }

    for (const mixin of mixins) {
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
