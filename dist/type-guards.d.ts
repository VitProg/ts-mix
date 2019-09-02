import { IMixinBase, IUseMixins, Mixin, WithMixin } from "./types";
export declare function haveMixin<M extends Mixin<any, any>>(v: any, mixin: M): v is WithMixin<M>;
export declare function haveMixins<Mixins extends Array<Mixin<any, any>>>(v: any, ...mixins: Mixins): v is IUseMixins<Mixins>;
export declare function isMixin<M extends IMixinBase<any> = IMixinBase<any>>(value: any): value is M;
