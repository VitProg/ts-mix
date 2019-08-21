/* tslint:disable:max-classes-per-file */
import * as chai from 'chai';
import {applyMixinsForClass, applyMixinsForObject, mixin} from "../mixin";
import {use, useProxy} from "../decorators";
import {IUseMixins, Mixin} from "../types";
import {haveMixin, haveMixins} from "../type-guards";

const expect = chai.expect;


describe("", () => {

    interface IMixinA {
        propInMixin?: number;
        readonly testA: string;
        methodInMixin(): string;
        test(): void;
        sameNameMethod(): string;
    }
    const mixinA = mixin<'mixinA', IMixinA>({
        mixinName: 'mixinA',
        init(this: Mixin<'mixinA', IMixinA>) {
            const a = this.mixinName;
            this.propInMixin = Math.random();
        },
        get testA() {
            return 'test-a';
        },
        methodInMixin() {
            return this.testA;
        },
        test() {
        },
        sameNameMethod(): string {
            return 'from mixinA';
        },
    });

    const mixinB = mixin({
        mixinName: 'mixinB',
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
    });

    @use(mixinA, mixinB)
    class ClassA {
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
    interface ClassA extends IUseMixins<[typeof mixinA, typeof mixinB]> {
    }

    class ClassB extends ClassA {
        hello() {
            return 'hello';
        }
    }

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
    interface ClassAProxy extends IUseMixins<[typeof mixinA, typeof mixinB]> {
    }


    // @ts-ignore
    let temp: ClassA;

    const RND = Math.random();

    beforeEach(() => {
        temp = (new ClassA(RND)) as any;
    });


    it("should be mixin correct work", () => {
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
        const mixinC = mixin({
            mixinName: 'mixinC',
            methodC() {
                return 'methodC';
            },
        }) as any;
        expect(haveMixin(temp, mixinA)).true;
        expect(haveMixin(temp, mixinB)).true;
        expect(haveMixin(temp, mixinC)).false;
        expect(haveMixins(temp, mixinA)).true;
        expect(haveMixins(temp, mixinA, mixinB)).true;
        expect(haveMixins(temp, mixinA, mixinB, mixinC)).false;

        if (haveMixin(temp, mixinA)) {
            expect(temp.methodInMixin()).equal('test-a');
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
