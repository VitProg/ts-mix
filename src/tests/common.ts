/* tslint:disable:max-classes-per-file variable-name */
import {mixin, useMixins} from "../mixin";
import {AnyObject, IMixinAfterInitHandler, MixinFull} from "../types";
import * as chai from 'chai';
import {haveMixin} from "../index";

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

    init() {
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

//////////////////////////////////////////

// class CA {
//     static staticProp = 'test static';
//
//     constructor(props: any) {
//
//     }
//
// }
// function testF<T extends AnyObject>(cl: T): ExtractStatic<T> {
//     return cl as any;
// }
// const a = testF(CA);
// a.
//
// type ExtractStatic<T extends AnyObject> = Omit<{[key in keyof T]: T[key]}, 'prototype'>;



export const ClassA = useMixins(class ClassA implements IMixinAfterInitHandler {
    fieldInClassA = '111';
    test: number;

    static staticProp = 'test static';

    constructor(val: number) {
        this.test = val;
    }

    __afterMixins() {
        if (haveMixin(this, mixinA, ClassA)) {
            expect(this.mixins.mixinA.initInSetup).not.undefined;
            // noinspection SuspiciousTypeOfGuard
            expect(this.mixins.mixinA.initInSetup instanceof Date).true;
            expect(this.initInSetup).not.undefined;
            // noinspection SuspiciousTypeOfGuard
            expect(this.initInSetup instanceof Date).true;
        } else {
            expect(haveMixin(this, mixinA, ClassA)).true;
        }
    }

    methodInClassA() {
        if (haveMixin(this, mixinA, ClassA)) {
            expect(this.propInMixin).to.equal(123);
            expect(this.mixins.mixinA.propInMixin).to.equal(123);
            expect(this.test).to.not.equal(666);
            expect(this.mixins.mixinB.test).to.equal(666);
        } else {
            expect(haveMixin(this, mixinA, ClassA)).true;
        }
        return 'methodInClassA' + this.fieldInClassA;
    }

    sameNameMethod() {
        return 'from classA';
    }
}, mixinA, mixinB);


export const ClassB = useMixins(class ClassB extends ClassA {
    constructor() {
        super(1);
    }

    fieldInB: number = Math.random();

    hello() {
        return 'hello';
    }
}, mixinB, mixinC);


export const TestUseMixinB = useMixins(class TestUseMixinB {
    name = 'b';
    fieldInB: string = 'test';

    constructor(readonly str: string) {
        //
    }
}, mixinA);

export const TestUseMixinBB = useMixins(class TestUseMixinBB extends TestUseMixinB {
    name = 'bb';
    fieldInBB: number = 1;

    constructor(str: string, readonly numb: number) {
        super(str);
    }
}, mixinB);

export const TestUseMixinBBB = useMixins(class TestUseMixinBBB extends TestUseMixinBB {
    name = 'bbb';
    asdasd = 1;
    fieldInBBB: boolean = true;

    constructor(readonly bool: boolean) {
        super('1', 1);
    }

    asdas(asdasd: boolean) {
        return 1;
    }
}, mixinC);
