import { Mixin } from "./types";
import { AnyObject } from "./common.types";
export declare function mixin<Name extends string, Config extends AnyObject>(mixinName: Name, config: Config, init?: (this: Mixin<Name, Config>) => void): Mixin<Name, Config>;
