/* tslint:disable:max-classes-per-file */
import {mixin} from "../mixin";
import {IMixinAfterInitHandler, IUseMixins, MixinFull, mixinsAfterInit, MixinsProp} from "../types";
import {mixinsProp, use} from "../decorators";
import * as chai from 'chai';
import {UseMixins, UseMixinsExtends} from "../methods";
const expect = chai.expect;


export interface IMixinA {
    propInMixin: number;
    readonly testA: string;
    readonly initInSetup: Date;

    methodInMixin(): string;

    test(): void;

    sameNameMethod(): string;
}

export const mixinAName = 'mixinA' as const;
export const mixinA = mixin<typeof mixinAName, IMixinA, ['initInSetup', 'propInMixin']>({
    mixinName: mixinAName,

    setup() {
        return {
            propInMixin: 123111,
            initInSetup: new Date(),
        };
    },

    init(this: MixinFull<typeof mixinAName, IMixinA>) {
        expect(this.target.propInMixin).to.equal(123111);
        expect(this.target.mixins.mixinA.propInMixin).to.equal(123111);
        this.propInMixin = 123;
        expect(this.target.propInMixin).to.equal(123);
        expect(this.target.mixins.mixinA.propInMixin).to.equal(123);
    },

    get testA() {
        return 'test-a';
    },
    methodInMixin() {
        return this.testA;
    },
    test() {
        expect(this.target.propInMixin).to.equal(123);
        expect(this.target.mixins.mixinA.propInMixin).to.equal(123);
    },
    sameNameMethod(): string {
        return 'from mixinA';
    },
});

export const mixinB = mixin({
    mixinName: 'mixinB' as const,
    get testB() {
        return 'test-b';
    },
    methodB() {
        return this.testB;
    },
    get test() {
        return 666;
    },
    sameNameMethod(): string {
        return 'from mixinB';
    },
    init() {/***/
    },
});

export const mixinC = mixin({
    mixinName: 'mixinC',
    methodC() {
        return 'methodC';
    },
});


@use(mixinA, mixinB)
export class ClassA implements IMixinAfterInitHandler {

    fieldInClassA = '111';
    test: number;

    static staticProp = 'test static';

    constructor(val: number) {
        this.test = val;
    }

    [mixinsAfterInit]() {
        expect(this.mixins.mixinA.initInSetup).not.undefined;
        // noinspection SuspiciousTypeOfGuard
        expect(this.mixins.mixinA.initInSetup instanceof Date).true;
        expect(this.initInSetup).not.undefined;
        // noinspection SuspiciousTypeOfGuard
        expect(this.initInSetup instanceof Date).true;
    }

    methodInClassA() {
        expect(this.propInMixin).to.equal(123);
        expect(this.mixins.mixinA.propInMixin).to.equal(123);
        expect(this.test).to.not.equal(666);
        expect(this.mixins.mixinB.test).to.equal(666);
        return 'methodInClassA' + this.fieldInClassA;
    }

    sameNameMethod() {
        return 'from classA';
    }
}
export interface ClassA extends IUseMixins<[typeof mixinA, typeof mixinB], ClassA> {}


@use(mixinC)
export class ClassB extends ClassA {
    hello() {
        return 'hello';
    }
}
// todo, not implemented for the classes to be inherited (((
// interface ClassB extends IUseMixinsWithBase<[typeof mixinC], ExtractMixins<ClassA>> {}



export class ClassWithMixinsProp {
    @mixinsProp(mixinA, mixinB) mixins!: MixinsProp<[typeof mixinA, typeof mixinB]>;
}


export class TestUseMixinB extends UseMixins(mixinA) {
    name = 'b';
    constructor(readonly str: string) {
        super();
    }
}

export class TestUseMixinBB extends UseMixinsExtends(TestUseMixinB, mixinB) {
    name = 'bb';
    constructor(str: string, readonly numb: number) {
        super(str);
    }
}

export class TestUseMixinBBB extends UseMixinsExtends(TestUseMixinBB, mixinC) {
    name = 'bbb';
    asdasd = 1;
    constructor(readonly bool: boolean) {
        super('1', 1);
    }
    asdas(asdasd: boolean) {
        return 1;
    }
}
