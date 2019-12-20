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
const mixinA = mixin<typeof mixinAName, IMixinA, ['initInSetup', 'propInMixin']>({
    mixinName: mixinAName,

    setup() {
        return {
            propInMixin: 123111,
            initInSetup: new Date(),
        };
    },

    init(this: MixinFull<typeof mixinAName, IMixinA>) {
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
```
___

### Use without decorators for Class:
##### Assigning mixins outside the class definition:
```typescript
class Test {
    test = 'test';
}

const classC = applyMixinsForClass(Test, mixinA, mixinB);

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
Inheritance from result of methods UseMixins(...mixins) and UseMixinsExtends(baseClass, ...mixins)
```typescript
class TestUseMixinB extends UseMixins(mixinA) {
    name = 'b';
    constructor(readonly str: string) {
        super();
    }
}

class TestUseMixinBB extends UseMixinsExtends(TestUseMixinB, mixinB) {
    name = 'bb';
    constructor(str: string, readonly numb: number) {
        super(str);
    }
}

class TestUseMixinBBB extends UseMixinsExtends(TestUseMixinBB, mixinC) {
    name = 'bbb';
    asdasd = 1;
    constructor(readonly bool: boolean) {
        super('1', 1);
    }
    asdas(asdasd: boolean) {
        return 1;
    }
}

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

`UseMixinsExtends` - used when you to create a class that extends from another class.
___

### Use without decorators for Object:
```typescript
const testBase = {
    test: 'abc',
    m() {
        return 'm';
    },
};

const instance = applyMixinsForObject(testBase, mixinA, mixinB);
console.log(instance.test); // "abc" - method object testBase
console.log(instance.m()); // "m" - method object testBase
console.log(instance.methodB()); // "test-b" - method from mixinB
console.log(instance.mixins.mixinB.methodB()); // "test-b" - method from mixinB
console.log(instance.methodInMixin()); // "test-a" - method from mixinA
```

___

### Use with decorators:
##### Add to class mixins using the @use class decorator:
```typescript
@use(mixinA, mixinB)
class ClassA {
    methodInClassA() {
        return "methodInClassA111";
    }
    methodB() {
        return "test-b";
    }
    sameNameMethod(): string {
        return 'from classA';
    }
}
// (!) this hack is necessary for correct typing and operation of intellisense
interface ClassA extends IUseMixins<[typeof mixinA, typeof mixinB], ClassA> {}

const instance = new ClassA(123);
console.log(instance.methodInClassA()); // "methodInClassA111"
console.log(instance.methodB()); // "test-b" - method from mixinB
console.log(instance.mixins.mixinB.methodB()); // "test-b" - method from mixinB
console.log(instance.methodInMixin()); // "test-a" - method from mixinA
console.log(instance.propInMixin); // 123
console.log(instance.initInSetup); // ~ Fri Dec 20 2019 13:59:28 GMT+0300 (GMT+03:00)
```

##### Add mixins to the class using the decorator @mixinsProp on property `mixin` in the class:
```typescript
export class ClassWithMixinsProp {
    @mixinsProp(mixinA, mixinB) mixins!: MixinsProp<[typeof mixinA, typeof mixinB]>;
}
```
This way is useful when it is necessary to call the mixins through `instance.mixins.*`, or using typeGuard functions

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
const mixinC = mixin({
    mixinName: 'mixinC',
});

@use(mixinA, mixinB) // connects mixins to the class
class ClassA {
    // some methods and properties
}


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
- Due to problems with recursive types, there are limits on the number of mixins passed to @IUseMixins and other decorators and methods - a maximum of 6 mixins. For all that more than 6 it will not work intellisense IDE
- **For @use decorator only** - When inheriting, if using new mixins, you cannot be applied to child class syntax ```interface ClassB extends IUseMixins<[typeof mixinC]>{}```. You can use the type guard method ```haveMixin(this, mixinC)```

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
