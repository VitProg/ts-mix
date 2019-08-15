import {use} from "../decorators";
import {IUseMixins, MixinsProp} from "../types";
import {mixin} from "../index";
import * as chai from 'chai';
const expect = chai.expect;

describe("", () => {

    const mixinA = mixin('mixinA', {
        get testA() {
            return 'test-a';
        },
        methodInMixin() {
            return this.testA;
        },
        test() {
        },
    });

    const mixinB = mixin('mixinB', {
        get testB() {
            return 'test-a';
        },
        methodB() {
            return this.testB;
        },
        get test() {
            return 666;
        },
    });

    class ClassA {
        @use(mixinA, mixinB) mixins!: MixinsProp<[typeof mixinA, typeof mixinB]>;

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
    let temp: IClassA;
    // @ts-ignore
    let rnd: number;

    beforeEach(() => {
        temp = (new ClassA(rnd = Math.random())) as any;
    });


    it("", () => {
        expect(temp.mixins.mixinA.methodInMixin()).equal('test-a');
        expect(temp.methodInMixin()).equal('test-a');

    });

});
