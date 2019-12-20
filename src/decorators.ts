import {Mixin} from "./types";
import {AnyObject, Constructor} from "./common.types";
import {applyMixins, applyMixinsForClass} from "./mixin";

export function use<Mixins extends Array<Mixin<string, AnyObject>>>(...mixins: Mixins) {
    return function<T extends Constructor<AnyObject>>(this: unknown, ctor: T): T {
        return applyMixinsForClass(ctor, ...mixins);
    };
}

export function mixinsProp<Mixins extends Array<Mixin<string, AnyObject>>>(...mixins: Mixins) {
    return (target: object, property: 'mixins'): void => {
        applyMixins(target, mixins);
    };
}


