!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports):"function"==typeof define&&define.amd?define(["exports"],t):t((e=e||self)["ts-mix"]={})}(this,function(e){"use strict";const t="__afterMixins";function n(e,...t){return class extends e{constructor(...e){super(...e),i(this,t)}}}function i(e,n){"object"!=typeof e.mixins&&(e.mixins={});for(const t of n){const n=t.mixinName;if(e.mixins[n]=t,t.target=e,"setup"in t&&"function"==typeof t.setup){const e=t.setup();if(void 0!==e)for(const[n,i]of Object.entries(e))t[n]=i}const i=o(t);for(const n of Object.keys(i)){const o=i[n];if(!(n in e))if("function"==typeof o.value)Reflect.defineProperty(e,n,{enumerable:!1,configurable:!0,writable:!1,value:(...e)=>t[n](...e)});else if(o.get||o.set){const i={enumerable:!1,configurable:!0};o.get&&(i.get=function(){return t[n]}),o.set&&(i.set=function(e){t[n]=e}),Reflect.defineProperty(e,n,i)}else Reflect.defineProperty(e,n,{enumerable:!1,configurable:!0,get:()=>t[n],set(e){t[n]=e}})}}for(const e of n)e.init&&e.init();t in e&&"function"==typeof e[t]&&e[t]()}function o(e){const t={},n=Object.getOwnPropertyNames(e).filter(e=>"init"!==e&&"target"!==e&&"mixinName"!==e);for(const i of n){const n=Object.getOwnPropertyDescriptor(e,i);void 0!==n&&(t[i]=n)}return t}function r(e,t){return"object"==typeof e&&"mixins"in e&&"object"==typeof e.mixins&&t.mixinName in e.mixins&&"object"==typeof e.mixins[t.mixinName]}e.applyMixinsForClass=n,e.applyMixinsForObject=function(e,...t){const n=Object.assign({},e);return i(n,t),n},e.haveMixin=r,e.haveMixins=function(e,...t){if(!("object"==typeof e&&"mixins"in e&&"object"==typeof e.mixins))return!1;for(const n of t)if(!1===r(e,n))return!1;return!0},e.mixin=function(e){const t=e;return Object.assign({target:void 0},t)},e.use=function(...e){return function(t){return n(t,...e)}},e.useProxy=function(...e){return function(t){return new Proxy(t,{construct(t,n){const o=Reflect.construct(t,n);return i(o,e),o}})}},Object.defineProperty(e,"__esModule",{value:!0})});
