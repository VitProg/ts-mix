declare type AnyObject = Record<string, any>;
declare type ArrayValues<obj extends any[] | ReadonlyArray<any>> = obj[number];
declare type UnionToIntersection<Union> = (Union extends any ? (x: Union) => void : never) extends ((x: infer intersection) => void) ? intersection : never;
interface IMixinBase<Name extends string, Target extends AnyObject = any> {
    mixinName: Name;
    init?(): void;
    setup?(): AnyObject;
    target: MixinTarget<IMixinBase<Name, Target>, Target>;
}
declare type Mixin<Name extends string, Config extends AnyObject, Target extends AnyObject> = Config & IMixinBase<Name, Target>;
declare type MixinFull<Name extends string, Config extends AnyObject, Target extends AnyObject> = Omit<IMixinBase<Name>, 'target'> & Config & {
    target: Target & IUseMixins<AnyObject, Mixin<Name, Config, Target>>;
    origin: {
        [K in keyof Target]: Target[K] | any;
    };
};
declare type MakeMixinItem<X> = X extends IMixinBase<infer Name> ? Record<Name, X> : never;
declare type MixinsProp<Mixins extends ReadonlyArray<Mixin<any, any, any>>> = UnionToIntersection<ArrayValues<{
    [i in keyof Mixins]: MakeMixinItem<Mixins[i]>;
}>>;
declare type AnyMixin = Mixin<any, any, any>;
declare type AnyMixinRecord = Record<string, AnyMixin>;
declare type ExtractClassFields<Class> = keyof (Class extends {
    __m_b_type: Constructor<infer J>;
} ? J : (Class extends Constructor<any> ? InstanceType<Class> : Class));
declare type IUseMixins<Class extends AnyObject, M1 extends Mixin<any, any, any>, M2 extends Mixin<any, any, any> = never, M3 extends Mixin<any, any, any> = never, M4 extends Mixin<any, any, any> = never, M5 extends Mixin<any, any, any> = never, M6 extends Mixin<any, any, any> = never, M7 extends Mixin<any, any, any> = never, M8 extends Mixin<any, any, any> = never, M9 extends Mixin<any, any, any> = never, M10 extends Mixin<any, any, any> = never> = (Class extends Constructor<infer J> ? J : Class) & Omit<BuildMixinsIntersection<M1, M2, M3, M4, M5, M6, M7, M7, M9, M10>, ExtractClassFields<Class>> & MixinsPropObject<M1, M2, M3, M4, M5, M6, M7, M8, M9, M10>;
declare type MixinsPropObject<M1 extends Mixin<any, any, any>, M2 extends Mixin<any, any, any> = never, M3 extends Mixin<any, any, any> = never, M4 extends Mixin<any, any, any> = never, M5 extends Mixin<any, any, any> = never, M6 extends Mixin<any, any, any> = never, M7 extends Mixin<any, any, any> = never, M8 extends Mixin<any, any, any> = never, M9 extends Mixin<any, any, any> = never, M10 extends Mixin<any, any, any> = never> = {
    mixins: MixinsProp<[M1, M2, M3, M4, M5, M6, M7, M8, M9, M10]> & AnyMixinRecord;
};
declare type ExtractMixinsProp<T> = T extends {
    mixins: any;
} ? T['mixins'] : {};
declare type BuildMixinsIntersection<M1 extends Mixin<any, any, any>, M2 extends Mixin<any, any, any> = never, M3 extends Mixin<any, any, any> = never, M4 extends Mixin<any, any, any> = never, M5 extends Mixin<any, any, any> = never, M6 extends Mixin<any, any, any> = never, M7 extends Mixin<any, any, any> = never, M8 extends Mixin<any, any, any> = never, M9 extends Mixin<any, any, any> = never, M10 extends Mixin<any, any, any> = never> = M1 & CheckNever<M2, CheckNever<M3, CheckNever<M4, CheckNever<M5, CheckNever<M6, CheckNever<M7, CheckNever<M8, CheckNever<M9, CheckNever<M10, Omit<M10, keyof M10 | keyof M8 | keyof M7 | keyof M6 | keyof M5 | keyof M4 | keyof M3 | keyof M2 | keyof M1 | 'mixinName' | 'target' | 'init' | 'setup' | '__used_mixins'>, Omit<M9, keyof M8 | keyof M7 | keyof M6 | keyof M5 | keyof M4 | keyof M3 | keyof M2 | keyof M1 | 'mixinName' | 'target' | 'init' | 'setup' | '__used_mixins'>>, Omit<M8, keyof M7 | keyof M6 | keyof M5 | keyof M4 | keyof M3 | keyof M2 | keyof M1 | 'mixinName' | 'target' | 'init' | 'setup' | '__used_mixins'>>, Omit<M7, keyof M6 | keyof M5 | keyof M4 | keyof M3 | keyof M2 | keyof M1 | 'mixinName' | 'target' | 'init' | 'setup' | '__used_mixins'>>, Omit<M6, keyof M5 | keyof M4 | keyof M3 | keyof M2 | keyof M1 | 'mixinName' | 'target' | 'init' | 'setup' | '__used_mixins'>>, Omit<M5, keyof M4 | keyof M3 | keyof M2 | keyof M1 | 'mixinName' | 'target' | 'init' | 'setup' | '__used_mixins'>>, Omit<M4, keyof M3 | keyof M2 | keyof M1 | 'mixinName' | 'target' | 'init' | 'setup' | '__used_mixins'>>, Omit<M3, keyof M2 | keyof M1 | 'mixinName' | 'target' | 'init' | 'setup' | '__used_mixins'>>, Omit<M2, keyof M1 | 'mixinName' | 'target' | 'init' | 'setup' | '__used_mixins'>>, {}>;
declare type CheckNever<T, IfNotNever, IfNever = never> = [T] extends [never] ? IfNever : IfNotNever;
declare type MixinTarget<M extends Mixin<any, any, any>, Target extends AnyObject = any> = Target & IUseMixins<AnyObject, M>;
interface IMixinAfterInitHandler {
    __afterMixins: () => void;
}
declare class MixinAssertError extends Error {
}
declare type ConfigComplex<Name extends string, Config extends AnyObject, PartialKeys extends Array<keyof Config> = [], Target extends AnyObject = AnyObject> = PartialBy<Config, OR<PartialKeys>> & {
    mixinName: Name;
    init?: () => void;
    rewrite?: (self: MixinFull<Name, Config, Target>) => Partial<{
        [TK in keyof Target]: Target[TK] | any;
    }>;
} & (OR<PartialKeys> extends never ? {} : {
    setup: () => Required<Pick<Config, OR<PartialKeys>>>;
});
declare type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
declare type OR<T extends ReadonlyArray<any>> = T[number];
declare type Constructor<T, A extends any[] = any[]> = new (...args: A) => T;
declare type ExtractStatic<T extends AnyObject> = CheckNever<Exclude<keyof T, 'prototype'>, Omit<{
    [key in keyof T]: T[key];
}, 'prototype'>>;
declare type ConstructorWithStatic<T, Ctor extends Constructor<any>> = CheckNever<Exclude<keyof Ctor, 'prototype'>, Constructor<T, ConstructorParameters<Ctor>> & ExtractStatic<Ctor>, Constructor<T, ConstructorParameters<Ctor>>>;
declare type ExtractMixinName<M extends MixinFull<any, any, any>> = M extends MixinFull<infer I, any, any> ? I : any;
declare type ExtractMixinConfig<M extends MixinFull<any, any, any>> = M extends MixinFull<any, infer I, any> ? I : any;
declare type ExtractMixinTarget<M extends MixinFull<any, any, any>> = M extends MixinFull<infer N, infer C, infer T> ? T : AnyObject;
declare type EMT<M extends Mixin<any, any, any> | MixinFull<any, any, any>> = CheckNever<M, ExtractMixinTarget<M>, AnyObject>;
declare type ExtractMixinsTargets<M1 extends Mixin<any, any, any>, M2 extends Mixin<any, any, any> = never, M3 extends Mixin<any, any, any> = never, M4 extends Mixin<any, any, any> = never, M5 extends Mixin<any, any, any> = never, M6 extends Mixin<any, any, any> = never, M7 extends Mixin<any, any, any> = never, M8 extends Mixin<any, any, any> = never, M9 extends Mixin<any, any, any> = never, M10 extends Mixin<any, any, any> = never> = AnyObject & EMT<M1> & EMT<M2> & EMT<M3> & EMT<M4> & EMT<M5> & EMT<M6> & EMT<M7> & EMT<M8> & EMT<M9> & EMT<M10>;

