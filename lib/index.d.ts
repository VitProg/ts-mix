import { Mixin } from "./types";
export declare function mixin<Name extends string, Config extends Record<string, any>>(mixinName: Name, config: Config, init?: (this: Mixin<Name, Config>) => void): Mixin<Name, Config>;
