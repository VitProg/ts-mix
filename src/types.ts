/* tslint:disable:max-line-length */
import {
    AnyObject,
    ArrayValues, MergeAllRevert,
    UnionToIntersection,
} from "./common.types";

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


export type MixinsProp<Mixins extends ReadonlyArray<Mixin<any, any>>> =
    UnionToIntersection<ArrayValues<{ [i in keyof Mixins]: MakeMixinItem<Mixins[i]> }> & AnyObject & {__mixins: Mixins}>;

export type MixinsPropWithBase<items extends ReadonlyArray<Mixin<any, any>>, itemsBase extends ReadonlyArray<Mixin<any, any>>> =
    UnionToIntersection<
        ArrayValues<{ [i in keyof itemsBase]: MakeMixinItem<itemsBase[i]> }> |
        ArrayValues<{ [i in keyof items]: MakeMixinItem<items[i]> }>
    > & AnyObject & {__mixins: items};


export type ClearMixin<M extends Mixin<any, any>, RemoveKeys extends string | number | symbol = never> =
    RemoveKeys extends keyof M ?
        Omit<M, 'mixinName' | 'target' | 'init' | 'setup' | '__used_mixins' | RemoveKeys> :
        Omit<M, 'mixinName' | 'target' | 'init' | 'setup' | '__used_mixins'>;

export type ClearClassWithMixins<M extends AnyObject> = Omit<M, '__used_mixins' | 'mixins'>;

export type IUseMixins<Mixins extends Array<Mixin<any, any>>, Class extends AnyObject = never> =
    ClearMixin<MergeAllRevert<Mixins>, keyof Class> & {mixins: MixinsProp<Mixins>} & {__used_mixins: Mixins};


type WriteableArray<T extends ReadonlyArray<any>> = T[number];

export type IUseMixinsWithBase<
    Mixins extends Array<Mixin<any, any>>,
    BaseMixins extends Array<Mixin<any, any>>,
    Class extends AnyObject = {},
> = ClearClassWithMixins<Class> & IUseMixinsWithBase__inner<BaseMixins, Mixins, keyof Class>;
    //ClearMixin<MergeAllRevert<WriteableArray<AppendIfNotExistSingle<BaseMixins, Mixins>>>, keyof Class> & {mixins: MixinsProp<Mixins>} & {__used_mixins: Mixins} & {___ASd: AppendIfNotExistSingle<BaseMixins, Mixins>};

export type IUseMixinsWithBase__inner<
    Mixins extends Array<Mixin<any, any>>,
    BaseMixins extends Array<Mixin<any, any>>,
    RemoveKeys extends string | number | symbol,
> = ClearMixin<MergeAllRevert<[MergeAllRevert<BaseMixins>, MergeAllRevert<Mixins>]>, RemoveKeys> &
    {mixins: MixinsPropWithBase<Mixins, BaseMixins>} &
    {
        __used_mixins: AppendIfNotExistSingle<Mixins, BaseMixins[number]>,
    } & {
        ___Asd: {
            bm: MergeAllRevert<BaseMixins>,
            m: MergeAllRevert<Mixins>,
            ma_: [MergeAllRevert<BaseMixins>, MergeAllRevert<Mixins>]
            mall: MergeAllRevert<[MergeAllRevert<BaseMixins>, MergeAllRevert<Mixins>]>,
            mallclear: ClearMixin<MergeAllRevert<[MergeAllRevert<BaseMixins>, MergeAllRevert<Mixins>]>, RemoveKeys>
    },
};

// export type MixinsPropWithBasic =
//
// export type IUseMixinsWithBase__inner2<

// > = (BaseMixins extends any[] ? {} : ClearMixin<MergeAllRevert<BaseMixins>>) &
//     Omit<ClearMixin<MergeAllRevert<Mixins>>, keyof ClearMixin<MergeAllRevert<BaseMixins>>> &
//     {
//         mixins: MixinsProp<BaseMixins> &
//             Omit<MixinsProp<Mixins>, keyof MixinsProp<BaseMixins>>;
//     }
//     & {__used_mixins: AppendsIfNotExist<BaseMixins, Mixins>}
// ;

export type MixinTarget<M extends Mixin<any, any> = never> = AnyObject & IUseMixins<M extends Mixin<any, any> ? [M] : []>;


export type ExtractMixins<T extends AnyObject> = T extends {__used_mixins: infer Mixins} ? Mixins : [];

export const mixinsAfterInit = '__afterMixins';

export interface IMixinAfterInitHandler {
    [mixinsAfterInit]: () => void;
}


////////////////

import {L} from 'ts-toolbelt';

type AppendIfNotExistSingle<Source extends L.List, Value extends any> = L.Includes<Source, Value> extends 1 ? Source : L.Append<Source, Value>;

export type AppendsIfNotExist<Source extends readonly any[], Values extends readonly any[]> = {
    "-": Source,
    // @ts-ignore
    "+": ((...args: Values) => any) extends ((v: infer Value, ...xs: infer _Values) => any)
        ? AppendsIfNotExist<AppendIfNotExistSingle<Source, Value>, _Values>
        : never,
}[Values extends [] ? '-' : '+'];

export class MixinAssertError extends Error {}





















