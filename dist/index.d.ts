declare type AnyObject = Record<string, any>;
declare type ArrayValues<obj extends any[]> = obj[number];
declare type UnionToIntersection<Union> = (Union extends any ? (x: Union) => void : never) extends ((x: infer intersection) => void) ? intersection : never;
declare type MergeOmit<A, B> = Omit<A, keyof B> & B;
declare type MergeAll<Arr extends any[]> = ((...a: Arr) => 0) extends ((x: infer X, ...xs: infer Xs) => 0) ? (Xs extends any[] ? MergeOmit<X, depth1<Xs>> : X) : never;
declare type depth1<Arr extends any[]> = ((...a: Arr) => 0) extends ((x: infer X, ...xs: infer Xs) => 0) ? (Xs extends any[] ? MergeOmit<X, depth2<Xs>> : X) : never;
declare type depth2<Arr extends any[]> = ((...a: Arr) => 0) extends ((x: infer X, ...xs: infer Xs) => 0) ? (Xs extends any[] ? MergeOmit<X, depth3<Xs>> : X) : never;
declare type depth3<Arr extends any[]> = ((...a: Arr) => 0) extends ((x: infer X, ...xs: infer Xs) => 0) ? (Xs extends any[] ? MergeOmit<X, depth4<Xs>> : X) : never;
declare type depth4<Arr extends any[]> = ((...a: Arr) => 0) extends ((x: infer X, ...xs: infer Xs) => 0) ? (Xs extends any[] ? MergeOmit<X, depth5<Xs>> : X) : never;
declare type depth5<Arr extends any[]> = ((...a: Arr) => 0) extends ((x: infer X, ...xs: infer Xs) => 0) ? (Xs extends any[] ? MergeOmit<X, depth_<Xs>> : X) : never;
declare type depth_<Arr extends any[]> = ((...a: Arr) => 0) extends ((x: infer X, ...xs: infer Xs) => 0) ? X : never;
declare type Constructor<T> = new (...args: any[]) => T;

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
declare type MixinsProp<items extends Array<Mixin<any, any>>> = UnionToIntersection<ArrayValues<{
    [i in keyof items]: MakeMixinItem<items[i]>;
}>>;
declare type ClearMixin<M extends Mixin<any, any>> = Omit<M, 'mixinName' | 'target' | 'init' | 'setup'>;
declare type IUseMixins<Mixins extends Array<Mixin<any, any>>> = ClearMixin<MergeAll<Mixins>> & {
    mixins: MixinsProp<Mixins>;
};
declare type MixinTarget<M extends Mixin<any, any> = never> = AnyObject & IUseMixins<M extends Mixin<any, any> ? [M] : []>;
declare type WithMixin<M extends Mixin<any, any>> = IUseMixins<[M]>;

declare function use<Mixins extends Array<Mixin<string, AnyObject>>>(...mixins: Mixins): <T extends Constructor<Record<string, any>>>(this: unknown, ctor: T) => T;
declare function useProxy<Mixins extends Array<Mixin<string, AnyObject>>>(...mixins: Mixins): <T extends Constructor<Record<string, any>>>(this: unknown, ctor: T) => T;

declare function haveMixin<M extends Mixin<any, any>>(v: any, mixin: M): v is WithMixin<M>;
declare function haveMixins<Mixins extends Array<Mixin<any, any>>>(v: any, ...mixins: Mixins): v is IUseMixins<Mixins>;

declare type ConfigComplex<Name extends string, Config extends AnyObject, PartialKeys extends Array<keyof Config> = []> = PartialBy<Config, OR<PartialKeys>> & {
    mixinName: Name;
    init?: () => void;
} & (OR<PartialKeys> extends never ? {} : {
    setup: () => Required<Pick<Config, OR<PartialKeys>>>;
});
declare type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
declare type OR<T extends ReadonlyArray<any>> = T[number];
declare function mixin<Name extends string, Config extends AnyObject, PartialKeys extends Array<keyof Config> = []>(config: (Config | ConfigComplex<Name, Config, PartialKeys>) & ThisType<MixinFull<Name, Config>>): MixinFull<Name, Config>;
declare function applyMixinsForClass<Mixins extends Array<Mixin<string, AnyObject>>, T extends Constructor<AnyObject>>(targetClass: T, ...mixins: Mixins): Constructor<InstanceType<T> & IUseMixins<Mixins>> & T;
declare function applyMixinsForObject<T extends AnyObject, Mixins extends Array<Mixin<string, AnyObject>>>(target: T, ...mixins: Mixins): T & IUseMixins<Mixins>;

export { ArrayValues, IMixinBase, IUseMixins, MergeAll, MergeOmit, Mixin, MixinFull, MixinTarget, MixinThis, MixinsProp, UnionToIntersection, WithMixin, applyMixinsForClass, applyMixinsForObject, haveMixin, haveMixins, mixin, use, useProxy };
