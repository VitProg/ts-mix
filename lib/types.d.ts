import { AnyObject, ArrayValues, MergeAll, UnionToIntersection } from "./common.types";
interface IMixinBase<Name extends string> {
    mixinName: Name;
    init(target: AnyObject): void;
    target: AnyObject;
}
export declare type Mixin<Name extends string, Config extends AnyObject> = IMixinBase<Name> & Config;
declare type MakeMixinItem<X> = X extends IMixinBase<infer Name> ? Record<Name, X> : never;
export declare type MixinsProp<items extends Array<Mixin<any, any>>> = UnionToIntersection<ArrayValues<{
    [i in keyof items]: MakeMixinItem<items[i]>;
}>>;
declare type ClearMixin<M extends Mixin<any, any>> = Omit<M, 'mixinName' | 'target' | 'init'>;
export declare type IUseMixins<Mixins extends Array<Mixin<any, any>>> = ClearMixin<MergeAll<Mixins>> & {
    mixins: MixinsProp<Mixins>;
};
export declare type MixinTarget = AnyObject & IUseMixins<[]>;
export declare type WithMixin<M extends Mixin<any, any>> = IUseMixins<[M]>;
export {};
