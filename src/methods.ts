import {ExtractMixins, IUseMixins, IUseMixinsWithBase, Mixin} from "./types";
import {AnyObject, Constructor, RewriteConstructorResult} from "./common.types";
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
    ResultType extends RewriteConstructorResult<BaseConstr, IUseMixinsWithBase<Mixins, BaseMixins>, '__used_mixins'>>(
    baseClass: BaseConstr,
    ...mixins: Mixins
): ResultType {
    let resultClass!: ResultType;

    // tslint:disable-next-line:max-classes-per-file
    // resultClass = class extends baseClass {
    //     constructor(...args: any[]) {
    //         super(...args);
    //     }
    // } as any;

    resultClass = applyMixinsForClass(baseClass as any, ...mixins);
    return resultClass;
}
