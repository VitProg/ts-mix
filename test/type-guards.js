"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function haveMixin(v, mixin) {
    return typeof v === "object" && 'mixins' in v && typeof v.mixins === 'object' &&
        mixin.mixinName in v.mixins && typeof v.mixins[mixin.mixinName] === 'object';
}
exports.haveMixin = haveMixin;
function haveMixins(v, ...mixins) {
    const baseCheck = typeof v === "object" && 'mixins' in v && typeof v.mixins === 'object';
    if (!baseCheck) {
        return false;
    }
    for (const mixin of mixins) {
        if (haveMixin(v, mixin) === false) {
            return false;
        }
    }
    return true;
}
exports.haveMixins = haveMixins;
//# sourceMappingURL=type-guards.js.map