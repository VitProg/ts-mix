/* tslint:disable:max-classes-per-file max-line-length */
import {applyMixinsForClass, applyMixinsForObject, mixin} from "../mixin";
import {assertHaveMixin, assertHaveMixins, haveMixin, haveMixins, isMixin} from "../type-guards";
import * as chai from 'chai';
import {IUseMixins, MixinFull, use} from "../index";
import {IMixinAfterInitHandler} from "../types";
import {mixinA, mixinB, mixinC, TestUseMixinB, TestUseMixinBB, TestUseMixinBBB} from "./common";
import {UseMixins, UseMixinsExtends} from "../methods";
const expect = chai.expect;

describe("tests examples in readme.md", () => {
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
        sameNameMethod(): string {
            return 'from mixinB';
        },
        methodB() {
            return "test-b";
        },
    });



    @use(mixinA, mixinB)
    class ClassA {
        methodInClassA() {
            return "methodInClassA111";
        }
        methodB() {
            return "test-b";
        }
        sameNameMethod(): string {
            return 'from classA';
        }
    }
    interface ClassA extends IUseMixins<[typeof mixinA, typeof mixinB], ClassA> {}



    const instance: ClassA = new ClassA();

    it ('Add to class mixins using the @use class decorator:', () => {
        expect(instance.methodInClassA()).to.equal("methodInClassA111");
        expect(instance.methodB()).to.equal("test-b");
        expect(instance.mixins.mixinB.methodB()).to.equal("test-b");
        expect(instance.methodInMixin()).to.equal("test-a");
        expect(instance.propInMixin).to.equal(123);
        expect(instance.initInSetup).to.instanceof(Date);
    });

    it('Use without decorators - for class - assigning mixins outside the class definition.', () => {
        class Test {
            test = 'test';
        }

        const classC = applyMixinsForClass(Test, mixinA, mixinB);
        const instance = new classC();

        expect(haveMixin(instance, mixinA, classC)).to.equal(true, 'check is instance have mixinA failed');
        expect(haveMixin(instance, mixinB, classC)).to.equal(true, 'check is instance have mixinB failed');

        expect(instance.test).to.equal("test");
        expect(instance.methodB()); // "test-b" - method from mixinB
        expect(instance.mixins.mixinB.methodB()); // "test-b" - method from mixinB
        expect(instance.methodInMixin()); // "test-a" - method from mixinA
    });

    it('Use without decorators - for class - using UseMixins and UseMixinsExtends methods', () => {
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

        const testB = new TestUseMixinB('abc');
        const testBB = new TestUseMixinBB('qwe', 987);
        const testBBB = new TestUseMixinBBB(true);

        expect(testB.str).to.equal('abc');
        expect(haveMixin(testB, mixinA, TestUseMixinB)).to.equal(true, 'check is testB have mixinB failed');

        expect(testBB.str).to.equal('qwe');
        expect(testBB.numb).to.equal(987);
        expect(haveMixin(testBB, mixinA, TestUseMixinBB)).to.equal(true, 'check is testBB have mixinA failed');
        expect(haveMixin(testBB, mixinB, TestUseMixinBB)).to.equal(true, 'check is testBB have mixinB failed');

        expect(testBBB.str).to.equal('1');
        expect(testBBB.numb).to.equal(1);
        expect(testBBB.bool).to.true;
        expect(haveMixin(testBBB, mixinA, TestUseMixinBBB)).to.equal(true, 'check is testBBB have mixinA failed');
        expect(haveMixin(testBBB, mixinB, TestUseMixinBBB)).to.equal(true, 'check is testBBB have mixinB failed');
        expect(haveMixin(testBBB, mixinC, TestUseMixinBBB)).to.equal(true, 'check is testBBB have mixinC failed');
    });

    it('Use without decorators - for Object.', () => {
        const testBase = {
            test: 'abc',
            m() {
                return 'm';
            },
        };

        const instance = applyMixinsForObject(testBase, mixinA, mixinB);
        expect(instance.test).to.equal("abc");
        expect(instance.m()).to.equal("m");
        expect(instance.methodB()).to.equal("test-b");
        expect(instance.mixins.mixinB.methodB()).to.equal("test-b");
        expect(instance.methodInMixin()).to.equal("test-a");
    });


    it('All methods of all mixins can be found in ``this.mixins.`` by mixin name.', () => {
        expect(instance.sameNameMethod()).to.equal("from classA");
        expect(instance.mixins.mixinA.sameNameMethod()).to.equal("from mixinA");
        expect(instance.mixins.mixinB.sameNameMethod()).to.equal("from mixinB");
    });

    it('type guards and assert functions', () => {
        const mixinC = mixin({
            mixinName: 'mixinC',
        });

        @use(mixinA, mixinB) // connects mixins to the class
        class ClassA {
            // some methods and properties
        }


        const instance = new ClassA();

        expect(haveMixin(instance, mixinA, ClassA)).to.equal(true, 'check is instance have mixinA failed');
        expect(haveMixin(instance, mixinB, ClassA)).to.equal(true, 'check is instance have mixinB failed');
        expect(haveMixin(instance, mixinC, ClassA)).to.equal(false, 'check is instance not have mixinC failed');

        expect(haveMixins(instance, [mixinA, mixinB], ClassA)).to.true;
        expect(haveMixins(instance, [mixinA, mixinB, mixinC], ClassA)).to.false;

        expect(() => assertHaveMixin(instance, mixinA, ClassA)).to.not.throw();
        expect(() => assertHaveMixins(instance, [mixinA, mixinB], ClassA)).to.not.throw();

        expect(() => assertHaveMixin(instance, mixinC, ClassA))
            .to.throw(Error, `The object does not have mixin '${mixinC.mixinName}'`);

        expect(() => assertHaveMixins(instance, [mixinA, mixinB, mixinC], ClassA))
            .to.throw(Error, `The object does not have one or more of mixins '${mixinA.mixinName}', '${mixinB.mixinName}', '${mixinC.mixinName}'`);
    });
});
