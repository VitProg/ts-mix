import { AnyObject, ArrayValues, MergeAll, UnionToIntersection } from "./common.types";
export interface IMixinBase<Name extends string> {
    mixinName: Name;
    init?(): void;
    setup?(): AnyObject;
    target: MixinTarget<IMixinBase<Name>>;
}
export declare type Mixin<Name extends string, Config extends AnyObject> = Config & IMixinBase<Name>;
export declare type MixinFull<Name extends string, Config extends AnyObject> = Omit<IMixinBase<Name>, 'target'> & Config & {
    target: AnyObject & IUseMixins<[Mixin<Name, Config>]>;
};
export declare type MixinThis<Config extends AnyObject> = MixinFull<any, Config>;
declare type MakeMixinItem<X> = X extends IMixinBase<infer Name> ? Record<Name, X> : never;
export declare type MixinsProp<items extends Array<Mixin<any, any>>> = UnionToIntersection<ArrayValues<{
    [i in keyof items]: MakeMixinItem<items[i]>;
}>>;
export declare type ClearMixin<M extends Mixin<any, any>> = Omit<M, 'mixinName' | 'target' | 'init' | 'setup'>;
export declare type IUseMixins<Mixins extends Array<Mixin<any, any>>> = ClearMixin<MergeAll<Mixins>> & {
    mixins: MixinsProp<Mixins>;
};
export declare type MixinTarget<M extends Mixin<any, any> = never> = AnyObject & IUseMixins<M extends Mixin<any, any> ? [M] : []>;
export declare type WithMixin<M extends Mixin<any, any>> = IUseMixins<[M]>;
export declare const mixinsAfterInit = "__afterMixins";
export interface IMixinAfterInitHandler {
    [mixinsAfterInit]: () => void;
}
export {};
