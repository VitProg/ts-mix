"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function mixin(mixinName, config, init) {
    return Object.assign({ mixinName, target: {}, init(target) {
            this.target = target;
            if (init) {
                init.call(this);
            }
        } }, config);
}
exports.mixin = mixin;
//# sourceMappingURL=index.js.map