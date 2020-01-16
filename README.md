Yet another library for implementing mixins in TypeScript.

## Dependencies

* Typescript
* ES7 Decorator
* ```"experimentalDecorators": true,``` in tsconfig.json


## Installation

```
npm i --save ts-mix
```

## Features

ts-mix is a simple, lightweight library for implementing a mixins pattern in a TypeScript

### Usage example

##### Create mixin with interface
```typescript

interface IMixinA {
    propInMixin: number;
    readonly testA: string;
    readonly initInSetup: Date;
    methodInMixin(): string;
    test(): void;
    sameNameMethod(): string;
}

const mixinAName = 'mixinA' as const;
//                                              \  props init in method setup  /
const mixinA = mixin<typeof mixinAName, IMixinA, ['initInSetup', 'propInMixin']>({
    mixinName: mixinAName,

    setup() {
        return {
            propInMixin: 123111,
            initInSetup: new Date(),
        };
    },

    init() {
        console.log(this.target.propInMixin); // 123111
        console.log(this.target.mixins.mixinA.propInMixin); // 123111
        this.propInMixin = 123;
        console.log(this.target.propInMixin); // 123
        console.log(this.target.mixins.mixinA.propInMixin); // 123
    },

    get testA() {
        return 'test-a';
    },
    methodInMixin() {
        return this.testA;
    },
    test() {
        console.log(this.target.propInMixin); // 123
        console.log(this.target.mixins.mixinA.propInMixin); // 123
    },
    sameNameMethod(): string {
        return 'from mixinA';
    },
});
```

##### Create simple mixin
```typescript
const mixinB = mixin({
    mixinName: 'mixinB' as const,
    sameNameMethod(): string {
        return 'from mixinB';
    },
    methodB() {
        return "test-b";
    },
});

const mixinC = mixin({
    mixinName: 'mixinC',
    methodC() {
        return 'methodC';
    },
});
```
___

### Usage
##### Assigning mixins outside the class definition:
```typescript
class Test {
    test = 'test';
}

const classC = useMixins(Test, mixinA, mixinB);

const instance = new classC();

console.log(haveMixin(instance, mixinA, classC)); // true
console.log(haveMixin(instance, mixinB, classC)); // true
console.log(haveMixin(instance, mixinC, classC)); // false

console.log(instance.test); // "test" - method class Test
console.log(instance.methodB()); // "test-b" - method from mixinB
console.log(instance.mixins.mixinB.methodB()); // "test-b" - method from mixinB
console.log(instance.methodInMixin()); // "test-a" - method from mixinA
```

##### Assigning mixins during class definition
Inheritance from result of methods useMixins(Class, ...mixins)
```typescript
/* tslint:disable:max-classes-per-file variable-name */
export const TestUseMixinB = useMixins(class TestUseMixinB {
    name = 'b';
    fieldInB: string = 'test';

    constructor(readonly str: string) {
        //
    }
}, mixinA);

export const TestUseMixinBB = useMixins(class TestUseMixinBB extends TestUseMixinB {
    name = 'bb';
    fieldInBB: number = 1;

    constructor(str: string, readonly numb: number) {
        super(str);
    }
}, mixinB);

export const TestUseMixinBBB = useMixins(class TestUseMixinBBB extends TestUseMixinBB {
    name = 'bbb';
    asdasd = 1;
    fieldInBBB: boolean = true;

    constructor(readonly bool: boolean) {
        super('1', 1);
    }

    asdas(asdasd: boolean) {
        return 1;
    }
}, mixinC);
////// usage:

const testB = new TestUseMixinB('abc');
const testBB = new TestUseMixinBB('qwe', 987);
const testBBB = new TestUseMixinBBB(true);

console.log(testB.str); // 'abc'
console.log(haveMixin(testB, mixinA, TestUseMixinB)); // true

console.log(testBB.str); // 'qwe'
console.log(testBB.numb); // 987
console.log(haveMixin(testBB, mixinA, TestUseMixinB)); // true
console.log(haveMixin(testBB, mixinB, TestUseMixinBB)); // true

console.log(testBBB.str); // '1'
console.log(testBBB.numb); // 1
console.log(testBBB.bool); // true
console.log(haveMixin(testBBB, mixinA, TestUseMixinB)); // true
console.log(haveMixin(testBBB, mixinB, TestUseMixinBB)); // true
console.log(haveMixin(testBBB, mixinC, TestUseMixinBB)); // true
```
This method is the most convenient, so how:
- works well with class inheritance.
- no need for decorators or hacks with an additional interface
- clear syntax


___

##### Assigning mixins during property decorator
Decorator @mixinsProp usage:
```typescript
class TestDecorator {
    @mixinsProp(mixinB) mixins!: MixinsProp<[typeof mixinB]>;

    constructor() {
        console.log(Object.keys(this.mixins)); // 'mixinB'
    }
}
const test = new TestDecorator();

console.log(test.mixins.mixinB.methodB()); // 'test-b'
console.log(test.mixins.mixinB.sameNameMethod()); // 'from mixinB'
```
___

### Use for Object:
Immutable:
```typescript
const testBase = {
    test: 'abc',
    m() {
        return 'm';
    },
};

const instance = useMixinsForObject(testBase, mixinA, mixinB);
console.log(instance.test); // "abc" - method object testBase
console.log(instance.m()); // "m" - method object testBase
console.log(instance.methodB()); // "test-b" - method from mixinB
console.log(instance.mixins.mixinB.methodB()); // "test-b" - method from mixinB
console.log(instance.methodInMixin()); // "test-a" - method from mixinA
```

