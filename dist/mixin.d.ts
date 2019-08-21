import { IUseMixins, Mixin } from "./types";
import { AnyObject, Constructor } from "./common.types";
export declare function mixin<Name extends string, Config extends AnyObject>(config: Config & {
    mixinName: Name;
    init?: (this: Mixin<Name, Config>) => void;
}): Mixin<Name, Config>;
export declare function applyMixinsForClass<Mixins extends Array<Mixin<string, AnyObject>>, T extends Constructor<AnyObject>>(targetClass: T, ...mixins: Mixins): Constructor<InstanceType<T> & IUseMixins<Mixins>> & T;
export declare function applyMixinsForObject<T extends AnyObject, Mixins extends Array<Mixin<string, AnyObject>>>(target: T, ...mixins: Mixins): T & IUseMixins<Mixins>;
export declare function applyMixins<T extends AnyObject, Mixins extends Array<Mixin<string, AnyObject>>>(target: T, mixins: Mixins): void;
