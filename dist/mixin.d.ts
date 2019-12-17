import { IUseMixins, Mixin, MixinFull } from "./types";
import { AnyObject, Constructor } from "./common.types";
declare type ConfigComplex<Name extends string, Config extends AnyObject, PartialKeys extends Array<keyof Config> = []> = PartialBy<Config, OR<PartialKeys>> & {
    mixinName: Name;
    init?: () => void;
} & (OR<PartialKeys> extends never ? {} : {
    setup: () => Required<Pick<Config, OR<PartialKeys>>>;
});
declare type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
declare type OR<T extends ReadonlyArray<any>> = T[number];
export declare function mixin<Name extends string, Config extends AnyObject, PartialKeys extends Array<keyof Config> = []>(config: (Config | ConfigComplex<Name, Config, PartialKeys>) & ThisType<MixinFull<Name, Config>>): MixinFull<Name, Config>;
export declare function applyMixinsForClass<Mixins extends Array<Mixin<string, AnyObject>>, T extends Constructor<AnyObject>>(targetClass: T, ...mixins: Mixins): Constructor<InstanceType<T> & IUseMixins<Mixins>> & T;
export declare function applyMixinsForObject<T extends AnyObject, Mixins extends Array<Mixin<string, AnyObject>>>(target: T, ...mixins: Mixins): T & IUseMixins<Mixins>;
export declare function applyMixins<T extends AnyObject, Mixins extends Array<Mixin<string, AnyObject>>>(target: T, mixins: Mixins): void;
export {};
