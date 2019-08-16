import {IUseMixins, Mixin} from "./types";
import {AnyObject, Constructor} from "./common.types";


export function use<Mixins extends Array<Mixin<string, AnyObject>>>(...mixins: Mixins) {
    return function<T extends Constructor<AnyObject>>(this: unknown, ctor: T) {
        // noinspection UnnecessaryLocalVariableJS
        const newClass = new Proxy(ctor, {
            construct(target: T, args: any) {
                const result: IUseMixins<Mixins> = Reflect.construct(target, args);

                (result.mixins as AnyObject) = {};

                for (const mixin of mixins) {
                    const mixinName = mixin.mixinName;
                    (result.mixins as AnyObject)[mixinName] = mixin;
                    mixin.target = result as any;

                    const mixables = getMixables(mixin);

                    for (const propName of Object.keys(mixables)) {
                        const propDescription = mixables[propName];

                        if (!(propName in result)) {
                            if (typeof propDescription.value === 'function') {
                                Reflect.defineProperty(result, propName, {
                                    enumerable: false,
                                    configurable: true,
                                    writable: false,
                                    value(this: typeof result, ...args: any[]) {
                                        return mixin[propName](...args);
                                    },
                                });
                            } else if (propDescription.get || propDescription.set) {
                                const attributes: PropertyDescriptor = {
                                    enumerable: false,
                                    configurable: true,
                                };
                                if (propDescription.get) {
                                    attributes.get = function(this: typeof result) {
                                        return mixin[propName];
                                    };
                                }
                                if (propDescription.set) {
                                    attributes.set = function(this: typeof result, value: any) {
                                        mixin[propName] = value;
                                    };
                                }
                                Reflect.defineProperty(result, propName, attributes);
                            } else {
                                Reflect.defineProperty(result, propName, {
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

                return result;
            },
        });

        return newClass;
    };
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
