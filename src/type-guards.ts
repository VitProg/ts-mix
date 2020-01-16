import {AnyObject, CheckNever, Constructor, IMixinBase, IUseMixins, Mixin, MixinAssertError, MixinsPropObject} from "./types";

// noinspection JSUnusedLocalSymbols
export function haveMixin<M extends Mixin<any, any, any>, Class extends AnyObject | any = never>(
    v: AnyObject,
    mixin: M,
    vClass?: Class
): v is (
    CheckNever<Class,
        IUseMixins<Class, M>,
        MixinsPropObject<M>
>) {
    return typeof v === "object" && 'mixins' in v && typeof v.mixins === 'object' &&
        mixin.mixinName in v.mixins && typeof v.mixins[mixin.mixinName] === 'object';
}

// noinspection JSUnusedLocalSymbols
export function haveMixins<Mixins extends Array<Mixin<any, any, any>>, Class extends AnyObject | any = never>(
    v: AnyObject,
    mixins: Mixins,
    vClass?: Class,
): v is (
    CheckNever<Class,
        IUseMixins<Class, Mixins[0], Mixins[1], Mixins[2], Mixins[3], Mixins[4]>,
        MixinsPropObject<Mixins[0], Mixins[1], Mixins[2], Mixins[3], Mixins[4]>
>) {
    const baseCheck = typeof v === "object" && 'mixins' in v && typeof v.mixins === 'object';

    if (!baseCheck) {
        return false;
    }

    for (const mixin of mixins) {
        if (haveMixin(v, mixin, vClass) === false) {
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

export function assertHaveMixin<M extends Mixin<any, any, any>, Class extends AnyObject | any = never>(
    v: AnyObject,
    mixin: M,
    vClass?: Class,
    error?: string | Error,
): asserts v is (
    CheckNever<Class,
        IUseMixins<Class, M>,
        MixinsPropObject<M>
>) {
    if (haveMixin(v, mixin, vClass) === false) {
        if (error instanceof Error) {
            throw error;
        } else {
            throw new MixinAssertError(error ?? `The object does not have mixin '${mixin.mixinName}'`);
        }
    }
}



export function assertHaveMixins<MM extends Array<Mixin<any, any, any>>, Class extends AnyObject | any = never>(
    v: AnyObject,
    mixins: MM,
    vClass?: Class,
    error?: string | Error,
): asserts v is (
    CheckNever<Class,
        IUseMixins<Class, MM[0], MM[1], MM[2], MM[3], MM[4], MM[5], MM[6], MM[7], MM[8], MM[9]>,
        MixinsPropObject<MM[0], MM[1], MM[2], MM[3], MM[4], MM[5], MM[6], MM[7], MM[8], MM[9]>
>) {
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
