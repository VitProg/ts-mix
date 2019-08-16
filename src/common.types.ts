/* tslint:disable:max-line-length */
export type AnyObject = Record<string, any>;

export type ArrayValues<obj extends any[]> =
    obj[number];

export type UnionToIntersection<Union> =
    (Union extends any ? (x: Union) => void : never) extends ((x: infer intersection) => void)
        ? intersection
        : never;


export type MergeOmit<A, B> = Omit<A, keyof B> & B;
// export type MergeAll<Arr extends any[]> = {
//     empty: {},
//     cons: ((...args: Arr) => any) extends ((x: infer X, ...xs: infer Xs) => any)
//         ? Merge<X, MergeAll<Xs>>
//         : never,
// }[Arr extends [] ? {} : 'cons'];

// export type MergeAll<Arr extends any[]> =
//     ((...args: Arr) => any) extends ((x: infer X, ...xs: infer Xs) => any)
//         ? Merge<X, MergeAll_<Xs>>
//         : never;

/**
 * warning! length limit - 8 !!!
 */
export type MergeAll<Arr extends any[]> = ((...a: Arr) => 0) extends ((x: infer X, ...xs: infer Xs) => 0) ? (Xs extends any[] ? MergeOmit<X, depth1<Xs>> : X) : never;
type depth1<Arr extends any[]> = ((...a: Arr) => 0) extends ((x: infer X, ...xs: infer Xs) => 0) ? (Xs extends any[] ? MergeOmit<X, depth2<Xs>> : X) : never;
type depth2<Arr extends any[]> = ((...a: Arr) => 0) extends ((x: infer X, ...xs: infer Xs) => 0) ? (Xs extends any[] ? MergeOmit<X, depth3<Xs>> : X) : never;
type depth3<Arr extends any[]> = ((...a: Arr) => 0) extends ((x: infer X, ...xs: infer Xs) => 0) ? (Xs extends any[] ? MergeOmit<X, depth4<Xs>> : X) : never;
type depth4<Arr extends any[]> = ((...a: Arr) => 0) extends ((x: infer X, ...xs: infer Xs) => 0) ? (Xs extends any[] ? MergeOmit<X, depth5<Xs>> : X) : never;
type depth5<Arr extends any[]> = ((...a: Arr) => 0) extends ((x: infer X, ...xs: infer Xs) => 0) ? (Xs extends any[] ? MergeOmit<X, depth6<Xs>> : X) : never;
type depth6<Arr extends any[]> = ((...a: Arr) => 0) extends ((x: infer X, ...xs: infer Xs) => 0) ? (Xs extends any[] ? MergeOmit<X, depth_<Xs>> : X) : never;
type depth_<Arr extends any[]> = ((...a: Arr) => 0) extends ((x: infer X, ...xs: infer Xs) => 0) ? X : never;

export type Constructor<T> = new (...args: any[]) => T;
