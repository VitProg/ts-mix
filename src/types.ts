import {AnyObject, ArrayValues, UnionToIntersection} from "./common.types";

interface IMixinBase<Name extends string> {
    mixinName: Name;
    init?(): void;
    target: MixinTarget<IMixinBase<Name>>;
}


export type Mixin<Name extends string, Config extends AnyObject> = IMixinBase<Name> & Config;

type MakeMixinItem<X> =
    X extends IMixinBase<infer Name>
        ? Record<Name, X>
        : never;


export type MixinsProp<items extends Array<Mixin<any, any>>> =
    UnionToIntersection<ArrayValues<{ [i in keyof items]: MakeMixinItem<items[i]> }>>;


type ClearMixin<M extends Mixin<any, any>> = Omit<M, 'mixinName' | 'target' | 'init'>;
export type IUseMixins<Mixins extends Array<Mixin<any, any>>> = ClearMixin<MergeAll<Mixins>> & {mixins: MixinsProp<Mixins>};

export type MixinTarget<M extends Mixin<any, any> = never> = AnyObject & IUseMixins<M extends Mixin<any, any> ? [M] : []>;
export type WithMixin<M extends Mixin<any, any>> = IUseMixins<[M]>;


type Merge<A, B> = Omit<A, keyof B> & B;
type MergeAll<Arr extends any[]> = {
    empty: {},
    cons: ((...args: Arr) => any) extends ((x: infer X, ...xs: infer Xs) => any)
        ? Merge<X, MergeAll<Xs>>
        : never,
}[Arr extends [] ? {} : 'cons'];

