import * as chai from 'chai';
import {mixin} from "../mixin";
import {use} from "../decorators";
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

    it("should be type guards correct work", () => {
        const mixinC = mixin({
            mixinName: 'mixinC',
            methodC() {
                return 'methodC';
            },
        });
        expect(haveMixin(temp, mixinA)).true;
        expect(haveMixin(temp, mixinB)).true;
        expect(haveMixin(temp, mixinC)).false;
        expect(haveMixins(temp, mixinA)).true;
        expect(haveMixins(temp, mixinA, mixinB)).true;
        expect(haveMixins(temp, mixinA, mixinB, mixinC)).false;
    });

    it('from readme.md', () => {
        const instance = new ClassA(123);
        expect(instance.methodInClassA()).equal('methodInClassA111');
        expect(instance.methodB()).equal('test-b');
        expect(instance.mixins.mixinB.methodB()).equal('test-b');
        expect(instance.methodInMixin()).equal('test-a');
    });

});
