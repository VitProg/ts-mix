import {use} from "../decorators";
import {IUseMixins} from "../types";
import {mixin, mixinTyped} from "../index";
import * as chai from 'chai';

const expect = chai.expect;

describe("", () => {

    interface IMixinA {
        propInMixin?: number;
        readonly testA: string;

        methodInMixin(): string;

        test(): void;
    }

    const mixinA = mixinTyped<IMixinA>({
        get testA() {
            return 'test-a';
        },
        methodInMixin() {
            return this.testA;
        },
        test() {
        },
    })(
        'mixinA',
        function(this: IMixinA) {
            this.propInMixin = Math.random();
        }
    );

    const mixinB = mixin('mixinB', {
        get testB() {
            return 'test-b';
        },
        methodB() {
            return this.testB;
        },
        get test() {
            return 666;
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
    }
    interface ClassA extends IUseMixins<[typeof mixinA, typeof mixinB]> {}

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
    });

});
