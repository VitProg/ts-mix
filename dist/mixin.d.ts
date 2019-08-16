import { Mixin } from "./types";
import { AnyObject } from "./common.types";
export declare function mixin<Name extends string, Config extends AnyObject>(config: Config & {
    mixinName: Name;
    init?: (this: Mixin<Name, Config>) => void;
}): Mixin<Name, Config>;