declare function haveMixin<M extends Mixin<any, any, any>, Class extends AnyObject | any = never>(v: AnyObject, mixin: M, vClass?: Class): v is (CheckNever<Class, IUseMixins<Class, M>, MixinsPropObject<M>>);
declare function haveMixins<Mixins extends Array<Mixin<any, any, any>>, Class extends AnyObject | any = never>(v: AnyObject, mixins: Mixins, vClass?: Class): v is (CheckNever<Class, IUseMixins<Class, Mixins[0], Mixins[1], Mixins[2], Mixins[3], Mixins[4]>, MixinsPropObject<Mixins[0], Mixins[1], Mixins[2], Mixins[3], Mixins[4]>>);
declare function isMixin<M extends IMixinBase<any> = IMixinBase<any>>(value: any): value is M;
declare function assertHaveMixin<M extends Mixin<any, any, any>, Class extends AnyObject | any = never>(v: AnyObject, mixin: M, vClass?: Class, error?: string | Error): asserts v is (CheckNever<Class, IUseMixins<Class, M>, MixinsPropObject<M>>);
declare function assertHaveMixins<MM extends Array<Mixin<any, any, any>>, Class extends AnyObject | any = never>(v: AnyObject, mixins: MM, vClass?: Class, error?: string | Error): asserts v is (CheckNever<Class, IUseMixins<Class, MM[0], MM[1], MM[2], MM[3], MM[4], MM[5], MM[6], MM[7], MM[8], MM[9]>, MixinsPropObject<MM[0], MM[1], MM[2], MM[3], MM[4], MM[5], MM[6], MM[7], MM[8], MM[9]>>);

