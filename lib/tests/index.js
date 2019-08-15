import * as tslib_1 from "tslib";
import { use } from "../decorators";
import { mixin } from "../index";
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
        constructor(val) {
            this.fieldInClassA = '111';
            this.test = val;
        }
        methodInClassA() {
            return 'methodInClassA' + this.fieldInClassA;
        }
    }
    tslib_1.__decorate([
        use(mixinA, mixinB),
        tslib_1.__metadata("design:type", Object)
    ], ClassA.prototype, "mixins", void 0);
    let temp;
    let rnd;
    beforeEach(() => {
        temp = (new IClassA(rnd = Math.random()));
    });
    it("", () => {
        assert.strictEqual(temp.mixins.mixinA.methodInMixin(), 'test-a');
        assert.strictEqual(temp.methodInMixin(), 'test-a');
    });
});
//# sourceMappingURL=index.js.map