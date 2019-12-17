import {IUseMixins, Mixin} from "./types";
import {AnyObject, Constructor} from "./common.types";
import {applyMixinsForClass, applyMixins} from "./mixin";

export function use<Mixins extends Array<Mixin<string, AnyObject>>>(...mixins: Mixins) {
    return function<T extends Constructor<AnyObject>>(this: unknown, ctor: T): T {
        return applyMixinsForClass(ctor, ...mixins);
    };
}

export function useProxy<Mixins extends Array<Mixin<string, AnyObject>>>(...mixins: Mixins) {
    return function<T extends Constructor<AnyObject>>(this: unknown, ctor: T): T {
        // noinspection UnnecessaryLocalVariableJS
        const newClass = new Proxy(ctor, {
            construct(target: T, args: any) {
                const result: T & IUseMixins<Mixins> = Reflect.construct(target, args);

                applyMixins(result, mixins);

                return result;
            },
        });

        return newClass;
    };
}

