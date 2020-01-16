/* tslint:disable:max-line-length */
import {useMixins, useMixinsForObject} from "../mixin";
import {assertHaveMixin, assertHaveMixins, haveMixin, haveMixins, isMixin} from "../type-guards";
import {
    ClassA,
    ClassB, IMain,
    mixinA,
    mixinB,
    mixinC,
    TestUseMixinB,
    TestUseMixinBB,
    TestUseMixinBBB,
} from "./common";

import * as chai from 'chai';
import {Constructor} from "../types";

const expect = chai.expect;


describe("main tests", () => {

    const RND = Math.random();

    // @ts-ignore
    let temp = new ClassA(RND);

    beforeEach(() => {
        temp = new ClassA(RND);
    });

    it('should work correctly when using decorator @use on class', () => {
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

        it('should work correctly when inheriting', () => {
            const test = new ClassB();

            if (haveMixin(test, mixinC, ClassB)) {
                expect(test.methodC()).equal('methodC');
                expect(test.mixins.mixinC.methodC()).equal('methodC');
            }

            expect(test.hello()).equal('hello');

            expect(haveMixin(test, mixinA, ClassB)).true;
            expect(haveMixin(test, mixinB, ClassB)).true;

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
    });

    it('should work correctly when assigning mixins through inheritance - useMixin method', () => {
        /////
        const testB = new TestUseMixinB('abc');

        expect(testB.initInSetup instanceof Date).to.equal(true, 'testB.initInSetup is not a Date');
        expect(testB.str).to.equal('abc');

        expect(haveMixin(testB, mixinA)).to.equal(true, 'check is testB have mixinB failed');
        expect(haveMixin(testB, mixinB)).to.equal(false, 'check is testB not have mixinB failed');
        expect(haveMixin(testB, mixinC)).to.equal(false, 'check is testB not have mixinC failed');


        /////
        const testBB = new TestUseMixinBB('qwe', 987);

        expect(testBB.initInSetup instanceof Date).to.equal(true, 'testBB.initInSetup is not a Date');
        expect(testBB.str).to.equal('qwe');
        expect(testBB.numb).to.equal(987);

        expect(haveMixin(testBB, mixinA)).to.equal(true, 'check is testBB have mixinA failed');
        expect(haveMixin(testBB, mixinB)).to.equal(true, 'check is testBB have mixinB failed');
        expect(haveMixin(testBB, mixinC)).to.equal(false, 'check is testBB not have mixinC failed');


        /////
        const testBBB = new TestUseMixinBBB(true);

        expect(testBBB.initInSetup instanceof Date).to.equal(true, 'testBBB.initInSetup is not a Date');
        expect(testBBB.str).to.equal('1');
        expect(testBBB.numb).to.equal(1);
        expect(testBBB.bool).to.true;

        expect(haveMixin(testBBB, mixinA)).to.equal(true, 'check is testBBB have mixinA failed');
        expect(haveMixin(testBBB, mixinB)).to.equal(true, 'check is testBBB have mixinB failed');
        expect(haveMixin(testBBB, mixinC)).to.equal(true, 'check is testBBB have mixinC failed');
    });


    it('should work correctly method useMixins', () => {
        class Test implements IMain {
            // static a = 1;
            // static aa() {}
            test = 'test';

            readonly mainGetter = '1';
            mainMethod(val: number): string {
                return val.toString(2);
            }
        }

        const classC = useMixins(Test, mixinA, mixinB);
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

    it('should work correctly method useMixinsForObject', () => {
        const testBase = {
            test: 'abc',
            m() {
                return 'm';
            },
            mainGetter: '1',
            mainMethod(val: number): string {
                return val.toString(2);
            },
        };

        const test = useMixinsForObject(testBase, mixinA, mixinB);

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
        const check: any = temp as any;

        expect(haveMixin(check, mixinA)).true;
        expect(haveMixin(check, mixinB)).true;
        expect(haveMixin(check, mixinC)).false;
        expect(haveMixins(check, [mixinA])).true;
        expect(haveMixins(check, [mixinA, mixinB])).true;
        expect(haveMixins(check, [mixinA, mixinB, mixinC])).false;

        if (haveMixin(check, mixinA, ClassA)) {
            expect(check.methodInMixin()).equal('test-a');
        }

        if (haveMixins(check, [mixinA, mixinB])) {
            expect(check.mixins.mixinA.methodInMixin()).equal('test-a');
            expect(check.mixins.mixinB.methodB()).equal('test-b');
        } else {
            expect(haveMixins(check, [mixinA, mixinB])).true;
        }

        expect(isMixin(check)).false;

        const testMixin: unknown = check.mixins.mixinB;
        expect(isMixin(testMixin)).true;
        if (isMixin(testMixin)) {
            expect(testMixin.mixinName).to.equal('mixinB');
        } else {
            expect(isMixin(testMixin)).true;
        }

        if (isMixin<typeof mixinB>(testMixin)) {
            expect(testMixin.mixinName).to.equal('mixinB');
            expect(testMixin.testB).to.equal('test-b');
        } else {
            expect(isMixin<typeof mixinB>(testMixin)).true;
        }
    });

    it("should be asserts functions correct work", () => {
        const check: any = temp as any;

        expect(() => assertHaveMixin(check, mixinA)).to.not.throw();
        expect(() => assertHaveMixin(check, mixinB)).to.not.throw();

        expect(() => assertHaveMixin(check, mixinC))
            .to.throw(Error, `The object does not have mixin '${mixinC.mixinName}'`);

        expect(() => assertHaveMixins(check, [mixinA])).to.not.throw();

        expect(() => assertHaveMixins(check, [mixinA, mixinB])).to.not.throw();

        expect(() => assertHaveMixins(check, [mixinA, mixinB, mixinC]))
            .to.throw(Error, `The object does not have one or more of mixins '${mixinA.mixinName}', '${mixinB.mixinName}', '${mixinC.mixinName}'`);
    });

});


