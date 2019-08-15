"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const decorators_1 = require("../decorators");
const index_1 = require("../index");
const chai = require("chai");
const expect = chai.expect;
describe("", () => {
    const mixinA = index_1.mixin('mixinA', {
        get testA() {
            return 'test-a';
        },
        methodInMixin() {
            return this.testA;
        },
        test() {
        },
    });
    const mixinB = index_1.mixin('mixinB', {
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
        constructor(val) {
            this.fieldInClassA = '111';
            this.test = val;
        }
        methodInClassA() {
            return 'methodInClassA' + this.fieldInClassA;
        }
    }
    tslib_1.__decorate([
        decorators_1.use(mixinA, mixinB),
        tslib_1.__metadata("design:type", Object)
    ], ClassA.prototype, "mixins", void 0);
    let temp;
    let rnd;
    beforeEach(() => {
        temp = (new ClassA(rnd = Math.random()));
    });
    it("", () => {
        expect(temp.mixins.mixinA.methodInMixin()).equal('test-a');
        expect(temp.methodInMixin()).equal('test-a');
    });
});
//# sourceMappingURL=index.js.map