/* tslint:disable:max-line-length */
import {AnyObject, ArrayValues, MergeAll, MergeOmit, UnionToIntersection} from "./common.types";

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

// export type MixinsProp<Mixins extends Array<Mixin<any, any>>> =
//     ((...a: Mixins) => 0) extends ((x: Mixin<infer Name1, infer Conf1>, ...xs: infer More) => 0) ?
//         depth1<More, Record<Name1, Mixin<Name1, Conf1>>> : never;
//
// type depth1<Mixins extends Array<Mixin<any, any>>, Last extends Record<string, Mixin<any, any>>> =
//     ((...a: Mixins) => 0) extends ((x: Mixin<infer Name1, infer Conf1>, ...xs: infer More) => 0) ?
//         depth2<More, Last & Record<Name1, Mixin<Name1, Conf1>>> : never;
//
// type depth2<Mixins extends Array<Mixin<any, any>>, Last extends Record<string, Mixin<any, any>>> =
//     ((...a: Mixins) => 0) extends ((x: Mixin<infer Name1, infer Conf1>, ...xs: infer More) => 0) ?
//         depth3<More, Last & Record<Name1, Mixin<Name1, Conf1>>> : never;
//
// type depth3<Mixins extends Array<Mixin<any, any>>, Last extends Record<string, Mixin<any, any>>> =
//     ((...a: Mixins) => 0) extends ((x: Mixin<infer Name1, infer Conf1>, ...xs: infer More) => 0) ?
//         depth_<More, Last & Record<Name1, Mixin<Name1, Conf1>>> : never;
//
// type depth_<Mixins extends Array<Mixin<any, any>>, Last extends Record<string, Mixin<any, any>>> =
//     ((...a: Mixins) => 0) extends ((x: Mixin<infer Name1, infer Conf1>, ...xs: infer More) => 0) ?
//         Last & Record<Name1, Mixin<Name1, Conf1>> : never;

// export type MixinsProp<Mixins extends Array<Mixin<any, any>>> =
//     ((...a: Mixins) => 0) extends ((x: infer M, ...xs: infer More) => 0) ?
//         M extends Mixin<infer Name, infer Config> ?
//             depth1<More, Record<Name, M>> : never : never;
// type depth1<Mixins extends Array<Mixin<any, any>>, Last extends Record<string, Mixin<any, any>>> =
//     ((...a: Mixins) => 0) extends ((x: infer M, ...xs: infer More) => 0) ?
//         M extends Mixin<infer Name, infer Config> ?
//             depth2<More, Last & Record<Name, M>> : Last : never;
// type depth2<Mixins extends Array<Mixin<any, any>>, Last extends Record<string, Mixin<any, any>>> =
//     ((...a: Mixins) => 0) extends ((x: infer M, ...xs: infer More) => 0) ?
//         M extends Mixin<infer Name, infer Config> ?
//             depth3<More, Last & Record<Name, M>> : Last : never;
// type depth3<Mixins extends Array<Mixin<any, any>>, Last extends Record<string, Mixin<any, any>>> =
//     ((...a: Mixins) => 0) extends ((x: infer M, ...xs: infer More) => 0) ?
//         M extends Mixin<infer Name, infer Config> ?
//             depth4<More, Last & Record<Name, M>> : Last : never;
// type depth4<Mixins extends Array<Mixin<any, any>>, Last extends Record<string, Mixin<any, any>>> =
//     ((...a: Mixins) => 0) extends ((x: infer M, ...xs: infer More) => 0) ?
//         M extends Mixin<infer Name, infer Config> ?
//             depth_<More, Last & Record<Name, M>> : Last : never;
// type depth_<Mixins extends Array<Mixin<any, any>>, Last extends Record<string, Mixin<any, any>>> =
//     ((...a: Mixins) => 0) extends ((x: infer M, ...xs: infer More) => 0) ?
//         M extends Mixin<infer Name, infer Config> ?
//             Last & Record<Name, M> : Last : never;


type ClearMixin<M extends Mixin<any, any>> = Omit<M, 'mixinName' | 'target' | 'init'>;
export type IUseMixins<Mixins extends Array<Mixin<any, any>>> = ClearMixin<MergeAll<Mixins>> & {mixins: MixinsProp<Mixins>};

export type MixinTarget<M extends Mixin<any, any> = never> = AnyObject & IUseMixins<M extends Mixin<any, any> ? [M] : []>;
export type WithMixin<M extends Mixin<any, any>> = IUseMixins<[M]>;


