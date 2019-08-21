import {IUseMixins, Mixin} from "./types";
import {AnyObject, Constructor} from "./common.types";


export function mixin<Name extends string, Config extends AnyObject>(
    config: Config & { mixinName: Name, init?: (this: Mixin<Name, Config>) => void }
): Mixin<Name, Config> {
    return {
        target: undefined as any,
        ...config,
    };
}

export function applyMixinsForClass<Mixins extends Array<Mixin<string, AnyObject>>, T extends Constructor<AnyObject>>(
    targetClass: T, ...mixins: Mixins
): Constructor<InstanceType<T> & IUseMixins<Mixins>> {
    return class extends targetClass {
        mixins = {};

        constructor(...args: any[]) {
            super(...args);

            applyMixins(this as any, mixins);
        }
    } as any;
}

export function applyMixinsForObject<T extends AnyObject, Mixins extends Array<Mixin<string, AnyObject>>>(
    target: T, ...mixins: Mixins
): T & IUseMixins<Mixins> {
    const result: T & IUseMixins<Mixins> = {...target} as any;
    applyMixins(result, mixins);
    return result;
}


export function applyMixins<T extends AnyObject, Mixins extends Array<Mixin<string, AnyObject>>>(
    target: T, mixins: Mixins
): void {
    (target.mixins as AnyObject) = {};

    for (const mixin of mixins) {
        const mixinName = mixin.mixinName;
        (target.mixins as AnyObject)[mixinName] = mixin;
        mixin.target = target as any;

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

    // return target;
}

/**
 * Returns a map of mixables. That is things that can be mixed in
 */
function getMixables(obj: object): PropertyDescriptorMap {
    const map: PropertyDescriptorMap = {};
    const propNames = Object.getOwnPropertyNames(obj).filter(i => i !== 'init' && i !== 'target' && i !== 'mixinName');

    for (const propName of propNames) {
        const descriptor = Object.getOwnPropertyDescriptor(obj, propName);

        if (descriptor === undefined) {
            continue;
        }

        map[propName] = descriptor;
    }

    return map;
}
