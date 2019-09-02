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

```typescript

// mixin with outer interface
interface IMixinA {
    propInMixin?: number;
    readonly testA: string;
    methodInMixin(): string;
    test(): void;
    sameNameMethod(): string;
}
const mixinAName = 'mixinA' as const;
const mixinA = mixin<typeof mixinAName, IMixinA>({
    mixinName: 'mixinA',
    
    // method `init` run with class constructor
    init(this: MixinFull<typeof mixinAName, IMixinA>) {
        const a = this.mixinName;
        this.propInMixin = 123;
        console.log(this.target.propInMixin); // '123'
        console.log(this.target.mixins.mixinA.propInMixin); // '123'
    },

    get testA() {
        return 'test-a';
    },
    methodInMixin() {
        return this.testA;
    },
    test() {
    },
    sameNameMethod(): string {
        return 'from mixinA';
    },
});

//simple mixin
const mixinB = mixin({
    mixinName: 'mixinB',
    get testB() {
        return 'test-b';
    },
    methodB() {
        return this.testB;
    },
    get test() {
        return 666;
    },
    sameNameMethod(): string {
        return 'from mixinB';
    },
});


@use(mixinA, mixinB) // connects mixins to the class
class ClassA {
    fieldInClassA = '111';
    test: number;

    constructor(val: number) {
        this.test = val;
        // (!) in constructor mixins is not yet initialized
    }

    methodInClassA() {
        return 'methodInClassA' + this.fieldInClassA;
    }
    
    sameNameMethod() {
        return 'from classA';
    }
}
/// for intellisense
interface ClassA extends IUseMixins<[typeof mixinA, typeof mixinB]> {}

const instance = new ClassA(123);
console.log(instance.methodInClassA()); // "methodInClassA111"
console.log(instance.methodB()); // "test-b" - method from mixinB
console.log(instance.mixins.mixinB.methodB()); // "test-b" - method from mixinB
console.log(instance.methodInMixin()); // "test-a" - method from mixinA




@useProxy(mixinB) // connects mixins to the class. (!) use ES7 Proxy
class ClassB {
    //
}

const instanceB = new ClassB();
console.log(instance.methodB()); // "test-b" - method from mixinB
console.log(instance.mixins.mixinB.methodB()); // "test-b" - method from mixinB
```



Mixins are used in the following order.
Class extended only by methods and properties of mixins it does not have.


All methods of all mixins can be found in ``this.mixins.`` by mixin name.

```typescript
console.log(instance.sameNameMethod()); // "from classA"
console.log(instance.mixins.mixinA.sameNameMethod()); // "from mixinA"
console.log(instance.mixins.mixinB.sameNameMethod()); // "from mixinB"
```


### Use without decorators:
- for Class:
```typescript
class Test {
    test = 'test';
}

const classC = applyMixinsForClass(Test, mixinA, mixinB);
const instance = new classC();
console.log(instance.test); // "test" - method class Test
console.log(instance.methodB()); // "test-b" - method from mixinB
console.log(instance.mixins.mixinB.methodB()); // "test-b" - method from mixinB
console.log(instance.methodInMixin()); // "test-a" - method from mixinA
```

- for Object:
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

### TypeGuards methods
- haveMixin(obj, mixin) - check is object used some mixin
- haveMixins(obj, mixinA, mixinB,...) - check is object used all mixins
- isMixin<Mixin>(value) - check is value is any Mixin or concrete Mixin from generic

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
console.log(haveMixin(temp, mixinA)); // true
console.log(haveMixin(temp, mixinB)); // true
console.log(haveMixin(temp, mixinC)); // false

console.log(haveMixins(temp, mixinA, mixinB)); // true
console.log(haveMixins(temp, mixinA, mixinB, mixinC)); // false
```

## Limitations
- Due to problems with recursive types, there are limits on the number of mixins passed to @IUseMixins - a maximum of 6 mixins. For all that more than 6 it will not work intellisense IDE
- When inheriting, if using new mixins, you cannot be applied to child class syntax ```interface ClassB extends IUseMixins<[typeof mixinC]>{}```. You can use the type guard method ```haveMixin(this, mixinC)```

## NPM Scripts

- ``npm run build`` - build development version
- ``npm run build-prod`` - build production version
- ``npm run test`` - start unit testing

## Contributing

All contributions are welcome!
To get started, simply fork and clone the repo, run ``npm install``, and get to work.
Once you have something you'd like to contribute, be sure to run ``npm test`` locally, then submit a PR.

## Author

Viktor (VitProg) - vitprog@gmail.com

My github - https://github.com/VitProg
