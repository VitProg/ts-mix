/* tslint:disable:max-classes-per-file */
import {L} from 'ts-toolbelt';
import * as chai from 'chai';
import {applyMixinsForClass, applyMixinsForObject, mixin} from "../mixin";
import {mixinsProp, use, UseMixins, UseMixinsExtends, useProxy} from "../decorators";
import {ExtractMixins, IMixinAfterInitHandler, IUseMixins, MixinFull, mixinsAfterInit, MixinsProp,} from "../types";
import {haveMixin, haveMixins, isMixin} from "../type-guards";
import {UnionToIntersection} from "../common.types";

const expect = chai.expect;


describe("", () => {

    interface IMixinA {
        propInMixin: number;
        readonly testA: string;
        readonly initInSetup: Date;

        methodInMixin(): string;

        test(): void;

        sameNameMethod(): string;
    }

    const mixinAName = 'mixinA' as const;
    const mixinA = mixin<typeof mixinAName, IMixinA, ['initInSetup', 'propInMixin']>({
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

    const mixinB = mixin({
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

    const mixinC = mixin({
        mixinName: 'mixinC',
        methodC() {
            return 'methodC';
        },
    });


    @use(mixinA, mixinB)
    class ClassA implements IMixinAfterInitHandler {

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

    interface ClassA extends IUseMixins<[typeof mixinA, typeof mixinB]> {
    }


    @use(mixinC)
    class ClassB extends ClassA {
        hello() {
            return 'hello';
        }
    }
    // todo, not implemented for the classes to be inherited (((
    // interface ClassB extends IUseMixinsWithBase<[typeof mixinC], ExtractMixins<ClassA>> {}


    @useProxy(mixinA, mixinB)
    class ClassAProxy {
        fieldInClassA = '111';
        test: number;

        constructor(val: number) {
            this.test = val;
        }

        methodInClassA() {
            return 'methodInClassA' + this.fieldInClassA;
        }

        sameNameMethod() {
            return 'from classA';
        }
    }
    interface ClassAProxy extends IUseMixins<[typeof mixinA, typeof mixinB]> {}


    // todo add tests
    class ClassWithMixinsProp {
        @mixinsProp(mixinA, mixinB) mixins!: MixinsProp<[typeof mixinA, typeof mixinC]>;
    }

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    class TestUseMixinB extends UseMixins(mixinA) {
        name = 'b';
        constructor(readonly str: string) {
            super();
        }
    }

    class TestUseMixinBB extends UseMixinsExtends(TestUseMixinB, mixinB) {
        name = 'bb';
        constructor(str: string, readonly numb: number) {
            super(str);
        }
    }

    class TestUseMixinBBB extends UseMixinsExtends(TestUseMixinBB, mixinC) {
        name = 'bbb';
        asdasd = 1;
        constructor(readonly bool: boolean) {
            super('1', 1);
        }
        asdas(asdasd: boolean) {
            return 1;
        }
    }

    const testB = new TestUseMixinB('asdas');
    const mB = testB.__used_mixins;

    const testBB = new TestUseMixinBB('set', 123);
    const mBB = testBB.__used_mixins;

    const testBBB = new TestUseMixinBBB(true);
    const mBBB = testBBB.__used_mixins;


    // @ts-ignore
    let temp: ClassA;

    const RND = Math.random();

    beforeEach(() => {
        temp = (new ClassA(RND)) as any;
    });


    it("should be mixin correct work", () => {
        expect(ClassA.staticProp).equal('test static');
        expect(temp.mixins.mixinA.methodInMixin()).equal('test-a');
        expect(temp.methodInMixin()).equal('test-a');
        expect(temp.testA).equal('test-a');
        expect(temp.mixins.mixinA.testA).equal('test-a');
        expect(temp.fieldInClassA).equal('111');
        expect(temp.test).equal(RND);
        expect(temp.mixins.mixinA.test()).undefined;
        expect(temp.mixins.mixinB.test).equal(666);
        expect(temp.methodInClassA()).equal('methodInClassA111');
        expect(temp.methodB()).equal('test-b');
        expect(temp.mixins.mixinB.methodB()).equal('test-b');
        expect(temp.testB).equal('test-b');
        expect(temp.mixins.mixinB.testB).equal('test-b');

        expect(temp.sameNameMethod()).equal('from classA');
        expect(temp.mixins.mixinA.sameNameMethod()).equal('from mixinA');
        expect(temp.mixins.mixinB.sameNameMethod()).equal('from mixinB');

        expect(temp.initInSetup).not.undefined;
        // noinspection SuspiciousTypeOfGuard
        expect(temp.initInSetup instanceof Date).true;

        // expect(temp.)
    });

    it("should be mixin proxy correct work", () => {
        const test = new ClassAProxy(RND);

        expect(test.mixins.mixinA.methodInMixin()).equal('test-a');
        expect(test.methodInMixin()).equal('test-a');
        expect(test.testA).equal('test-a');
        expect(test.mixins.mixinA.testA).equal('test-a');
        expect(test.fieldInClassA).equal('111');
        expect(test.test).equal(RND);
        expect(test.mixins.mixinA.test()).undefined;
        expect(test.mixins.mixinB.test).equal(666);
        expect(test.methodInClassA()).equal('methodInClassA111');
        expect(test.methodB()).equal('test-b');
        expect(test.mixins.mixinB.methodB()).equal('test-b');
        expect(test.testB).equal('test-b');
        expect(test.mixins.mixinB.testB).equal('test-b');

        expect(temp.sameNameMethod()).equal('from classA');
        expect(temp.mixins.mixinA.sameNameMethod()).equal('from mixinA');
        expect(temp.mixins.mixinB.sameNameMethod()).equal('from mixinB');
    });

    it('should work correctly when inheriting', () => {
        const test = new ClassB(111);

        if (haveMixin(test, mixinC)) {
            expect(test.methodC()).equal('methodC');
            expect(test.mixins.mixinC.methodC()).equal('methodC');
        }

        expect(test.hello()).equal('hello');

        expect(haveMixin(test, mixinA)).true;
        expect(haveMixin(test, mixinB)).true;

        expect(test.sameNameMethod()).equal('from classA');

        expect(test.mixins.mixinA.methodInMixin()).equal('test-a');
        expect(test.methodInMixin()).equal('test-a');
        expect(test.testA).equal('test-a');
        expect(test.mixins.mixinA.testA).equal('test-a');
        expect(test.fieldInClassA).equal('111');
        expect(test.test).equal(111);
        expect(test.mixins.mixinA.test()).undefined;
        expect(test.mixins.mixinB.test).equal(666);
        expect(test.methodInClassA()).equal('methodInClassA111');
        expect(test.methodB()).equal('test-b');
        expect(test.mixins.mixinB.methodB()).equal('test-b');
        expect(test.testB).equal('test-b');
        expect(test.mixins.mixinB.testB).equal('test-b');
    });

    it('should work correctly simple, without decorators (applyMixinsForClass)', () => {
        class Test {
            test = 'test';
        }

        const classC = applyMixinsForClass(Test, mixinA, mixinB);
        const test = new classC();

        expect(haveMixin(test, mixinA)).true;
        expect(haveMixin(test, mixinB)).true;

        expect(test.sameNameMethod()).equal('from mixinA');

        expect(test.mixins.mixinA.methodInMixin()).equal('test-a');
        expect(test.methodInMixin()).equal('test-a');
        expect(test.testA).equal('test-a');
        expect(test.mixins.mixinA.testA).equal('test-a');
        expect(test.test).equal('test');
        expect(test.mixins.mixinA.test()).undefined;
        expect(test.mixins.mixinB.test).equal(666);
        expect(test.methodB()).equal('test-b');
        expect(test.mixins.mixinB.methodB()).equal('test-b');
        expect(test.testB).equal('test-b');
        expect(test.mixins.mixinB.testB).equal('test-b');
        expect(test.test).equal('test');
    });

    it('should work correctly simple, without decorators (applyMixinsForObject)', () => {
        const testBase = {
            test: 'abc',
            m() {
                return 'm';
            },
        };

        const test = applyMixinsForObject(testBase, mixinA, mixinB);

        expect(haveMixin(test, mixinA)).true;
        expect(haveMixin(test, mixinB)).true;

        expect(test.sameNameMethod()).equal('from mixinA');

        expect(test.mixins.mixinA.methodInMixin()).equal('test-a');
        expect(test.methodInMixin()).equal('test-a');
        expect(test.testA).equal('test-a');
        expect(test.mixins.mixinA.testA).equal('test-a');
        expect(test.test).equal('abc');
        expect(test.m()).equal('m');
        expect(test.mixins.mixinA.test()).undefined;
        expect(test.mixins.mixinB.test).equal(666);
        expect(test.methodB()).equal('test-b');
        expect(test.mixins.mixinB.methodB()).equal('test-b');
        expect(test.testB).equal('test-b');
        expect(test.mixins.mixinB.testB).equal('test-b');
    });

    it("should be type guards correct work", () => {
        expect(haveMixin(temp, mixinA)).true;
        expect(haveMixin(temp, mixinB)).true;
        expect(haveMixin(temp, mixinC)).false;
        expect(haveMixins(temp, mixinA)).true;
        expect(haveMixins(temp, mixinA, mixinB)).true;
        expect(haveMixins(temp, mixinA, mixinB, mixinC)).false;

        if (haveMixin(temp, mixinA)) {
            expect(temp.methodInMixin()).equal('test-a');
        }

        const testGuard: unknown = temp.mixins.mixinB;

        expect(isMixin(testGuard)).true;
        expect(isMixin(temp)).false;

        if (isMixin(testGuard)) {
            expect(testGuard.mixinName).to.equal('mixinB');
        }

        if (isMixin<typeof mixinB>(testGuard)) {
            expect(testGuard.mixinName).to.equal('mixinB');
            expect(testGuard.testB).to.equal('test-b');
        }
    });

    it('from readme.md', () => {
        const instance = new ClassA(123);
        expect(instance.methodInClassA()).equal('methodInClassA111');
        expect(instance.methodB()).equal('test-b');
        expect(instance.mixins.mixinB.methodB()).equal('test-b');
        expect(instance.methodInMixin()).equal('test-a');
    });


});
