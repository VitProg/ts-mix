/* tslint:disable:max-classes-per-file max-line-length */
import * as chai from 'chai';
import {
    applyMixins,
    assertHaveMixin,
    assertHaveMixins,
    haveMixin,
    haveMixins,
    mixin, mixinsProp,
    MixinsProp,
    useMixinsForObject
} from "../index";
import {useMixins} from "../mixin";
import {mixinD} from "./common";

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
//                                              \  props init in method setup  /
    const mixinA = mixin<typeof mixinAName, IMixinA, ['initInSetup', 'propInMixin']>({
        mixinName: mixinAName,

        setup() {
            return {
                propInMixin: 123111,
                initInSetup: new Date(),
            };
        },

        init() {
            expect(this.target.propInMixin); // 123111
            expect(this.target.mixins.mixinA.propInMixin); // 123111
            this.propInMixin = 123;
            expect(this.target.propInMixin); // 123
            expect(this.target.mixins.mixinA.propInMixin); // 123
        },

        get testA() {
            return 'test-a';
        },
        methodInMixin() {
            return this.testA;
        },
        test() {
            expect(this.target.propInMixin); // 123
            expect(this.target.mixins.mixinA.propInMixin); // 123
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

    const mixinC = mixin({
        mixinName: 'mixinC',
        methodC() {
            return 'methodC';
        },
    });

    class Test {
        test = 'test';
    }

    const classC = useMixins(Test, mixinA, mixinB);

    const instance = new classC(); 


    it('usage - for class - assigning mixins outside the class definition.', () => {
        class Test {
            test = 'test';
        }

        const classC = useMixins(Test, mixinA, mixinB);

        const instance = new classC();

        expect(haveMixin(instance, mixinA, classC)).true;
        expect(haveMixin(instance, mixinB, classC)).true;
        expect(haveMixin(instance, mixinC, classC)).false;

        expect(instance.test).equal("test");
        expect(instance.methodB()).equal("test-b");
        expect(instance.mixins.mixinB.methodB()).equal("test-b");
        expect(instance.methodInMixin()).equal("test-a");
    });

    it('Use without decorators - for class - using UseMixins and UseMixinsExtends methods', () => {
        /* tslint:disable:max-classes-per-file variable-name */
        const TestUseMixinB = useMixins(class TestUseMixinB {
            name = 'b';
            fieldInB: string = 'test';

            constructor(readonly str: string) {
                //
            }
        }, mixinA);

        const TestUseMixinBB = useMixins(class TestUseMixinBB extends TestUseMixinB {
            name = 'bb';
            fieldInBB: number = 1;

            constructor(str: string, readonly numb: number) {
                super(str);
            }
        }, mixinB);

        const TestUseMixinBBB = useMixins(class TestUseMixinBBB extends TestUseMixinBB {
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

        const testB = (new TestUseMixinB('abc')) as any;
        const testBB = (new TestUseMixinBB('qwe', 987)) as any;
        const testBBB = (new TestUseMixinBBB(true)) as any;

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

    it('Use without decorators - for Object - immutable.', () => {
        const testBase = {
            test: 'abc',
            m() {
                return 'm';
            },
        };

        const instance = useMixinsForObject(testBase, mixinA, mixinB);
        expect(instance.test).to.equal("abc");
        expect(instance.m()).to.equal("m");
        expect(instance.methodB()).to.equal("test-b");
        expect(instance.mixins.mixinB.methodB()).to.equal("test-b");
        expect(instance.methodInMixin()).to.equal("test-a");
    });


    it('Use without decorators - for Object - mutable.', () => {
        const test = {
            test: 'abc',
            m() {
                return 'm';
            },
        };

        applyMixins(test, mixinA, mixinB);
        expect(test.test).to.equal("abc");
        expect(test.m()).to.equal("m");
        if (haveMixins(test, [mixinA, mixinB])) {
            expect(test.mixins.mixinB.methodB()).to.equal("test-b");
            expect(test.mixins.mixinB.methodB()).to.equal("test-b");
            expect(test.mixins.mixinA.methodInMixin()).to.equal("test-a");
        }
    });

    it('mixinsProp decorator.', () => {
        class TestDecorator {
            @mixinsProp(mixinB) mixins!: MixinsProp<[typeof mixinB]>;

            constructor() {
                expect(Object.keys(this.mixins)).to.deep.equal(['mixinB']);
            }
        }
        const test = new TestDecorator();

        expect('mixins' in test).true;
        expect(typeof test.mixins).equal('object');
        expect(test.mixins.mixinB.methodB()).equal('test-b');
        expect(test.mixins.mixinB.sameNameMethod()).equal('from mixinB');
    });

    it('rewrite test', () => {
        class Test {
            fall = 'test';
            asd() {
                return 'Hello my name ' + this.fall;
            }
            test() {
                return this.fall;
            }
        }
        const test = new Test();

        expect(test.fall).equal('test');
        expect(test.asd()).equal('Hello my name test');
        expect(test.test()).equal('test');

        useMixinsForObject(test, mixinD);

        expect(() => assertHaveMixin(test, mixinD, Test)).to.not.throw();
        assertHaveMixin(test, mixinD, Test);

        expect('mixins' in test).true;
        expect(typeof test.mixins).equal('object');
        expect(test.fall).equal('fall in mixinD - a - test');
        expect(test.mixins.mixinD.methodInD()).equal('fall in mixinD - a - test');
        expect(test.mixins.mixinD.target.fall).equal('fall in mixinD - a - test');

        test.fall = 'b';

        expect(test.fall).equal('fall in mixinD - b - test');
        expect(test.mixins.mixinD.methodInD()).equal('fall in mixinD - b - test');
        expect(test.mixins.mixinD.target.fall).equal('fall in mixinD - b - test');

        expect(test.test()).equal('fall in mixinD - b - test');

        expect(test.asd()).equal('WWW');
    });


    it('All methods of all mixins can be found in ``this.mixins.`` by mixin name.', () => {
        expect(instance.sameNameMethod()).to.equal("from mixinA");
        expect(instance.mixins.mixinA.sameNameMethod()).to.equal("from mixinA");
        expect(instance.mixins.mixinB.sameNameMethod()).to.equal("from mixinB");
    });

    it('type guards and assert functions', () => {
        // connects mixins to the class
        const ClassA = useMixins(class ClassA1 {
            // some methods and properties
            static tt = 1;
            methodInClass() {
                return 'hello';
            }
            sameNameMethod(a: string){}
        }, mixinA, mixinB);

        const instance = new ClassA() as any;

        expect(haveMixin(instance, mixinA, ClassA)).to.equal(true, 'check is instance have mixinA failed');
        expect(haveMixin(instance, mixinB, ClassA)).to.equal(true, 'check is instance have mixinB failed');
        expect(haveMixin(instance, mixinC, ClassA)).to.equal(false, 'check is instance not have mixinC failed');

        expect(haveMixins(instance, [mixinA, mixinB], ClassA)).to.true;
        expect(haveMixins(instance, [mixinA, mixinB, mixinC], ClassA)).to.false;

        expect(() => assertHaveMixin(instance, mixinA, ClassA)).to.not.throw();
        expect(() => assertHaveMixins(instance, [mixinA, mixinB], ClassA)).to.not.throw();

        assertHaveMixin(instance, mixinA, ClassA);
        expect(typeof instance.methodInClass).equal('function');

        expect(() => assertHaveMixin(instance, mixinC, ClassA))
            .to.throw(Error, `The object does not have mixin '${mixinC.mixinName}'`);

        expect(() => assertHaveMixins(instance, [mixinA, mixinB, mixinC], ClassA))
            .to.throw(Error, `The object does not have one or more of mixins '${mixinA.mixinName}', '${mixinB.mixinName}', '${mixinC.mixinName}'`);
    });
});
