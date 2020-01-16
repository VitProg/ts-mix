import {AnyObject, Mixin} from "./types";
import {applyMixins} from "./mixin";

export function mixinsProp<T extends AnyObject,
    M1 extends Mixin<any, any, any>,
    M2 extends Mixin<any, any, any> = never,
    M3 extends Mixin<any, any, any> = never,
    M4 extends Mixin<any, any, any> = never,
    M5 extends Mixin<any, any, any> = never,
    M6 extends Mixin<any, any, any> = never,
    M7 extends Mixin<any, any, any> = never,
    M8 extends Mixin<any, any, any> = never,
    M9 extends Mixin<any, any, any> = never,
    M10 extends Mixin<any, any, any> = never,
    >(
    m1: M1, m2?: M2, m3?: M3, m4?: M4, m5?: M5, m6?: M6, m7?: M7, m8?: M8, m9?: M9, m10?: M10,
) {
    return (target: T, propertyKey: 'mixins'): void => {
        let step = 0;
        let val: any | undefined;

        Reflect.defineProperty(target, propertyKey, {
            get() {
                if (step === 0) {
                    step++;
                    return false;
                } else
                if (step === 1) {
                    step++;
                    Reflect.deleteProperty(target, propertyKey);
                    applyMixins(target, m1, m2, m3, m4, m5, m6, m7, m8, m9, m10);
                }
                return val;
            },
            set(newValue) {
                val = newValue;
            },
        });
    };
}
