import {Mixin} from "./types";
import {AnyObject} from "./common.types";


export function mixin<Name extends string, Config extends Record<string, any>>(
    mixinName: Name,
    config: Config,
    init?: (this: Mixin<Name, Config>) => void,
): Mixin<Name, Config> {
    return {
        mixinName,
        target: {},
        init(target: AnyObject) {
            this.target = target;
            if (init) {
                init.call(this as any);
            }
        },
        ...config,
    };
}
