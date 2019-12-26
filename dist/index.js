"use strict";Object.defineProperty(exports,"__esModule",{value:!0});const mixinsAfterInit="__afterMixins";class MixinAssertError extends Error{}function haveMixin(i,e,n){return"object"==typeof i&&"mixins"in i&&"object"==typeof i.mixins&&e.mixinName in i.mixins&&"object"==typeof i.mixins[e.mixinName]}function haveMixins(i,e,n){if(!("object"==typeof i&&"mixins"in i&&"object"==typeof i.mixins))return!1;for(const n of e)if(!1===haveMixin(i,n))return!1;return!0}function isMixin(i){var e,n,t,o,r,s,x;return"object"==typeof i&&"string"==typeof(null===(e=i)||void 0===e?void 0:e.mixinName)&&"object"==typeof(null===(n=i)||void 0===n?void 0:n.target)&&"object"==typeof(null===(o=null===(t=i)||void 0===t?void 0:t.target)||void 0===o?void 0:o.mixins)&&(null===(r=i)||void 0===r?void 0:r.mixinName)in(null===(x=null===(s=i)||void 0===s?void 0:s.target)||void 0===x?void 0:x.mixins)}function assertHaveMixin(i,e,n,t){if(!1===haveMixin(i,e))throw t instanceof Error?t:new MixinAssertError(null!=t?t:`The object does not have mixin '${e.mixinName}'`)}function assertHaveMixins(i,e,n,t){if(!1===haveMixins(i,e))throw t instanceof Error?t:new MixinAssertError(null!=t?t:`The object does not have one or more of mixins ${e.map(i=>`'${i.mixinName}'`).join(", ")}`)}function mixin(i){const e=i;return Object.assign({target:void 0},e)}function useMixinsForObject(i,e,n,t,o,r,s,x,a,f,c){return applyMixinsInternal(i,!0,e,n,t,o,r,s,x,a,f,c),i}function useMixins(i,e,n,t,o,r,s,x,a,f,c){var u;return(u=class extends i{constructor(...i){super(...i),applyMixinsInternal(this,!0,e,n,t,o,r,s,x,a,f,c)}}).__m_b_type=i,u}function applyMixins(i,...e){return applyMixinsInternal(i,!1,...e)}function applyMixinsInternal(i,e,...n){"object"!=typeof i.mixins&&(i.mixins={}),n=n.filter(i=>!!i);for(const t of n){if(!t)continue;const n=t.mixinName;if(i.mixins[n]=t,t.target=i,"setup"in t&&"function"==typeof t.setup){const i=t.setup();if(void 0!==i)for(const[e,n]of Object.entries(i))t[e]=n}if(e){const e=getMixables(t);for(const n of Object.keys(e)){const o=e[n];if(!(n in i))if("function"==typeof o.value)Reflect.defineProperty(i,n,{enumerable:!1,configurable:!0,writable:!1,value:(...i)=>t[n](...i)});else if(o.get||o.set){const e={enumerable:!1,configurable:!0};o.get&&(e.get=function(){return t[n]}),o.set&&(e.set=function(i){t[n]=i}),Reflect.defineProperty(i,n,e)}else Reflect.defineProperty(i,n,{enumerable:!1,configurable:!0,get:()=>t[n],set(i){t[n]=i}})}}}for(const i of n)i.init&&i.init();mixinsAfterInit in i&&"function"==typeof i[mixinsAfterInit]&&i[mixinsAfterInit]()}const noPermitenMixableProperties=["__proto__","init","setup","target","mixinName"];function getMixables(i){const e={},n=Object.getOwnPropertyNames(i).filter(i=>!1===noPermitenMixableProperties.includes(i));for(const t of n){const n=Object.getOwnPropertyDescriptor(i,t);void 0!==n&&(e[t]=n)}return e}exports.MixinAssertError=MixinAssertError,exports.applyMixins=applyMixins,exports.assertHaveMixin=assertHaveMixin,exports.assertHaveMixins=assertHaveMixins,exports.haveMixin=haveMixin,exports.haveMixins=haveMixins,exports.isMixin=isMixin,exports.mixin=mixin,exports.useMixins=useMixins,exports.useMixinsForObject=useMixinsForObject;
