import {ExtractMixins, IUseMixins, IUseMixinsWithBase, Mixin} from "./types";
import {AnyObject, Constructor, RewriteConstructorResult, RewriteConstructorResult1} from "./common.types";
import {applyMixins, applyMixinsForClass} from "./mixin";

export function UseMixins<Mixins extends Array<Mixin<string, AnyObject>>,
    ResultType = Constructor<IUseMixins<Mixins>>,
    >(
    ...mixins: Mixins
): ResultType {
    let resultClass!: ResultType;

    // tslint:disable-next-line:max-classes-per-file
    resultClass = class {
        constructor() {
            applyMixins(this as any, mixins);
        }
    } as any;

    return resultClass;
}

export function UseMixinsExtends<Mixins extends Array<Mixin<string, AnyObject>>,
    BaseConstr extends Constructor<AnyObject>,
    BaseType extends InstanceType<BaseConstr>,
    BaseMixins extends ExtractMixins<BaseType>,
    ResultCtor extends RewriteConstructorResult1<BaseConstr, IUseMixinsWithBase<Mixins, BaseMixins, BaseType>, '__used_mixins'>,
    // ResultCtor extends RewriteConstructorResult<
    //     BaseConstr,
    //     Omit<IUseMixinsWithBase<Mixins, BaseMixins>, keyof BaseType> & {___: {
    //         _1: keyof Omit<IUseMixinsWithBase<Mixins, BaseMixins>, keyof BaseType>,
    //         _2: keyof BaseType,
    //         _3: keyof IUseMixinsWithBase<Mixins, BaseMixins>,
    //     }},
    //     '__used_mixinsq'
    // >
>(
    baseClass: BaseConstr,
    ...mixins: Mixins
): ResultCtor {
    let resultClass!: ResultCtor;

    // tslint:disable-next-line:max-classes-per-file
    // resultClass = class extends baseClass {
    //     constructor(...args: any[]) {
    //         super(...args);
    //     }
    // } as any;

    resultClass = applyMixinsForClass(baseClass as any, ...mixins);
    return resultClass;
}
