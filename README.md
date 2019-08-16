Yet another library for implementing mixins in TypeScript.

## Dependencies

* Typescript
* ES7 Decorator
* ES7 Proxy
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
const mixinA = mixin<'mixinA', IMixinA>({
    mixinName: 'mixinA',
    
    // method `init` with class constructor
    init(this: Mixin<'mixinA', IMixinA>) {
        const a = this.mixinName;
        this.propInMixin = Math.random();
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
    }

    methodInClassA() {
        return 'methodInClassA' + this.fieldInClassA;
    }
    
    sameNameMethod() {
        return 'from classA';
    }
}
interface ClassA extends IUseMixins<[typeof mixinA, typeof mixinB]> {}


const instance = new ClassA(123);
console.log(instance.methodInClassA()); // "methodInClassA111"
console.log(instance.methodB()); // "test-b" - method from mixinB
console.log(instance.mixins.mixinB.methodB()); // "test-b" - method from mixinB
console.log(instance.methodInMixin()); // "test-a" - method from mixinA
```



Class extended only by methods and properties of mixins it does not have.

All methods of all mixins can be found in ``this.mixins.`` by mixin name.

```typescript
console.log(instance.sameNameMethod()); // "from classA"
console.log(instance.mixins.mixinA.sameNameMethod()); // "from mixinA"
console.log(instance.mixins.mixinB.sameNameMethod()); // "from mixinB"
```


## NPM Scripts

- ``npm run build`` - build development version
- ``npm run build-prod`` - build production version
- ``npm run test`` - start unit testing

## Contributing

All contributions are welcome!
To get started, simply fork and clone the repo, run ``npm install``, and get to work.
Once you have something you'd like to contribute, be sure to run ``npm test`` locally, then submit a PR.

## Author

Viktor (aka VitProg) - vitprog@gmail.com

My github - https://github.com/VitProg
