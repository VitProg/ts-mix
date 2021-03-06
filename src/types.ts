/* tslint:disable:max-line-length interface-over-type-literal */

export type AnyObject = Record<string, any>;
export type ArrayValues<obj extends any[] | ReadonlyArray<any>> =
    obj[number];
export type UnionToIntersection<Union> =
    (Union extends any ? (x: Union) => void : never) extends ((x: infer intersection) => void)
        ? intersection
        : never;

export interface IMixinBase<Name extends string, Target extends AnyObject = any> {
    mixinName: Name;

    init?(): void;

    setup?(): AnyObject; // todo
    target: MixinTarget<IMixinBase<Name, Target>, Target>;
}


export type Mixin<Name extends string, Config extends AnyObject, Target extends AnyObject> = Config & IMixinBase<Name, Target>;
export type MixinFull<Name extends string, Config extends AnyObject, Target extends AnyObject> =
    Omit<IMixinBase<Name>, 'target'> & Config &
    {
        target: Target & IUseMixins<AnyObject, Mixin<Name, Config, Target>>,
        origin: {[K in keyof Target]: Target[K] | any},
    };

type MakeMixinItem<X> =
    X extends IMixinBase<infer Name>
        ? Record<Name, X>
        : never;

export type MixinsProp<Mixins extends ReadonlyArray<Mixin<any, any, any>>> =
    UnionToIntersection<ArrayValues<{ [i in keyof Mixins]: MakeMixinItem<Mixins[i]> }>>;


export type AnyMixin = Mixin<any, any, any>;
export type AnyMixinRecord = Record<string, AnyMixin>;

type ExtractClassFields<Class> = keyof (
    Class extends { __m_b_type: Constructor<infer J> } ? J : (
        Class extends Constructor<any> ? InstanceType<Class> :
            Class
        ));

export type IUseMixins<Class extends AnyObject,
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
    > = (Class extends Constructor<infer J> ? J : Class) &
    Omit<BuildMixinsIntersection<M1, M2, M3, M4, M5, M6, M7, M7, M9, M10>, ExtractClassFields<Class>> &
    MixinsPropObject<M1, M2, M3, M4, M5, M6, M7, M8, M9, M10>;

export type MixinsPropObject<M1 extends Mixin<any, any, any>,
    M2 extends Mixin<any, any, any> = never,
    M3 extends Mixin<any, any, any> = never,
    M4 extends Mixin<any, any, any> = never,
    M5 extends Mixin<any, any, any> = never,
    M6 extends Mixin<any, any, any> = never,
    M7 extends Mixin<any, any, any> = never,
    M8 extends Mixin<any, any, any> = never,
    M9 extends Mixin<any, any, any> = never,
    M10 extends Mixin<any, any, any> = never,
    > = { mixins: MixinsProp<[M1, M2, M3, M4, M5, M6, M7, M8, M9, M10]> & AnyMixinRecord };


export type ExtractMixinsProp<T> = T extends { mixins: any } ? T['mixins'] : {};

export type BuildMixinsIntersection<M1 extends Mixin<any, any, any>,
    M2 extends Mixin<any, any, any> = never,
    M3 extends Mixin<any, any, any> = never,
    M4 extends Mixin<any, any, any> = never,
    M5 extends Mixin<any, any, any> = never,
    M6 extends Mixin<any, any, any> = never,
    M7 extends Mixin<any, any, any> = never,
    M8 extends Mixin<any, any, any> = never,
    M9 extends Mixin<any, any, any> = never,
    M10 extends Mixin<any, any, any> = never,
    > =
    M1 &
    CheckNever<M2,
        CheckNever<M3,
            CheckNever<M4,
                CheckNever<M5,
                    CheckNever<M6,
                        CheckNever<M7,
                            CheckNever<M8,
                                CheckNever<M9,
                                    CheckNever<M10,
                                        Omit<M10, keyof M10 | keyof M8 | keyof M7 | keyof M6 | keyof M5 | keyof M4 | keyof M3 | keyof M2 | keyof M1 | 'mixinName' | 'target' | 'init' | 'setup' | '__used_mixins'>,
                                        Omit<M9, keyof M8 | keyof M7 | keyof M6 | keyof M5 | keyof M4 | keyof M3 | keyof M2 | keyof M1 | 'mixinName' | 'target' | 'init' | 'setup' | '__used_mixins'>>,
                                    Omit<M8, keyof M7 | keyof M6 | keyof M5 | keyof M4 | keyof M3 | keyof M2 | keyof M1 | 'mixinName' | 'target' | 'init' | 'setup' | '__used_mixins'>>,
                                Omit<M7, keyof M6 | keyof M5 | keyof M4 | keyof M3 | keyof M2 | keyof M1 | 'mixinName' | 'target' | 'init' | 'setup' | '__used_mixins'>>,
                            Omit<M6, keyof M5 | keyof M4 | keyof M3 | keyof M2 | keyof M1 | 'mixinName' | 'target' | 'init' | 'setup' | '__used_mixins'>>,
                        Omit<M5, keyof M4 | keyof M3 | keyof M2 | keyof M1 | 'mixinName' | 'target' | 'init' | 'setup' | '__used_mixins'>>,
                    Omit<M4, keyof M3 | keyof M2 | keyof M1 | 'mixinName' | 'target' | 'init' | 'setup' | '__used_mixins'>>,
                Omit<M3, keyof M2 | keyof M1 | 'mixinName' | 'target' | 'init' | 'setup' | '__used_mixins'>>,
            Omit<M2, keyof M1 | 'mixinName' | 'target' | 'init' | 'setup' | '__used_mixins'>>,
        {}>;


