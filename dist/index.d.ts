import { N, L } from 'ts-toolbelt';

declare type AnyObject = Record<string, any>;
declare type ArrayValues<obj extends any[] | ReadonlyArray<any>> = obj[number];
declare type UnionToIntersection<Union> = (Union extends any ? (x: Union) => void : never) extends ((x: infer intersection) => void) ? intersection : never;
declare type MergeOmit<A, B> = Omit<A, keyof B> & B;
declare type MergeOmitRevert<A, B> = A & Omit<B, keyof A>;
declare type MergeAll<Arr extends any[]> = ((...a: Arr) => 0) extends ((x: infer X, ...xs: infer Xs) => 0) ? (Xs extends any[] ? MergeOmit<X, MergeAll_d1<Xs>> : X) : never;
declare type MergeAll_d1<Arr extends any[]> = ((...a: Arr) => 0) extends ((x: infer X, ...xs: infer Xs) => 0) ? (Xs extends any[] ? MergeOmit<X, MergeAll_d2<Xs>> : X) : never;
declare type MergeAll_d2<Arr extends any[]> = ((...a: Arr) => 0) extends ((x: infer X, ...xs: infer Xs) => 0) ? (Xs extends any[] ? MergeOmit<X, MergeAll_d3<Xs>> : X) : never;
declare type MergeAll_d3<Arr extends any[]> = ((...a: Arr) => 0) extends ((x: infer X, ...xs: infer Xs) => 0) ? (Xs extends any[] ? MergeOmit<X, MergeAll_d4<Xs>> : X) : never;
declare type MergeAll_d4<Arr extends any[]> = ((...a: Arr) => 0) extends ((x: infer X, ...xs: infer Xs) => 0) ? (Xs extends any[] ? MergeOmit<X, MergeAll_d5<Xs>> : X) : never;
declare type MergeAll_d5<Arr extends any[]> = ((...a: Arr) => 0) extends ((x: infer X, ...xs: infer Xs) => 0) ? (Xs extends any[] ? MergeOmit<X, MergeAll_d_<Xs>> : X) : never;
declare type MergeAll_d_<Arr extends any[]> = ((...a: Arr) => 0) extends ((x: infer X, ...xs: infer Xs) => 0) ? X : never;
declare type MergeAllRevert<Arr extends any[]> = ((...a: Arr) => 0) extends ((x: infer X, ...xs: infer Xs) => 0) ? (Xs extends any[] ? MergeOmitRevert<X, MergeAllRevert_d1<Xs>> : X) : never;
declare type MergeAllRevert_d1<Arr extends any[]> = ((...a: Arr) => 0) extends ((x: infer X, ...xs: infer Xs) => 0) ? (Xs extends any[] ? MergeOmitRevert<X, MergeAllRevert_d2<Xs>> : X) : never;
declare type MergeAllRevert_d2<Arr extends any[]> = ((...a: Arr) => 0) extends ((x: infer X, ...xs: infer Xs) => 0) ? (Xs extends any[] ? MergeOmitRevert<X, MergeAllRevert_d3<Xs>> : X) : never;
declare type MergeAllRevert_d3<Arr extends any[]> = ((...a: Arr) => 0) extends ((x: infer X, ...xs: infer Xs) => 0) ? (Xs extends any[] ? MergeOmitRevert<X, MergeAllRevert_d4<Xs>> : X) : never;
declare type MergeAllRevert_d4<Arr extends any[]> = ((...a: Arr) => 0) extends ((x: infer X, ...xs: infer Xs) => 0) ? (Xs extends any[] ? MergeOmitRevert<X, MergeAllRevert_d5<Xs>> : X) : never;
declare type MergeAllRevert_d5<Arr extends any[]> = ((...a: Arr) => 0) extends ((x: infer X, ...xs: infer Xs) => 0) ? (Xs extends any[] ? MergeOmitRevert<X, MergeAllRevert_d_<Xs>> : X) : never;
declare type MergeAllRevert_d_<Arr extends any[]> = ((...a: Arr) => 0) extends ((x: infer X, ...xs: infer Xs) => 0) ? X : never;
declare type Constructor<T, A extends any[] = any[]> = new (...args: A) => T;
declare type CP<T extends new (...args: any) => any> = T extends new (...args: infer P) => any ? P : [];
declare type CPN<T extends new (...args: any) => any, N extends number> = CP<T>[N];
declare type RewriteConstructorResult<BaseCtor extends new (...args: any) => any, NewType extends AnyObject, OmitFromBase extends keyof InstanceType<BaseCtor> = never> = RewriteConstructorResult_inner<BaseCtor, Omit<InstanceType<BaseCtor>, OmitFromBase> & NewType>;
declare type RewriteConstructorResult_inner<BaseCtor extends new (...args: any) => any, NewFinalType extends AnyObject> = {
    0: new () => NewFinalType;
    1: new (arg1: CPN<BaseCtor, 0>) => NewFinalType;
    2: new (arg1: CPN<BaseCtor, 0>, arg2: CPN<BaseCtor, 1>) => NewFinalType;
    3: new (arg1: CPN<BaseCtor, 0>, arg2: CPN<BaseCtor, 1>, arg3: CPN<BaseCtor, 2>) => NewFinalType;
    4: new (arg1: CPN<BaseCtor, 0>, arg2: CPN<BaseCtor, 1>, arg3: CPN<BaseCtor, 2>, arg4: CPN<BaseCtor, 3>) => NewFinalType;
    5: new (arg1: CPN<BaseCtor, 0>, arg2: CPN<BaseCtor, 1>, arg3: CPN<BaseCtor, 2>, arg4: CPN<BaseCtor, 3>, arg5: CPN<BaseCtor, 4>) => NewFinalType;
    '_': new (...args: CP<BaseCtor>) => NewFinalType;
}[N.Greater<L.Length<CP<BaseCtor>>, '5'> extends '4' ? '_' : L.Length<CP<BaseCtor>>];

