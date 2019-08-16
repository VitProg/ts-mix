import { Mixin } from "./types";
import { AnyObject, Constructor } from "./common.types";
export declare function use<Mixins extends Array<Mixin<string, AnyObject>>>(...mixins: Mixins): <T extends Constructor<Record<string, any>>>(this: unknown, ctor: T) => T;
