export declare type AnyObject = Record<string, any>;
export declare type ArrayValues<obj extends any[]> = obj[number];
export declare type UnionToIntersection<Union> = (Union extends any ? (x: Union) => void : never) extends ((x: infer intersection) => void) ? intersection : never;
export declare type Merge<A, B> = Omit<A, keyof B> & B;
export declare type MergeAll<Arr extends any[]> = {
    empty: {};
    cons: ((...args: Arr) => any) extends ((x: infer X, ...xs: infer Xs) => any) ? Merge<X, MergeAll<Xs>> : never;
}[Arr extends [] ? {} : 'cons'];
export declare type Constructor<T> = new (...args: any[]) => T;