Mutable
```typescript
const test = {
    test: 'abc',
    m() {
        return 'm';
    },
};

applyMixins(test, mixinA, mixinB);
console.log(test.test); // "abc" - method object testBase
console.log(test.m()); // "m" - method object testBase
if (haveMixins(test, [mixinA, mixinB])) {
    console.log(test.mixins.mixinB.methodB()); // "test-b" - method from mixinB
    console.log(test.mixins.mixinB.methodB()); // "test-b" - method from mixinB
    console.log(test.mixins.mixinA.methodInMixin()); // "test-a" - method from mixinA
}
```


___


Mixins are used in the following order.
Class extended only by methods and properties of mixins it does not have.

All methods of all mixins can be found in ``this.mixins.`` by mixin name.

```typescript
console.log(instance.sameNameMethod()); // "from classA"
console.log(instance.mixins.mixinA.sameNameMethod()); // "from mixinA"
console.log(instance.mixins.mixinB.sameNameMethod()); // "from mixinB"
```


___


### Rewrite some methods or fields in target
With property `rewrite` in mixin config, you can rewrite some fields in target object

When creating a mixin, you can specify to it specify target interface.

_If the target does not satisfy the target interfaces of all the mixins, TypeScript will warn about it_

```typescript
const mixinD = mixin<
    'mixinD',
    { methodInD: () => string },
    [],
    { readonly fall: string, asd: () => string } // specify target interface
>(
    {
        mixinName: 'mixinD' as const,
        rewrite(th) {
            let fall = 'a';
            return {
                get fall() {
                    return 'fall in mixinD - ' + fall + ' - ' + th.origin.fall;
                },
                set fall(v: string) {
                    fall = v;
                },
                asd() {
                    return 'WWW';
                },
            };
        },
        methodInD() {
            return this.target.fall;
        },
    }
);

class Test {
    fall = 'test';
    asd() {
        return 'Hello my name ' + this.fall;
    }
    test() {
        return this.fall;
    }
}
const test = new Test();

console.log(test.fall); // 'test');
console.log(test.asd()); // 'Hello my name test');
console.log(test.test()); // 'test');

useMixinsForObject(test, mixinD); // if the target does not satisfy the target interfaces of all the mixins, TypeScript will warn about it

console.log(() => assertHaveMixin(test, mixinD, Test)).to.not.throw();
assertHaveMixin(test, mixinD, Test);

console.log('mixins' in test).true;
console.log(typeof test.mixins); // 'object');
console.log(test.fall); // 'fall in mixinD - a - test');
console.log(test.mixins.mixinD.methodInD()); // 'fall in mixinD - a - test');
console.log(test.mixins.mixinD.target.fall); // 'fall in mixinD - a - test');

test.fall = 'b';

console.log(test.fall); // 'fall in mixinD - b - test');
console.log(test.mixins.mixinD.methodInD()); // 'fall in mixinD - b - test');
console.log(test.mixins.mixinD.target.fall); // 'fall in mixinD - b - test');

console.log(test.test()); // 'fall in mixinD - b - test');

console.log(test.asd()); // 'WWW');
```

___

### TypeGuards and Asserts methods
##### TypeGuards
- `haveMixin(obj, mixin, baseObject?)` - check is object used some mixin
- `haveMixins(obj, [...mixins], baseObject?)` - check is object used all mixins
- `isMixin<Mixin>(value)` - check is value is any Mixin or concrete Mixin from generic (_maybe is not correct_)

##### Asserts
- `assertHaveMixin(obj, mixin, baseObject?)` - checks if the object uses a mixin and if not, throws error 
- `assertHaveMixins(obj, [...mixins], baseObject?)` - checks if the object uses all mixins and if not, throws error

Example:
```typescript
// connects mixins to the class
const ClassA = useMixins(class ClassA {
    // some methods and properties
}, mixinA, mixinB);


const instance = new ClassA();
console.log(haveMixin(instance, mixinA, ClassA)); // true
console.log(haveMixin(instance, mixinB, ClassA)); // true
console.log(haveMixin(instance, mixinC, ClassA)); // false

console.log(haveMixins(instance, [mixinA, mixinB], ClassA)); // true
console.log(haveMixins(instance, [mixinA, mixinB, mixinC], ClassA)); // false

assertHaveMixin(instance, mixinA, ClassA); // to errors
assertHaveMixin(instance, mixinB, ClassA); // to errors
assertHaveMixin(instance, mixinB, ClassA); // throw error MixinAssertError

assertHaveMixins(instance, [mixinA, mixinB], ClassA); // to errors
assertHaveMixins(instance, [mixinA, mixinB, mixinC], ClassA); // throw error MixinAssertError
```

## Limitations
- methods useMixins and other have limit 5 mixins

## NPM Scripts

- ``npm run build-dev`` - build development version
- ``npm run build-prod`` - build production version
- ``npm run pretest`` - compile sources before run unit tests
- ``npm run test`` - start unit tests
- ``npm run test-typing`` - start typings tests
- ``npm run clean`` - build production version
- ``npm run clean`` - build production version

## Contributing

All contributions are welcome!
To get started, simply fork and clone the repo, run ``npm install``, and get to work.
Once you have something you'd like to contribute, be sure to run ``npm test`` locally, then submit a PR.

## Author

Viktor (VitProg) - vitprog@gmail.com

My github - https://github.com/VitProg
