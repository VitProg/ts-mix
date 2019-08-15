// import {MixinTarget, WithMixin} from "../types";
// import {mixin} from "../index";
// import {haveMixin, haveMixins} from "../type-guards";
//
//
// const mixinA = mixin('mixinA', {
//     get testA() {
//         return 'test-a';
//     },
//     methodInMixin() {
//         return this.testA;
//     },
//     test() {},
// });
// const mixinB = mixin('mixinB', {
//     get testB() {
//         return 'test-a';
//     },
//     methodB() {
//         return this.testB;
//     },
//     test() {},
// });
//
// declare const ttt: MixinTarget;
//
// if (haveMixins(ttt, mixinA, mixinB)) {
//
// }
//
//
// declare const test2: WithMixin<typeof mixinB>;
// test2.mixins.mixinB.test();
