"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function use(...mixins) {
    return function (target, propertyKey) {
        console.log(mixins);
        const targetMixins = mix(target, ...mixins);
        console.log('targetMixins', targetMixins);
        target[propertyKey] = targetMixins;
        const or = target.constructor;
        target.constructor = function (...args) {
            or(...args);
            debugger;
        };
    };
}
exports.use = use;
function mix(client, ...mixins) {
    const targetMixins = {};
    for (const mixin of mixins) {
        const mixables = getMixables(mixin);
        console.log('mixables', mixables);
        targetMixins[mixin.mixinName] = mixin;
        const clientKeys = [...Object.getOwnPropertyNames(client)];
        for (const propName of Object.keys(mixables)) {
            const propDescription = mixables[propName];
            if (clientKeys.indexOf(propName) === -1) {
                Object.defineProperty(client, propName, propDescription);
            }
        }
    }
    return targetMixins;
}
exports.mix = mix;
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