interface IMixinBase<Name extends string> {
    mixinName: Name;
    init?(): void;
    setup?(): AnyObject;
    target: MixinTarget<IMixinBase<Name>>;
}
declare type Mixin<Name extends string, Config extends AnyObject> = Config & IMixinBase<Name>;
declare type MixinFull<Name extends string, Config extends AnyObject> = Omit<IMixinBase<Name>, 'target'> & Config & {
    target: AnyObject & IUseMixins<[Mixin<Name, Config>]>;
};
declare type MixinThis<Config extends AnyObject> = MixinFull<any, Config>;
declare type MakeMixinItem<X> = X extends IMixinBase<infer Name> ? Record<Name, X> : never;
declare type MixinsProp<items extends ReadonlyArray<Mixin<any, any>>> = UnionToIntersection<ArrayValues<{
    [i in keyof items]: MakeMixinItem<items[i]>;
}>>;
declare type ClearMixin<M extends Mixin<any, any>, RemoveKeys extends keyof M = never> = Omit<Omit<M, 'mixinName' | 'target' | 'init' | 'setup' | '__used_mixins'>, RemoveKeys>;
declare type IUseMixins<Mixins extends Array<Mixin<any, any>>, Class extends AnyObject = {}> = ClearMixin<MergeAllRevert<Mixins>, keyof Class> & {
    mixins: MixinsProp<Mixins>;
} & {
    __used_mixins: Mixins;
};
declare type IUseMixinsWithBase<Mixins extends Array<Mixin<any, any>>, BaseMixins extends Array<Mixin<any, any>>> = (BaseMixins extends any[] ? {} : ClearMixin<MergeAllRevert<BaseMixins>>) & Omit<ClearMixin<MergeAllRevert<Mixins>>, keyof ClearMixin<MergeAllRevert<BaseMixins>>> & {
    mixins: MixinsProp<BaseMixins> & Omit<MixinsProp<Mixins>, keyof MixinsProp<BaseMixins>>;
} & {
    __used_mixins: AppendsIfNotExist<BaseMixins, Mixins>;
};
declare type MixinTarget<M extends Mixin<any, any> = never> = AnyObject & IUseMixins<M extends Mixin<any, any> ? [M] : []>;
declare type ExtractMixins<T extends AnyObject> = T extends {
    __used_mixins: infer Mixins;
} ? Mixins : [];
declare type AppendIfNotExistSingle<Source extends L.List, Value extends any> = L.Includes<Source, Value> extends 1 ? Source : L.Append<Source, Value>;
declare type AppendsIfNotExist<Source extends readonly any[], Values extends readonly any[]> = {
    "-": Source;
    "+": ((...args: Values) => any) extends ((v: infer Value, ...xs: infer _Values) => any) ? AppendsIfNotExist<AppendIfNotExistSingle<Source, Value>, _Values> : never;
}[Values extends [] ? '-' : '+'];
declare class MixinAssertError extends Error {
}

