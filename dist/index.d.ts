declare module "common.types" {
    export type AnyObject = Record<string, any>;
    export type ArrayValues<obj extends any[]> = obj[number];
    export type UnionToIntersection<Union> = (Union extends any ? (x: Union) => void : never) extends ((x: infer intersection) => void) ? intersection : never;
    export type MergeOmit<A, B> = Omit<A, keyof B> & B;
    export type MergeAll<Arr extends any[]> = ((...a: Arr) => 0) extends ((x: infer X, ...xs: infer Xs) => 0) ? (Xs extends any[] ? MergeOmit<X, depth1<Xs>> : X) : never;
    type depth1<Arr extends any[]> = ((...a: Arr) => 0) extends ((x: infer X, ...xs: infer Xs) => 0) ? (Xs extends any[] ? MergeOmit<X, depth2<Xs>> : X) : never;
    type depth2<Arr extends any[]> = ((...a: Arr) => 0) extends ((x: infer X, ...xs: infer Xs) => 0) ? (Xs extends any[] ? MergeOmit<X, depth3<Xs>> : X) : never;
    type depth3<Arr extends any[]> = ((...a: Arr) => 0) extends ((x: infer X, ...xs: infer Xs) => 0) ? (Xs extends any[] ? MergeOmit<X, depth4<Xs>> : X) : never;
    type depth4<Arr extends any[]> = ((...a: Arr) => 0) extends ((x: infer X, ...xs: infer Xs) => 0) ? (Xs extends any[] ? MergeOmit<X, depth5<Xs>> : X) : never;
    type depth5<Arr extends any[]> = ((...a: Arr) => 0) extends ((x: infer X, ...xs: infer Xs) => 0) ? (Xs extends any[] ? MergeOmit<X, depth_<Xs>> : X) : never;
    type depth_<Arr extends any[]> = ((...a: Arr) => 0) extends ((x: infer X, ...xs: infer Xs) => 0) ? X : never;
    export type Constructor<T> = new (...args: any[]) => T;
}
declare module "types" {
    import { AnyObject, ArrayValues, MergeAll, UnionToIntersection } from "common.types";
    export interface IMixinBase<Name extends string> {
        mixinName: Name;
        init?(): void;
        setup?(): AnyObject;
        target: MixinTarget<IMixinBase<Name>>;
    }
    export type Mixin<Name extends string, Config extends AnyObject> = Config & IMixinBase<Name>;
    export type MixinFull<Name extends string, Config extends AnyObject> = Omit<IMixinBase<Name>, 'target'> & Config & {
        target: AnyObject & IUseMixins<[Mixin<Name, Config>]>;
    };
    export type MixinThis<Config extends AnyObject> = MixinFull<any, Config>;
    type MakeMixinItem<X> = X extends IMixinBase<infer Name> ? Record<Name, X> : never;
    export type MixinsProp<items extends Array<Mixin<any, any>>> = UnionToIntersection<ArrayValues<{
        [i in keyof items]: MakeMixinItem<items[i]>;
    }>>;
    export type ClearMixin<M extends Mixin<any, any>> = Omit<M, 'mixinName' | 'target' | 'init' | 'setup'>;
    export type IUseMixins<Mixins extends Array<Mixin<any, any>>> = ClearMixin<MergeAll<Mixins>> & {
        mixins: MixinsProp<Mixins>;
    };
    export type MixinTarget<M extends Mixin<any, any> = never> = AnyObject & IUseMixins<M extends Mixin<any, any> ? [M] : []>;
    export type WithMixin<M extends Mixin<any, any>> = IUseMixins<[M]>;
    export const mixinsAfterInit = "__afterMixins";
    export interface IMixinAfterInitHandler {
        [mixinsAfterInit]: () => void;
    }
}
declare module "mixin" {
    import { IUseMixins, Mixin, MixinFull } from "types";
    import { AnyObject, Constructor } from "common.types";
    type ConfigComplex<Name extends string, Config extends AnyObject, PartialKeys extends Array<keyof Config> = []> = PartialBy<Config, OR<PartialKeys>> & {
        mixinName: Name;
        init?: () => void;
    } & (OR<PartialKeys> extends never ? {} : {
        setup: () => Required<Pick<Config, OR<PartialKeys>>>;
    });
    type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
    type OR<T extends ReadonlyArray<any>> = T[number];
    export function mixin<Name extends string, Config extends AnyObject, PartialKeys extends Array<keyof Config> = []>(config: (Config | ConfigComplex<Name, Config, PartialKeys>) & ThisType<MixinFull<Name, Config>>): MixinFull<Name, Config>;
    export function applyMixinsForClass<Mixins extends Array<Mixin<string, AnyObject>>, T extends Constructor<AnyObject>>(targetClass: T, ...mixins: Mixins): Constructor<InstanceType<T> & IUseMixins<Mixins>> & T;
    export function applyMixinsForObject<T extends AnyObject, Mixins extends Array<Mixin<string, AnyObject>>>(target: T, ...mixins: Mixins): T & IUseMixins<Mixins>;
    export function applyMixins<T extends AnyObject, Mixins extends Array<Mixin<string, AnyObject>>>(target: T, mixins: Mixins): void;
}
declare module "decorators" {
    import { Mixin } from "types";
    import { AnyObject, Constructor } from "common.types";
    export function use<Mixins extends Array<Mixin<string, AnyObject>>>(...mixins: Mixins): <T extends Constructor<Record<string, any>>>(this: unknown, ctor: T) => Constructor<InstanceType<T> & Pick<import("common.types").MergeAll<Mixins>, Exclude<keyof import("common.types").MergeAll<Mixins>, "mixinName" | "target" | "init" | "setup">> & {
        mixins: import("common.types").UnionToIntersection<{ [i in keyof Mixins]: Mixins[i] extends import("types").IMixinBase<infer Name> ? Record<Name, Mixins[i]> : never; }[number]>;
    }> & T;
    export function useProxy<Mixins extends Array<Mixin<string, AnyObject>>>(...mixins: Mixins): <T extends Constructor<Record<string, any>>>(this: unknown, ctor: T) => T;
}
declare module "type-guards" {
    import { IMixinBase, IUseMixins, Mixin, WithMixin } from "types";
    export function haveMixin<M extends Mixin<any, any>>(v: any, mixin: M): v is WithMixin<M>;
    export function haveMixins<Mixins extends Array<Mixin<any, any>>>(v: any, ...mixins: Mixins): v is IUseMixins<Mixins>;
    export function isMixin<M extends IMixinBase<any> = IMixinBase<any>>(value: any): value is M;
}
declare module "index" {
    export { IUseMixins, Mixin, MixinFull, MixinThis, IMixinBase, MixinsProp, WithMixin, MixinTarget } from "types";
    export { MergeAll, UnionToIntersection, ArrayValues, MergeOmit } from "common.types";
    export { use, useProxy } from "decorators";
    export { haveMixins, haveMixin } from "type-guards";
    export { mixin, applyMixinsForObject, applyMixinsForClass } from "mixin";
}
