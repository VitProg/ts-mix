export type AnyObject = Record<string, any>;

export type ArrayValues<obj extends any[]> =
    obj[number];

export type UnionToIntersection<Union> =
    (Union extends any ? (x: Union) => void : never) extends ((x: infer intersection) => void)
        ? intersection
        : never;


export type Merge<A, B> = Omit<A, keyof B> & B;
export type MergeAll<Arr extends any[]> = {
    empty: {},
    cons: ((...args: Arr) => any) extends ((x: infer X, ...xs: infer Xs) => any)
        ? Merge<X, MergeAll<Xs>>
        : never,
}[Arr extends [] ? {} : 'cons'];


export type Constructor<T> = new (...args: any[]) => T;
