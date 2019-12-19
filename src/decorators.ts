import {AppendsIfNotExist, ExtractMixins, IUseMixins, IUseMixinsWithBase, Mixin, MixinsProp} from "./types";
import {AnyObject, Constructor, ExtractConstructor, RewriteConstructorResult, RewriteConstructorResult2} from "./common.types";
import {applyMixinsForClass, applyMixins} from "./mixin";

export function use<Mixins extends Array<Mixin<string, AnyObject>>>(...mixins: Mixins) {
    return function<T extends Constructor<AnyObject>>(this: unknown, ctor: T): T {
        return applyMixinsForClass(ctor, ...mixins);
    };
}

export function useProxy<Mixins extends Array<Mixin<string, AnyObject>>>(...mixins: Mixins) {
    return function<T extends Constructor<AnyObject>>(this: unknown, ctor: T): T {
        // noinspection UnnecessaryLocalVariableJS
        const newClass = new Proxy(ctor, {
            construct(target: T, args: any) {
                const result: T & IUseMixins<Mixins> = Reflect.construct(target, args);

                applyMixins(result, mixins);

                return result;
            },
        });

        return newClass;
    };
}

export function mixinsProp<Mixins extends Array<Mixin<string, AnyObject>>>(...mixins: Mixins) {
    return (target: object, property: 'mixins'): void => {
        applyMixins(target, mixins);
    };
}


export function UseMixins<
    Mixins extends Array<Mixin<string, AnyObject>>,
    ResultType = Constructor<IUseMixins<Mixins>>,
>(
    ...mixins: Mixins
): ResultType {
    let resultClass!: ResultType;

    // tslint:disable-next-line:max-classes-per-file
    resultClass = class {} as any;

    applyMixinsForClass(resultClass as any, ...mixins);
    return resultClass;
}

export function UseMixinsExtends<
    Mixins extends Array<Mixin<string, AnyObject>>,
    BaseConstr extends Constructor<AnyObject>,
    BaseType extends InstanceType<BaseConstr>, // extends Constructor<infer I> ? I : never),
    // BaseConstr extends ExtractConstructor<Base>,
    BaseMixins extends ExtractMixins<BaseType>,
    ResultType extends
        (
            // Constructor<IUseMixinsWithBase<Mixins, BaseMixins> & Omit<BaseType, '__used_mixins'> & {__t: BaseConstr}>
            RewriteConstructorResult2<BaseConstr, IUseMixinsWithBase<Mixins, BaseMixins>, '__used_mixins'>
            /*RewriteConstructorResult2<BaseConstr, IUseMixinsWithBase<Mixins, BaseMixins> & {
                __dbg: {
                    Mixins: Mixins,
                    BaseConstr: BaseConstr,
                    BaseType: BaseType,
                    BaseMixins: BaseMixins,
                    testMixins: IUseMixinsWithBase<Mixins, BaseMixins>,
                    ConcatMixins: AppendsIfNotExist<BaseMixins, Mixins>,
                    ResultType:
                        RewriteConstructorResult<
                            BaseConstr, IUseMixinsWithBase<Mixins, BaseMixins> & Omit<BaseType, '__used_mixins'>
                        >,
                    ResultType1:
                        RewriteConstructorResult2<
                            BaseConstr,
                            IUseMixinsWithBase<Mixins, BaseMixins>,
                            '__used_mixins'
                        >,
                },
            }, '__used_mixins'>*/
        )
>(
    baseClass: BaseConstr,
    ...mixins: Mixins
): ResultType {
    let resultClass!: ResultType;

    // tslint:disable-next-line:max-classes-per-file
    resultClass = class extends baseClass {
        constructor(...args: any[]) {
            super(...args);
        }
    } as any;

    applyMixinsForClass(resultClass as any, ...mixins);
    return resultClass;
}

