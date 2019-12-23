/* tslint:disable:variable-name interface-over-type-literal max-line-length */
import {
    TestUseMixinB,
    TestUseMixinBB,
    TestUseMixinBBB,
} from "./common";

//////////////////////

export declare const expectType: <T>(value: T) => void;

//////////////////////

const _b = new TestUseMixinB('');
const _bb = new TestUseMixinBB('', 1);
const _bbb = new TestUseMixinBBB(true);

expectType<string>(_b.name);
expectType<string>(_b.fieldInB);

expectType<string>(_bb.name);
expectType<string>(_bb.fieldInB);
expectType<number>(_bb.fieldInBB);

expectType<string>(_bbb.name);
expectType<string>(_bbb.fieldInB);
expectType<number>(_bbb.fieldInBB);
expectType<number>(_bbb.asdasd);
expectType<boolean>(_bbb.fieldInBBB);
expectType<(asdasd: boolean) => number>(_bbb.asdas);

