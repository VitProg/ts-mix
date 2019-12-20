/* tslint:disable:max-line-length */
export type AnyObject = Record<string, any>;

export type ArrayValues<obj extends any[] | ReadonlyArray<any>> =
    obj[number];

export type UnionToIntersection<Union> =
    (Union extends any ? (x: Union) => void : never) extends ((x: infer intersection) => void)
        ? intersection
        : never;


export type MergeOmit<A, B> = Omit<A, keyof B> & B;
export type MergeOmitRevert<A, B> = A & Omit<B, keyof A>;

// export type MergeAllAdvanced<Arr extends any[] | ReadonlyArray<any>> = {
//     empty: {},
//     cons: ((...args: Arr) => any) extends ((x: infer X, ...xs: infer Xs) => any)
//         ? MergeOmit<X, MergeAllAdvanced<Xs>>
//         : never,
// }[Arr extends [] ? {} : 'cons'];
//
// export type MergeAllAdvancedRevert<Arr extends any[] | ReadonlyArray<any>> = {
//     empty: {},
//     cons: ((...args: Arr) => any) extends ((x: infer X, ...xs: infer Xs) => any)
//         ? MergeOmitRevert<X, MergeAllAdvancedRevert<Xs>>
//         : never,
// }[Arr extends [] ? {} : 'cons'];


/**
 * warning! length limit - 6 !!!
 */
export type MergeAll<Arr extends any[]> = ((...a: Arr) => 0) extends ((x: infer X, ...xs: infer Xs) => 0) ? (Xs extends any[] ? MergeOmit<X, MergeAll_d1<Xs>> : X) : never;
type MergeAll_d1<Arr extends any[]> = ((...a: Arr) => 0) extends ((x: infer X, ...xs: infer Xs) => 0) ? (Xs extends any[] ? MergeOmit<X, MergeAll_d2<Xs>> : X) : never;
type MergeAll_d2<Arr extends any[]> = ((...a: Arr) => 0) extends ((x: infer X, ...xs: infer Xs) => 0) ? (Xs extends any[] ? MergeOmit<X, MergeAll_d3<Xs>> : X) : never;
type MergeAll_d3<Arr extends any[]> = ((...a: Arr) => 0) extends ((x: infer X, ...xs: infer Xs) => 0) ? (Xs extends any[] ? MergeOmit<X, MergeAll_d4<Xs>> : X) : never;
type MergeAll_d4<Arr extends any[]> = ((...a: Arr) => 0) extends ((x: infer X, ...xs: infer Xs) => 0) ? (Xs extends any[] ? MergeOmit<X, MergeAll_d5<Xs>> : X) : never;
type MergeAll_d5<Arr extends any[]> = ((...a: Arr) => 0) extends ((x: infer X, ...xs: infer Xs) => 0) ? (Xs extends any[] ? MergeOmit<X, MergeAll_d_<Xs>> : X) : never;
type MergeAll_d_<Arr extends any[]> = ((...a: Arr) => 0) extends ((x: infer X, ...xs: infer Xs) => 0) ? X : never;

export type MergeAllRevert<Arr extends any[]> = ((...a: Arr) => 0) extends ((x: infer X, ...xs: infer Xs) => 0) ? (Xs extends any[] ? MergeOmitRevert<X, MergeAllRevert_d1<Xs>> : X) : never;
type MergeAllRevert_d1<Arr extends any[]> = ((...a: Arr) => 0) extends ((x: infer X, ...xs: infer Xs) => 0) ? (Xs extends any[] ? MergeOmitRevert<X, MergeAllRevert_d2<Xs>> : X) : never;
type MergeAllRevert_d2<Arr extends any[]> = ((...a: Arr) => 0) extends ((x: infer X, ...xs: infer Xs) => 0) ? (Xs extends any[] ? MergeOmitRevert<X, MergeAllRevert_d3<Xs>> : X) : never;
type MergeAllRevert_d3<Arr extends any[]> = ((...a: Arr) => 0) extends ((x: infer X, ...xs: infer Xs) => 0) ? (Xs extends any[] ? MergeOmitRevert<X, MergeAllRevert_d4<Xs>> : X) : never;
type MergeAllRevert_d4<Arr extends any[]> = ((...a: Arr) => 0) extends ((x: infer X, ...xs: infer Xs) => 0) ? (Xs extends any[] ? MergeOmitRevert<X, MergeAllRevert_d5<Xs>> : X) : never;
type MergeAllRevert_d5<Arr extends any[]> = ((...a: Arr) => 0) extends ((x: infer X, ...xs: infer Xs) => 0) ? (Xs extends any[] ? MergeOmitRevert<X, MergeAllRevert_d_<Xs>> : X) : never;
type MergeAllRevert_d_<Arr extends any[]> = ((...a: Arr) => 0) extends ((x: infer X, ...xs: infer Xs) => 0) ? X : never;


export type Constructor<T, A extends any[] = any[]> = new (...args: A) => T;

type CP<T extends new (...args: any) => any> = T extends new (...args: infer P) => any ? P : [];
type CPN<T extends new (...args: any) => any, N extends number> = CP<T>[N];

import {N, L} from 'ts-toolbelt';


export type RewriteConstructorResult<
    BaseCtor extends new (...args: any) => any,
    NewType extends AnyObject,
    OmitFromBase extends keyof InstanceType<BaseCtor> = never
> = RewriteConstructorResult_inner<
    BaseCtor,
    Omit<InstanceType<BaseCtor>, OmitFromBase> & NewType
>;

type RewriteConstructorResult_inner<
    BaseCtor extends new (...args: any) => any,
    NewFinalType extends AnyObject
> = {
    0: new () => NewFinalType,
    1: new (arg1: CPN<BaseCtor, 0>) => NewFinalType,
    2: new (arg1: CPN<BaseCtor, 0>, arg2: CPN<BaseCtor, 1>) => NewFinalType,
    3: new (arg1: CPN<BaseCtor, 0>, arg2: CPN<BaseCtor, 1>, arg3: CPN<BaseCtor, 2>) => NewFinalType,
    4: new (arg1: CPN<BaseCtor, 0>, arg2: CPN<BaseCtor, 1>, arg3: CPN<BaseCtor, 2>, arg4: CPN<BaseCtor, 3>) => NewFinalType,
    5: new (arg1: CPN<BaseCtor, 0>, arg2: CPN<BaseCtor, 1>, arg3: CPN<BaseCtor, 2>, arg4: CPN<BaseCtor, 3>, arg5: CPN<BaseCtor, 4>) => NewFinalType,
    '_': new (...args: CP<BaseCtor>) => NewFinalType,
}[N.Greater<L.Length<CP<BaseCtor>>, '5'> extends '4' ? '_' : L.Length<CP<BaseCtor>>];
