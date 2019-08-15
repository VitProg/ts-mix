import {AnyObject, ArrayValues, MergeAll, UnionToIntersection} from "./common.types";

interface IMixinBase<Name extends string> {
    mixinName: Name;
    init(target: AnyObject): void;
    target: AnyObject;
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

export type MixinTarget = AnyObject & IUseMixins<[]>
export type WithMixin<M extends Mixin<any, any>> = IUseMixins<[M]>;
