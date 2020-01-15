#### v0.6.2
- bugfix - copy mixin config object when applying mixin

#### v0.6.1
- add `applyMixins` method for patch existing object (mutable)

#### v0.6.0
- remove deprecated methods and decorators
- new methods `useMixins` and `useMixinsForObject` for all cases

#### v0.5.0
- new methods for use mixins without decorators and with support class inheritances (UseMixins, UseMixinsExtends)
- remove @useProxy decorator

#### v0.4.2
- migrate to rollup

#### v0.2.3
- fix - main exports (MixinFull, MixinThis and IMixinBase types)

#### v0.2.2
- fix - incorrect types inferred if mixin config contain init method
- fix - use some mixins for child class, if parent class already using other mixins
- isMixin - new type guard

#### v0.2.1
- fix - typing

#### v0.2.0
- @use - now uses class inheritance
- useMixinsForObject - method for apply mixins for object without decorators
- applyMixinsForClass - method for apply mixins for Class without decorators

##### Attentions:
- Type inferring works correctly only with a maximum of 6 mixins passed to the decorator

#### v0.1.1
new syntax

---
#### v0.1.0
First release
