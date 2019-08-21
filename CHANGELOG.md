#### v0.2.0
- @use - now uses class inheritance
- @useProxy - using (Proxy) (previously @use also worked).
- applyMixinsForObject - method for apply mixins for object without decorators
- applyMixinsForClass - method for apply mixins for Class without decorators

##### Attentions:
- Type inferring works correctly only with a maximum of 6 mixins passed to the decorator
- @useProxy doesn't work correctly if the class with @useProxy is inherited from

#### v0.1.1
new syntax

---
#### v0.1.0
First release
