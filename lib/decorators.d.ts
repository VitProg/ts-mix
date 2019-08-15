import { Mixin } from "./types";
import { AnyObject, Constructor } from "./common.types";
export declare function use<Mixins extends Array<Mixin<string, AnyObject>>>(...mixins: Mixins): (this: any, target: any, propertyKey: string) => void;
export declare function mix<Mixins extends Array<Mixin<string, AnyObject>>>(client: Constructor<any>, ...mixins: Mixins): Record<string, Mixin<string, Record<string, any>>>;
