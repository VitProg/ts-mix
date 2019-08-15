export function haveMixin(v, mixin) {
    return typeof v === "object" && 'mixins' in v && typeof v.mixins === 'object' &&
        mixin.mixinName in v.mixins && typeof v.mixins[mixin.mixinName] === 'object';
}
export function haveMixins(v, ...mixins) {
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
//# sourceMappingURL=type-guards.js.map