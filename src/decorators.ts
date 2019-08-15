import {Mixin} from "./types";
import {AnyObject, Constructor} from "./common.types";

export function use<Mixins extends Array<Mixin<string, AnyObject>>>(...mixins: Mixins) {
    return function(this: any, target: any, propertyKey: string) {
        //todo
        console.log(mixins);

        // const targetKeys = Object.getOwnPropertyNames(target.prototype);

        const targetMixins = mix(target, ...mixins);
        console.log('targetMixins', targetMixins);
        target[propertyKey] = targetMixins;

        // target.constructor = class extends target.constructor {
        //     constructor(...args: any[]) {
        //         super(...args);
        //         for (const mixin of this.mixins) {
        //             mixin.init();
        //         }
        //     }
        // };
        const or = target.constructor;
        target.constructor = function(this: any, ...args: any[]) {
            or(...args);
            debugger
        };
    };
}

export function mix<Mixins extends Array<Mixin<string, AnyObject>>>(client: AnyObject, ...mixins: Mixins) {
    const targetMixins: Record<string, Mixin<string, AnyObject>> = {};

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


/**
 * Returns a map of mixables. That is things that can be mixed in
 */
function getMixables(obj: object): PropertyDescriptorMap {
    const map: PropertyDescriptorMap = {};
    const propNames = Object.getOwnPropertyNames(obj).filter(i => i !== 'init' && i !== 'target' && i !== 'mixinName');

    for (const propName of propNames) {
        const descriptor = Object.getOwnPropertyDescriptor(obj, propName);

        if (descriptor === undefined) {
            continue;
        }

        // if (descriptor.get || descriptor.set) {
        //     map[propName] = descriptor;
        // } else if (typeof descriptor.value === "function") {
        //     map[propName] = descriptor;
        // } else {
        //
        // }
        map[propName] = descriptor;
    }

    return map;
}
