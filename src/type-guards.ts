import {IUseMixins, Mixin, WithMixin} from "./types";


export function haveMixin<M extends Mixin<any, any>>(v: any, mixin: M): v is WithMixin<M> {
    return typeof v === "object" && 'mixins' in v && typeof v.mixins === 'object' &&
        mixin.mixinName in v.mixins && typeof v.mixins[mixin.mixinName] === 'object';
}

export function haveMixins<Mixins extends Array<Mixin<any, any>>>(v: any, ...mixins: Mixins): v is IUseMixins<Mixins> {
    const baseCheck = typeof v === "object" && 'mixins' in v && typeof v.mixins === 'object';

    if (!baseCheck) {
        return false;
    }

    for (const mixin of mixins) {
        if (haveMixin(v, mixin) === false) {
            return false;
        }
    }

    return true;
}
