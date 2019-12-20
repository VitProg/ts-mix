import {IMixinBase, IUseMixins, Mixin, MixinAssertError} from "./types";
import {AnyObject, Constructor} from "./common.types";

// noinspection JSUnusedLocalSymbols
export function haveMixin<M extends Mixin<any, any>, Class extends AnyObject = {}>(
    v: AnyObject, mixin: M,
    vClass?: Class
): v is IUseMixins<[M], Class> {
    return typeof v === "object" && 'mixins' in v && typeof v.mixins === 'object' &&
        mixin.mixinName in v.mixins && typeof v.mixins[mixin.mixinName] === 'object';
}

// noinspection JSUnusedLocalSymbols
export function haveMixins<Mixins extends Array<Mixin<any, any>>, Class extends AnyObject = {}>(
    v: AnyObject,
    mixins: Mixins,
    vClass?: Class,
): v is IUseMixins<Mixins, Class> {
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


export function isMixin<M extends IMixinBase<any> = IMixinBase<any>>(value: any): value is M {
    return typeof value === 'object' &&
        typeof value?.mixinName === 'string' &&
        typeof value?.target === 'object' &&
        typeof value?.target?.mixins === 'object' &&
        value?.mixinName in value?.target?.mixins;
}

/// asserts functions

export function assertHaveMixin<M extends Mixin<any, any>, Class extends AnyObject = {}>(
    v: AnyObject,
    mixin: M,
    vClass?: Class,
    error?: string | Error,
): asserts v is IUseMixins<[M], typeof v> {
    if (haveMixin(v, mixin, vClass) === false) {
        if (error instanceof Error) {
            throw error;
        } else {
            throw new MixinAssertError(error ?? `The object does not have mixin '${mixin.mixinName}'`);
        }
    }
}


export function assertHaveMixins<Mixins extends Array<Mixin<any, any>>, Class extends AnyObject = {}>(
    v: AnyObject,
    mixins: Mixins,
    vClass?: Class,
    error?: string | Error,
): asserts v is IUseMixins<Mixins, typeof v> {
    if (haveMixins(v, mixins, vClass) === false) {
        if (error instanceof Error) {
            throw error;
        } else {
            throw new MixinAssertError(
                error ?? `The object does not have one or more of mixins ${mixins.map(m => `'${m.mixinName}'`).join(', ')}`
            );
        }
    }
}
