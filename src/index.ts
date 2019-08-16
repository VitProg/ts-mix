import {Mixin} from "./types";
import {AnyObject} from "./common.types";

export function mixinTyped<MixinInterface extends AnyObject>(
    config: MixinInterface,
) {
    return <Name extends string, Config extends MixinInterface>(
        mixinName: Name,
        init?: (this: Mixin<Name, Config>) => void,
    ): Mixin<Name, Config>  => {
        return {
            mixinName,
            target: undefined as any,
            init,
            ...(config as Config),
        };
    };
}

export function mixin<Name extends string, Config extends AnyObject>(
    mixinName: Name,
    config: Config,
    init?: (this: Mixin<Name, Config>) => void,
): Mixin<Name, Config> {
    return {
        mixinName,
        target: undefined as any,
        init,
        ...config,
    };
}
