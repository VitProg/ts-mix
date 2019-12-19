/* tslint:disable:max-line-length */
export type AnyObject = Record<string, any>;

export type ArrayValues<obj extends any[] | ReadonlyArray<any>> =
    obj[number];

export type UnionToIntersection<Union> =
    (Union extends any ? (x: Union) => void : never) extends ((x: infer intersection) => void)
        ? intersection
        : never;


export type MergeOmit<A, B> = Omit<A, keyof B> & B;
export type MergeAllAdvanced<Arr extends any[] | ReadonlyArray<any>> = {
    empty: {},
    cons: ((...args: Arr) => any) extends ((x: infer X, ...xs: infer Xs) => any)
        ? MergeOmit<X, MergeAllAdvanced<Xs>>
        : never,
}[Arr extends [] ? {} : 'cons'];

// export type MergeAll<Arr extends any[]> =
//     ((...args: Arr) => any) extends ((x: infer X, ...xs: infer Xs) => any)
//         ? Merge<X, MergeAll_<Xs>>
//         : never;


/**
 * warning! length limit - 6 !!!
 */
export type MergeAll<Arr extends any[]> = ((...a: Arr) => 0) extends ((x: infer X, ...xs: infer Xs) => 0) ? (Xs extends any[] ? MergeOmit<X, depth1<Xs>> : X) : never;
type depth1<Arr extends any[]> = ((...a: Arr) => 0) extends ((x: infer X, ...xs: infer Xs) => 0) ? (Xs extends any[] ? MergeOmit<X, depth2<Xs>> : X) : never;
type depth2<Arr extends any[]> = ((...a: Arr) => 0) extends ((x: infer X, ...xs: infer Xs) => 0) ? (Xs extends any[] ? MergeOmit<X, depth3<Xs>> : X) : never;
type depth3<Arr extends any[]> = ((...a: Arr) => 0) extends ((x: infer X, ...xs: infer Xs) => 0) ? (Xs extends any[] ? MergeOmit<X, depth4<Xs>> : X) : never;
type depth4<Arr extends any[]> = ((...a: Arr) => 0) extends ((x: infer X, ...xs: infer Xs) => 0) ? (Xs extends any[] ? MergeOmit<X, depth5<Xs>> : X) : never;
type depth5<Arr extends any[]> = ((...a: Arr) => 0) extends ((x: infer X, ...xs: infer Xs) => 0) ? (Xs extends any[] ? MergeOmit<X, depth_<Xs>> : X) : never;
// type depth6<Arr extends any[]> = ((...a: Arr) => 0) extends ((x: infer X, ...xs: infer Xs) => 0) ? (Xs extends any[] ? MergeOmit<X, depth_<Xs>> : X) : never;
type depth_<Arr extends any[]> = ((...a: Arr) => 0) extends ((x: infer X, ...xs: infer Xs) => 0) ? X : never;

type ArgumentTypes<T> = T extends new (...a: infer A) => any? A : [];
type ConstructorPs<T> = T extends new (...a: infer P) => any ? P : never;

export type Constructor<T, A extends any[] = any[]> = new (...args: A) => T;
export type ExtractConstructor<T extends new (...args: any) => any> = T extends infer C ? C : never;
// export type RewriteConstructorResult<T extends new (...args: any) => any, N> = new (...args: ConstructorParameters<T>) => N;
// export type RewriteConstructorResult1<T extends new (...args: any) => any, N> = new (a1: ConstructorParameters<T>[0], a2?: ConstructorParameters<T>[1]) => N;

type CP<T extends new (...args: any) => any> = T extends new (...args: infer P) => any ? P : [];
type CPN<T extends new (...args: any) => any, N extends number> = CP<T>[N];

import {A, B, C, F, I, N, O, S, T, U, L} from 'ts-toolbelt';

export type RewriteConstructorResult<T extends new (...args: any) => any, N> = {
    0: new () => InstanceType<T> & N,
    1: new (arg1: CPN<T, 0>) => InstanceType<T> & N,
    2: new (arg1: CPN<T, 0>, arg2: CPN<T, 1>) => InstanceType<T> & N,
    3: new (arg1: CPN<T, 0>, arg2: CPN<T, 1>, arg3: CPN<T, 2>) => InstanceType<T> & N,
    4: new (arg1: CPN<T, 0>, arg2: CPN<T, 1>, arg3: CPN<T, 2>, arg4: CPN<T, 3>) => InstanceType<T> & N,
    5: new (arg1: CPN<T, 0>, arg2: CPN<T, 1>, arg3: CPN<T, 2>, arg4: CPN<T, 3>, arg5: CPN<T, 4>) => InstanceType<T> & N,
    '_': new (...args: CP<T>) => InstanceType<T> & N,
}[N.Greater<L.Length<CP<T>>, '5'> extends '4' ? '_' : L.Length<CP<T>>];

export type RewriteConstructorResult2<T extends new (...args: any) => any, N extends InstanceType<T>> = {
    0: new () => N,
    1: new (arg1: CPN<T, 0>) => N,
    2: new (arg1: CPN<T, 0>, arg2: CPN<T, 1>) => N,
    3: new (arg1: CPN<T, 0>, arg2: CPN<T, 1>, arg3: CPN<T, 2>) => N,
    4: new (arg1: CPN<T, 0>, arg2: CPN<T, 1>, arg3: CPN<T, 2>, arg4: CPN<T, 3>) => N,
    5: new (arg1: CPN<T, 0>, arg2: CPN<T, 1>, arg3: CPN<T, 2>, arg4: CPN<T, 3>, arg5: CPN<T, 4>) => N,
    '_': new (...args: CP<T>) => N,
}[N.Greater<L.Length<CP<T>>, '5'> extends '4' ? '_' : L.Length<CP<T>>];


// // type ConstructorParameters<T extends new (...args: any) => any> = T extends new (...args: infer P) => any ? P : never;
class Aa {
    constructor(protected str: string, protected str1?: string) {
    }
    sa() {}
}
type a = ExtractConstructor<typeof Aa>;
// type b = RewriteConstructorResult1<typeof A, {bbb: boolean}>;

type newType = {bbb: boolean, a: (a: number) => string};

type aaa = RewriteConstructorResult<typeof Aa, newType>;
declare const Constr: aaa;
class Child extends Constr {
    constructor(superName: string = '1') {
        super(superName);
    }
};

const test = new Child('asd');
test.