declare function use<Mixins extends Array<Mixin<string, AnyObject>>>(...mixins: Mixins): <T extends Constructor<Record<string, any>, any[]>>(this: unknown, ctor: T) => T;
declare function mixinsProp<Mixins extends Array<Mixin<string, AnyObject>>>(...mixins: Mixins): (target: object, property: "mixins") => void;

declare function UseMixins<Mixins extends Array<Mixin<string, AnyObject>>, ResultType = Constructor<IUseMixins<Mixins>>>(...mixins: Mixins): ResultType;
declare function UseMixinsExtends<Mixins extends Array<Mixin<string, AnyObject>>, BaseConstr extends Constructor<AnyObject>, BaseType extends InstanceType<BaseConstr>, BaseMixins extends ExtractMixins<BaseType>, ResultType extends RewriteConstructorResult<BaseConstr, IUseMixinsWithBase<Mixins, BaseMixins>, '__used_mixins'>>(baseClass: BaseConstr, ...mixins: Mixins): ResultType;

declare function haveMixin<M extends Mixin<any, any>, Class extends AnyObject = {}>(v: AnyObject, mixin: M, vClass?: Class): v is IUseMixins<[M], Class>;
declare function haveMixins<Mixins extends Array<Mixin<any, any>>, Class extends AnyObject = {}>(v: AnyObject, mixins: Mixins, vClass?: Class): v is IUseMixins<Mixins, Class>;
declare function isMixin<M extends IMixinBase<any> = IMixinBase<any>>(value: any): value is M;
declare function assertHaveMixin<M extends Mixin<any, any>, Class extends AnyObject = {}>(v: AnyObject, mixin: M, vClass?: Class, error?: string | Error): asserts v is IUseMixins<[M], typeof v>;
declare function assertHaveMixins<Mixins extends Array<Mixin<any, any>>, Class extends AnyObject = {}>(v: AnyObject, mixins: Mixins, vClass?: Class, error?: string | Error): asserts v is IUseMixins<Mixins, typeof v>;

declare type ConfigComplex<Name extends string, Config extends AnyObject, PartialKeys extends Array<keyof Config> = []> = PartialBy<Config, OR<PartialKeys>> & {
    mixinName: Name;
    init?: () => void;
} & (OR<PartialKeys> extends never ? {} : {
    setup: () => Required<Pick<Config, OR<PartialKeys>>>;
});
declare type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
declare type OR<T extends ReadonlyArray<any>> = T[number];
declare function mixin<Name extends string, Config extends AnyObject, PartialKeys extends Array<keyof Config> = []>(config: (Config | ConfigComplex<Name, Config, PartialKeys>) & ThisType<MixinFull<Name, Config>>): MixinFull<Name, Config>;
declare function applyMixinsForClass<Mixins extends Array<Mixin<string, AnyObject>>, T extends Constructor<AnyObject, any[]>>(targetClass: T, ...mixins: Mixins): Constructor<InstanceType<T> & IUseMixins<Mixins>> & T;
declare function applyMixinsForObject<T extends AnyObject, Mixins extends Array<Mixin<string, AnyObject>>>(target: T, ...mixins: Mixins): T & IUseMixins<Mixins>;

export { ArrayValues, IMixinBase, IUseMixins, MergeAll, MergeOmit, Mixin, MixinAssertError, MixinFull, MixinTarget, MixinThis, MixinsProp, UnionToIntersection, UseMixins, UseMixinsExtends, applyMixinsForClass, applyMixinsForObject, assertHaveMixin, assertHaveMixins, haveMixin, haveMixins, isMixin, mixin, mixinsProp, use };
