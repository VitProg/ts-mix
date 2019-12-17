export declare type AnyObject = Record<string, any>;
export declare type ArrayValues<obj extends any[]> = obj[number];
export declare type UnionToIntersection<Union> = (Union extends any ? (x: Union) => void : never) extends ((x: infer intersection) => void) ? intersection : never;
export declare type MergeOmit<A, B> = Omit<A, keyof B> & B;
export declare type MergeAll<Arr extends any[]> = ((...a: Arr) => 0) extends ((x: infer X, ...xs: infer Xs) => 0) ? (Xs extends any[] ? MergeOmit<X, depth1<Xs>> : X) : never;
declare type depth1<Arr extends any[]> = ((...a: Arr) => 0) extends ((x: infer X, ...xs: infer Xs) => 0) ? (Xs extends any[] ? MergeOmit<X, depth2<Xs>> : X) : never;
declare type depth2<Arr extends any[]> = ((...a: Arr) => 0) extends ((x: infer X, ...xs: infer Xs) => 0) ? (Xs extends any[] ? MergeOmit<X, depth3<Xs>> : X) : never;
declare type depth3<Arr extends any[]> = ((...a: Arr) => 0) extends ((x: infer X, ...xs: infer Xs) => 0) ? (Xs extends any[] ? MergeOmit<X, depth4<Xs>> : X) : never;
declare type depth4<Arr extends any[]> = ((...a: Arr) => 0) extends ((x: infer X, ...xs: infer Xs) => 0) ? (Xs extends any[] ? MergeOmit<X, depth5<Xs>> : X) : never;
declare type depth5<Arr extends any[]> = ((...a: Arr) => 0) extends ((x: infer X, ...xs: infer Xs) => 0) ? (Xs extends any[] ? MergeOmit<X, depth_<Xs>> : X) : never;
declare type depth_<Arr extends any[]> = ((...a: Arr) => 0) extends ((x: infer X, ...xs: infer Xs) => 0) ? X : never;
export declare type Constructor<T> = new (...args: any[]) => T;
export {};