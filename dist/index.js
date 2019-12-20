"use strict";Object.defineProperty(exports,"__esModule",{value:!0});const mixinsAfterInit="__afterMixins";class MixinAssertError extends Error{}function mixin(i){const e=i;return Object.assign({target:void 0},e)}function applyMixinsForClass(i,...e){return class extends i{constructor(...i){super(...i),applyMixins(this,e)}}}function applyMixinsForObject(i,...e){const n=Object.assign({},i);return applyMixins(n,e),n}function applyMixins(i,e){"object"!=typeof i.mixins&&(i.mixins={});for(const n of e){if(!n)continue;const e=n.mixinName;if(i.mixins[e]=n,n.target=i,"setup"in n&&"function"==typeof n.setup){const i=n.setup();if(void 0!==i)for(const[e,t]of Object.entries(i))n[e]=t}const t=getMixables(n);for(const e of Object.keys(t)){const s=t[e];if(!(e in i))if("function"==typeof s.value)Reflect.defineProperty(i,e,{enumerable:!1,configurable:!0,writable:!1,value:(...i)=>n[e](...i)});else if(s.get||s.set){const t={enumerable:!1,configurable:!0};s.get&&(t.get=function(){return n[e]}),s.set&&(t.set=function(i){n[e]=i}),Reflect.defineProperty(i,e,t)}else Reflect.defineProperty(i,e,{enumerable:!1,configurable:!0,get:()=>n[e],set(i){n[e]=i}})}}for(const i of e)i.init&&i.init();mixinsAfterInit in i&&"function"==typeof i[mixinsAfterInit]&&i[mixinsAfterInit]()}const noPermitenMixableProperties=["__proto__","init","setup","target","mixinName"];function getMixables(i){const e={},n=Object.getOwnPropertyNames(i).filter(i=>!1===noPermitenMixableProperties.includes(i));for(const t of n){const n=Object.getOwnPropertyDescriptor(i,t);void 0!==n&&(e[t]=n)}return e}function use(...i){return function(e){return applyMixinsForClass(e,...i)}}function mixinsProp(...i){return(e,n)=>{applyMixins(e,i)}}function UseMixins(...i){let e;return e=class{constructor(){applyMixins(this,i)}}}function UseMixinsExtends(i,...e){let n;return n=applyMixinsForClass(i,...e)}function haveMixin(i,e,n){return"object"==typeof i&&"mixins"in i&&"object"==typeof i.mixins&&e.mixinName in i.mixins&&"object"==typeof i.mixins[e.mixinName]}function haveMixins(i,e,n){if(!("object"==typeof i&&"mixins"in i&&"object"==typeof i.mixins))return!1;for(const n of e)if(!1===haveMixin(i,n))return!1;return!0}function isMixin(i){var e,n,t,s,o,r,x;return"object"==typeof i&&"string"==typeof(null===(e=i)||void 0===e?void 0:e.mixinName)&&"object"==typeof(null===(n=i)||void 0===n?void 0:n.target)&&"object"==typeof(null===(s=null===(t=i)||void 0===t?void 0:t.target)||void 0===s?void 0:s.mixins)&&(null===(o=i)||void 0===o?void 0:o.mixinName)in(null===(x=null===(r=i)||void 0===r?void 0:r.target)||void 0===x?void 0:x.mixins)}function assertHaveMixin(i,e,n,t){if(!1===haveMixin(i,e))throw t instanceof Error?t:new MixinAssertError(null!=t?t:`The object does not have mixin '${e.mixinName}'`)}function assertHaveMixins(i,e,n,t){if(!1===haveMixins(i,e))throw t instanceof Error?t:new MixinAssertError(null!=t?t:`The object does not have one or more of mixins ${e.map(i=>`'${i.mixinName}'`).join(", ")}`)}exports.MixinAssertError=MixinAssertError,exports.UseMixins=UseMixins,exports.UseMixinsExtends=UseMixinsExtends,exports.applyMixinsForClass=applyMixinsForClass,exports.applyMixinsForObject=applyMixinsForObject,exports.assertHaveMixin=assertHaveMixin,exports.assertHaveMixins=assertHaveMixins,exports.haveMixin=haveMixin,exports.haveMixins=haveMixins,exports.isMixin=isMixin,exports.mixin=mixin,exports.mixinsProp=mixinsProp,exports.use=use;