export type CheckNever<T, IfNotNever, IfNever = never> = [T] extends [never] ? IfNever : IfNotNever;


export type MixinTarget<M extends Mixin<any, any, any>, Target extends AnyObject = any> = Target & IUseMixins<AnyObject, M>;


export const mixinsAfterInit = '__afterMixins';

export interface IMixinAfterInitHandler {
    __afterMixins: () => void;
}


////////////////


export class MixinAssertError extends Error {
}


export type ConfigComplex<Name extends string, Config extends AnyObject, PartialKeys extends Array<keyof Config> = [], Target extends AnyObject = AnyObject>
    = PartialBy<Config, OR<PartialKeys>> &
    {
        mixinName: Name,
        init?: () => void,
        // rewrite?: Partial<{ [TK in keyof Target]: Target[TK] | any }>,
        rewrite?: (self: MixinFull<Name, Config, Target>) => Partial<{ [TK in keyof Target]: Target[TK] | any }>,
    } &
    (OR<PartialKeys> extends never ? {} : { setup: () => Required<Pick<Config, OR<PartialKeys>>> });
type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
type OR<T extends ReadonlyArray<any>> = T[number];


export type Constructor<T, A extends any[] = any[]> = new (...args: A) => T;

export type ExtractStatic<T extends AnyObject> = CheckNever<Exclude<keyof T, 'prototype'>, Omit<{ [key in keyof T]: T[key] }, 'prototype'>>;

export type ConstructorWithStatic<T, Ctor extends Constructor<any>> =
    CheckNever<Exclude<keyof Ctor, 'prototype'>,
        Constructor<T, ConstructorParameters<Ctor>> & ExtractStatic<Ctor>,
        Constructor<T, ConstructorParameters<Ctor>>>;


export type ExtractMixinName<M extends MixinFull<any, any, any>> = M extends MixinFull<infer I, any, any> ? I : any;
export type ExtractMixinConfig<M extends MixinFull<any, any, any>> = M extends MixinFull<any, infer I, any> ? I : any;
export type ExtractMixinTarget<M extends MixinFull<any, any, any>> = M extends MixinFull<infer N, infer C, infer T> ? T : AnyObject;

type EMT<M extends Mixin<any, any, any> | MixinFull<any, any, any>> = CheckNever<M, ExtractMixinTarget<M>, AnyObject>;

export type ExtractMixinsTargets<M1 extends Mixin<any, any, any>,
    M2 extends Mixin<any, any, any> = never,
    M3 extends Mixin<any, any, any> = never,
    M4 extends Mixin<any, any, any> = never,
    M5 extends Mixin<any, any, any> = never,
    M6 extends Mixin<any, any, any> = never,
    M7 extends Mixin<any, any, any> = never,
    M8 extends Mixin<any, any, any> = never,
    M9 extends Mixin<any, any, any> = never,
    M10 extends Mixin<any, any, any> = never,
    > = AnyObject &
    EMT<M1> &
    EMT<M2> &
    EMT<M3> &
    EMT<M4> &
    EMT<M5> &
    EMT<M6> &
    EMT<M7> &
    EMT<M8> &
    EMT<M9> &
    EMT<M10>;
