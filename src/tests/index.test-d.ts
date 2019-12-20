/* tslint:disable:variable-name interface-over-type-literal max-line-length */
import {
    ClassA,
    ClassB,
    ClassWithMixinsProp,
    mixinA,
    mixinB,
    mixinC,
    TestUseMixinB,
    TestUseMixinBB,
    TestUseMixinBBB,
} from "./common";
import {ExtractMixins, IUseMixins} from "../types";
import {MergeAll, MergeAllRevert} from "../common.types";
import tb from 'ts-toolbelt';

//////////////////////

export declare const expectType: <T>(value: T) => void;

//////////////////////


const a = new ClassA(1);
const b = new ClassB(1);

expectType<IUseMixins<[typeof mixinA, typeof mixinB], ClassA>>(a);
expectType<IUseMixins<[typeof mixinA, typeof mixinB, /*not supported: typeof mixinC*/], ClassB>>(b);


//////////////////////

const prop = new ClassWithMixinsProp();
type T_prop = typeof prop extends { __used_mixins: any } ? false : true;
declare const inst_prop: T_prop;
expectType<true>(true);

//////////////////////

// test MergeAll & MergeAllRevert
type i1 = { a: number, b: string, ttt: never };
type i2 = { a: never, /*-------*/ ttt: { aaa: string }, c: Date, f: (...args: any[]) => any };
type i3 = { g: any, f: undefined, ttt: 1 };

// MergeAllRevert

const inst_mergeAllRevert = undefined as any as MergeAllRevert<[i1, i2, i3]>;
type T_mergeAllRevert = typeof inst_mergeAllRevert;

//

type T_mergeAllRevert_need = {a: number, b: string, ttt: never, f: (...args: any[]) => any, c: Date, g: any};

type T_CHECK_mergeAllRevert_need_result = tb.A.Extends<T_mergeAllRevert, T_mergeAllRevert_need> & tb.A.Extends<T_mergeAllRevert_need, T_mergeAllRevert>;

declare const inst_CHECK_mergeAllRevert_need_result: T_CHECK_mergeAllRevert_need_result extends 1 ? 1: 'incorrect result type of MergeAllRevert';

expectType<1>(inst_CHECK_mergeAllRevert_need_result);

//

type T_CHECK_mergeAllRevert_a = tb.A.Equals<typeof inst_mergeAllRevert.a, T_mergeAllRevert_need['a']>;
type T_CHECK_mergeAllRevert_b = tb.A.Equals<typeof inst_mergeAllRevert.b, T_mergeAllRevert_need['b']>;
type T_CHECK_mergeAllRevert_ttt = tb.A.Equals<typeof inst_mergeAllRevert.ttt, T_mergeAllRevert_need['ttt']>;
type T_CHECK_mergeAllRevert_c = tb.A.Equals<typeof inst_mergeAllRevert.c, T_mergeAllRevert_need['c']>;
type T_CHECK_mergeAllRevert_f = tb.A.Equals<typeof inst_mergeAllRevert.f, T_mergeAllRevert_need['f']>;
type T_CHECK_mergeAllRevert_g = tb.A.Equals<typeof inst_mergeAllRevert.g, T_mergeAllRevert_need['g']>;

declare const inst_CHECK_mergeAllRevert_a: T_CHECK_mergeAllRevert_a extends 1 ? 1 : 'incorrect result type of `a`, is not `number`';
declare const inst_CHECK_mergeAllRevert_b: T_CHECK_mergeAllRevert_b extends 1 ? 1 : 'incorrect result type of `a`, is not `string`';
declare const inst_CHECK_mergeAllRevert_ttt: T_CHECK_mergeAllRevert_ttt extends 1 ? 1 : 'incorrect result type of `a`, is not `never`';
declare const inst_CHECK_mergeAllRevert_c: T_CHECK_mergeAllRevert_c extends 1 ? 1 : 'incorrect result type of `a`, is not `Date';
declare const inst_CHECK_mergeAllRevert_f: T_CHECK_mergeAllRevert_f extends 1 ? 1 : 'incorrect result type of `a`, is not `(...args: any[]) => any`';
declare const inst_CHECK_mergeAllRevert_g: T_CHECK_mergeAllRevert_g extends 1 ? 1 : 'incorrect result type of `a`, is not `any`';

expectType<1>(inst_CHECK_mergeAllRevert_a);
expectType<1>(inst_CHECK_mergeAllRevert_b);
expectType<1>(inst_CHECK_mergeAllRevert_ttt);
expectType<1>(inst_CHECK_mergeAllRevert_c);
expectType<1>(inst_CHECK_mergeAllRevert_f);
expectType<1>(inst_CHECK_mergeAllRevert_g);


// test MergeAll

const inst_mergeAll = undefined as any as MergeAll<[i1, i2, i3]>;
type T_mergeAll = typeof inst_mergeAll;

type T_mergeAll_need = {
    a: never,
    b: string,
    ttt: 1,
    f: undefined,
    c: Date,
    g: any,
};

type T_CHECK_mergeAll_need_result = tb.A.Extends<T_mergeAll, T_mergeAll_need> & tb.A.Extends<T_mergeAll_need, T_mergeAll>;

declare const inst_CHECK_mergeAll_need_result: T_CHECK_mergeAll_need_result extends 1 ? 1: 'incorrect result type of MergeAllRevert';

expectType<1>(inst_CHECK_mergeAll_need_result);

//////////////////////

const _b = new TestUseMixinB('');
const _bb = new TestUseMixinBB('', 1);
const _bbb = new TestUseMixinBBB(true);

expectType<[typeof mixinA]>(_b.__used_mixins);
expectType<[typeof mixinA, typeof mixinB]>(_bb.__used_mixins);
expectType<[typeof mixinA, typeof mixinB, typeof mixinC]>(_bbb.__used_mixins);

type T_extract_b = ExtractMixins<TestUseMixinB>;
type T_extract_bb = ExtractMixins<TestUseMixinBB>;
type T_extract_bbb = ExtractMixins<TestUseMixinBBB>;

declare const inst_extract_b: T_extract_b;
declare const inst_extract_bb: T_extract_bb;
declare const inst_extract_bbb: T_extract_bbb;

expectType<[typeof mixinA]>(inst_extract_b);
expectType<[typeof mixinA, typeof mixinB]>(inst_extract_bb);
expectType<[typeof mixinA, typeof mixinB, typeof mixinC]>(inst_extract_bbb);