declare function mixin<Name extends string, Config extends AnyObject, PartialKeys extends Array<keyof Config> = [], Target extends AnyObject = AnyObject>(config: (Config | ConfigComplex<Name, Config, PartialKeys, Target>) & ThisType<MixinFull<Name, Config, Target>>): MixinFull<Name, Config, Target>;
declare function useMixinsForObject<T extends ExtractMixinsTargets<M1, M2, M3, M4, M5, M6, M7, M8, M9, M10>, M1 extends Mixin<any, any, any>, M2 extends Mixin<any, any, any> = never, M3 extends Mixin<any, any, any> = never, M4 extends Mixin<any, any, any> = never, M5 extends Mixin<any, any, any> = never, M6 extends Mixin<any, any, any> = never, M7 extends Mixin<any, any, any> = never, M8 extends Mixin<any, any, any> = never, M9 extends Mixin<any, any, any> = never, M10 extends Mixin<any, any, any> = never>(target: T, m1: M1, m2?: M2, m3?: M3, m4?: M4, m5?: M5, m6?: M6, m7?: M7, m8?: M8, m9?: M9, m10?: M10): Omit<T, 'mixins'> & Omit<BuildMixinsIntersection<M1, M2, M3, M4, M5, M6, M7, M8, M9, M10>, keyof T> & {
    mixins: ExtractMixinsProp<T> & MixinsProp<[M1, M2, M3, M4, M5, M6, M7, M8, M9, M10]>;
};
declare function useMixins<Target extends ExtractMixinsTargets<M1, M2, M3, M4, M5, M6, M7, M8, M9, M10>, Ctor extends Constructor<Target>, Instance extends InstanceType<Ctor>, CtorArguments extends ConstructorParameters<Ctor>, NewInstance extends Omit<Instance, 'mixins' | '__m_b_type'> & Omit<BuildMixinsIntersection<M1, M2, M3, M4, M5, M6, M7, M8, M9, M10>, keyof Instance> & {
    mixins: ExtractMixinsProp<Instance> & MixinsProp<[M1, M2, M3, M4, M5, M6, M7, M8, M9, M10]>;
}, M1 extends Mixin<any, any, any>, M2 extends Mixin<any, any, any> = never, M3 extends Mixin<any, any, any> = never, M4 extends Mixin<any, any, any> = never, M5 extends Mixin<any, any, any> = never, M6 extends Mixin<any, any, any> = never, M7 extends Mixin<any, any, any> = never, M8 extends Mixin<any, any, any> = never, M9 extends Mixin<any, any, any> = never, M10 extends Mixin<any, any, any> = never>(klass: Ctor, m1: M1, m2?: M2, m3?: M3, m4?: M4, m5?: M5, m6?: M6, m7?: M7, m8?: M8, m9?: M9, m10?: M10): ConstructorWithStatic<NewInstance, Ctor> & {
    __m_b_type: Ctor;
};
declare function applyMixins<T extends AnyObject, Mixins extends Array<Mixin<any, any, any>>>(target: T, ...mixins: Mixins): void;

declare function mixinsProp<T extends AnyObject, M1 extends Mixin<any, any, any>, M2 extends Mixin<any, any, any> = never, M3 extends Mixin<any, any, any> = never, M4 extends Mixin<any, any, any> = never, M5 extends Mixin<any, any, any> = never, M6 extends Mixin<any, any, any> = never, M7 extends Mixin<any, any, any> = never, M8 extends Mixin<any, any, any> = never, M9 extends Mixin<any, any, any> = never, M10 extends Mixin<any, any, any> = never>(m1: M1, m2?: M2, m3?: M3, m4?: M4, m5?: M5, m6?: M6, m7?: M7, m8?: M8, m9?: M9, m10?: M10): (target: T, propertyKey: "mixins") => void;

export { AnyMixin, AnyMixinRecord, ArrayValues, ExtractMixinConfig, ExtractMixinName, ExtractMixinTarget, ExtractMixinsTargets, IMixinAfterInitHandler, IMixinBase, IUseMixins, Mixin, MixinAssertError, MixinFull, MixinTarget, MixinsProp, UnionToIntersection, applyMixins, assertHaveMixin, assertHaveMixins, haveMixin, haveMixins, isMixin, mixin, mixinsProp, useMixins, useMixinsForObject };
