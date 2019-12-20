import {IUseMixins, IUseMixinsWithBase, Mixin, MixinFull, mixinsAfterInit} from "./types";
import {AnyObject, Constructor, RewriteConstructorResult, RewriteConstructorResult1} from "./common.types";
import {UseMixinsExtends} from "./methods";

type ConfigComplex<Name extends string, Config extends AnyObject, PartialKeys extends Array<keyof Config> = []>
    = PartialBy<Config, OR<PartialKeys>> &
    { mixinName: Name, init?: () => void} &
    (OR<PartialKeys> extends never ? {} : {setup: () => Required<Pick<Config, OR<PartialKeys>>>});

type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

type OR<T extends ReadonlyArray<any>> = T[number];

export function mixin<Name extends string, Config extends AnyObject, PartialKeys extends Array<keyof Config> = []>(
    config: (Config | ConfigComplex<Name, Config, PartialKeys>) & ThisType<MixinFull<Name, Config>>
): MixinFull<Name, Config> {
    const cfg: ConfigComplex<Name, Config> = config as any;
    return {
        target: undefined as any,
        ...cfg,
    };
}

import tb from 'ts-toolbelt';

export const applyMixinsForClass = UseMixinsExtends;

// export function applyMixinsForClass<
//     Mixins extends Array<Mixin<string, AnyObject>>,
//     BaseConstr extends Constructor<AnyObject>,
//     BaseType extends InstanceType<BaseConstr>,
//     ResultCtor extends RewriteConstructorResult<BaseConstr, IUseMixins<Mixins, BaseType>, '__used_mixins'>,
//     // ResultCtor extends Constructor<Omit<BaseType, '__used_mixins'> & IUseMixins<Mixins, BaseType>, ConstructorParameters<BaseConstr>>,
// >(
//     targetClass: BaseConstr,
//     ...mixins: Mixins
// ): ResultCtor {
//     return class extends targetClass {
//         constructor(...args: any[]) {
//             super(...args);
//
//             applyMixins(this as any, mixins);
//         }
//     } as any;
// }

export function applyMixinsForObject<T extends AnyObject, Mixins extends Array<Mixin<string, AnyObject>>>(
    target: T, ...mixins: Mixins
): T & IUseMixins<Mixins, T> {
    const result: T & IUseMixins<Mixins> = {...target} as any;
    applyMixins(result, mixins);
    return result as any;
}

export function applyMixins<T extends AnyObject, Mixins extends Array<Mixin<string, AnyObject>>>(
    target: T, mixins: Mixins
): void {
    if (typeof target.mixins !== 'object') {
        (target.mixins as AnyObject) = {};
    }

    for (const mixin of mixins) {
        if (!mixin) {
            continue;
        }

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
