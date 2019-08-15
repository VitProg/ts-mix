export function mixin(mixinName, config, init) {
    return Object.assign({ mixinName, target: {}, init(target) {
            this.target = target;
            if (init) {
                init.call(this);
            }
        } }, config);
}
//# sourceMappingURL=index.js.map