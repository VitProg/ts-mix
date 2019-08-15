export function use(...mixins) {
    return function (target, propertyKey) {
        console.log(mixins);
        const targetMixins = mix(target.constructor, ...mixins);
        console.log('targetMixins', targetMixins);
        target[propertyKey] = targetMixins;
    };
}
export function mix(client, ...mixins) {
    const targetMixins = {};
    for (const mixin of mixins) {
        const mixables = getMixables(mixin);
        console.log('mixables', mixables);
        targetMixins[mixin.mixinName] = mixin;
        const clientKeys = Object.getOwnPropertyNames(client.prototype);
        for (const propName of Object.keys(mixables)) {
            const propDescription = mixables[propName];
            if (clientKeys.indexOf(propName) !== -1) {
                Object.defineProperty(client.prototype, propName, propDescription);
            }
        }
    }
    return targetMixins;
}
function getMixables(obj) {
    const map = {};
    const propNames = Object.getOwnPropertyNames(obj).filter(i => i !== 'init' && i !== 'target' && i !== 'mixinName');
    for (const propName of propNames) {
        const descriptor = Object.getOwnPropertyDescriptor(obj, propName);
        if (descriptor === undefined) {
            continue;
        }
        map[propName] = descriptor;
    }
    return map;
}
//# sourceMappingURL=decorators.js.map