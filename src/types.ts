/* tslint:disable:max-line-length */
import {AnyObject, ArrayValues, MergeAll, MergeAllAdvanced, MergeOmit, UnionToIntersection} from "./common.types";

export interface IMixinBase<Name extends string> {
    mixinName: Name;
    init?(): void;
    setup?(): AnyObject; // todo
    target: MixinTarget<IMixinBase<Name>>;
}


export type Mixin<Name extends string, Config extends AnyObject> = Config & IMixinBase<Name>;
export type MixinFull<Name extends string, Config extends AnyObject> = Omit<IMixinBase<Name>, 'target'> & Config & {target: AnyObject & IUseMixins<[Mixin<Name, Config>]>};
export type MixinThis<Config extends AnyObject> = MixinFull<any, Config>;

type MakeMixinItem<X> =
    X extends IMixinBase<infer Name>
        ? Record<Name, X>
        : never;


export type MixinsProp<items extends ReadonlyArray<Mixin<any, any>>> =
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


// tslint:disable-next-line:interface-over-type-literal
export type UserMixinsMarker<Mixins extends Array<Mixin<any, any>>> = {__used_mixins: Mixins};

export type ClearMixin<M extends Mixin<any, any>> = Omit<M, 'mixinName' | 'target' | 'init' | 'setup' | '__used_mixins'>;
export type IUseMixins<Mixins extends Array<Mixin<any, any>>> = ClearMixin<MergeAll<Mixins>> & {mixins: MixinsProp<Mixins>} & {__used_mixins: Mixins};
// export type IUseMixinsComplex<Mixins extends Array<Mixin<any, any>>> = ClearMixin<MergeAll<Mixins>> & {mixins: MixinsProp<Mixins>} & {__used_mixins: Mixins};
// export type IUseMixinsSimple<Mixins extends Array<Mixin<any, any>>> = ClearMixin<MergeAll<Mixins>>;
export type IUseMixinsWithBase<
    Mixins extends Array<Mixin<any, any>>,
    BaseMixins extends Array<Mixin<any, any>>,
> = (BaseMixins extends any[] ? {} : ClearMixin<MergeAll<BaseMixins>>) &
    Omit<ClearMixin<MergeAll<Mixins>>, keyof ClearMixin<MergeAll<BaseMixins>>> &
    {
        mixins: MixinsProp<BaseMixins> &
            Omit<MixinsProp<Mixins>, keyof MixinsProp<BaseMixins>>;
    }
    & {__used_mixins: AppendsIfNotExist<BaseMixins, Mixins>}
;

export type MixinTarget<M extends Mixin<any, any> = never> = AnyObject & IUseMixins<M extends Mixin<any, any> ? [M] : []>;
export type WithMixin<M extends Mixin<any, any>> = IUseMixins<[M]>;

// export type ExtractMixins<T> = T extends IUseMixins<infer Mixins> ? Mixins : never;
export type ExtractMixins<T extends AnyObject> = T extends {__used_mixins: infer Mixins} ? Mixins : [];
// export type ExtractMixins<T extends AnyObject> = {
//     'array': ExtractMixins__<T>,
//     'plain': ExtractMixins__<T>,
// }[ExtractMixins__<T> extends any[] ? 'array' : 'plain'];
//
// type ExtractMixins__<T extends AnyObject> = T extends {__used_mixins: infer Mixins} ? Mixins : [];

export const mixinsAfterInit = '__afterMixins';

export interface IMixinAfterInitHandler {
    [mixinsAfterInit]: () => void;
}


////////////////

import {A, B, C, F, I, N, O, S, T, U, L} from 'ts-toolbelt';

type AppendIfNotExistSingle<Source extends L.List, Value extends any> = L.Includes<Source, Value> extends 1 ? Source : L.Append<Source, Value>;

export type AppendsIfNotExist<Source extends readonly any[], Values extends readonly any[]> = {
    "-": Source,
    // @ts-ignore
    "+": ((...args: Values) => any) extends ((v: infer Value, ...xs: infer _Values) => any)
        ? AppendsIfNotExist<AppendIfNotExistSingle<Source, Value>, _Values>
        : never,
}[Values extends [] ? '-' : '+'];

//
// type a = {a: 'a'};
// type b = {b: 'b'};
// type c = {c: 'c'};
// type d = {d: 'd'};
// type e = {e: 'e'};
//
// type MA = [a, b];
// type MB = [b];
// type MC = [a, c, d, e];
//
// type P = AppendIfNotExistSingle<MA, L.Last<MC>>;
// type P2 = AppendsIfNotExist<MA, MC>;
//





















