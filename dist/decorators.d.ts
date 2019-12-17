import { Mixin } from "./types";
import { AnyObject, Constructor } from "./common.types";
export declare function use<Mixins extends Array<Mixin<string, AnyObject>>>(...mixins: Mixins): <T extends Constructor<Record<string, any>>>(this: unknown, ctor: T) => Constructor<InstanceType<T> & Pick<import("./common.types").MergeAll<Mixins>, Exclude<keyof import("./common.types").MergeAll<Mixins>, "mixinName" | "target" | "init" | "setup">> & {
    mixins: import("./common.types").UnionToIntersection<{ [i in keyof Mixins]: Mixins[i] extends import("./types").IMixinBase<infer Name> ? Record<Name, Mixins[i]> : never; }[number]>;
}> & T;
export declare function useProxy<Mixins extends Array<Mixin<string, AnyObject>>>(...mixins: Mixins): <T extends Constructor<Record<string, any>>>(this: unknown, ctor: T) => T;
