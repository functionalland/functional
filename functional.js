Either.prototype.alt = Either.prototype["fantasy-land/alt"] = function(container) {
    return this.fold({
        Left: (_)=>container
        ,
        Right: (_)=>this
    });
};
Either.prototype.chain = Either.prototype["fantasy-land/chain"] = function(unaryFunction) {
    return this.fold({
        Left: (_)=>this
        ,
        Right: (value)=>unaryFunction(value)
    });
};
Either.prototype.extract = Either.prototype["fantasy-land/extract"] = function() {
    return this.fold({
        Left: (_)=>this
        ,
        Right: (value)=>value
    });
};
Either.prototype.reduce = Either.prototype["fantasy-land/reduce"] = function(binaryFunction, accumulator) {
    return this.fold({
        Left: (_)=>accumulator
        ,
        Right: (value)=>binaryFunction(accumulator, value)
    });
};
Either.prototype.sequence = function(TypeRepresentation) {
    return this.traverse(TypeRepresentation, (x)=>x
    );
};
IO.prototype.ap = IO.prototype["fantasy-land/ap"] = function(container) {
    return container.map((unaryFunction)=>unaryFunction(this.asyncFunction())
    );
};
IO.prototype.run = function() {
    return this.asyncFunction();
};
Maybe.prototype.alt = Maybe.prototype["fantasy-land/alt"] = function(container) {
    return this.fold({
        Nothing: (_)=>container
        ,
        Just: (_)=>this
    });
};
Maybe.prototype.reduce = Maybe.prototype["fantasy-land/reduce"] = function(binaryFunction, accumulator) {
    return this.fold({
        Nothing: (_)=>accumulator
        ,
        Just: (value)=>binaryFunction(accumulator, value)
    });
};
Maybe.prototype.sequence = function(TypeRepresentation) {
    return this.traverse(TypeRepresentation, (x)=>x
    );
};
function _pipe(f, g) {
    return function() {
        return g.call(this, f.apply(this, arguments));
    };
}
function _identity(x) {
    return x;
}
function _isFunction(x) {
    var type = Object.prototype.toString.call(x);
    return type === '[object Function]' || type === '[object AsyncFunction]' || type === '[object GeneratorFunction]' || type === '[object AsyncGeneratorFunction]';
}
const serializeTypeRepresentation = (typeName)=>typeName
;
export const $$debug = Symbol.for("TaskDebug");
export const $$inspect = typeof Deno !== "undefined" ? Deno.customInspect : "inspect";
export const $$returnType = Symbol.for("ReturnType");
export const $$tag = Symbol.for("Tag");
export const $$tagList = Symbol.for("TagList");
export const $$type = Symbol.for("Type");
export const $$value = Symbol.for("Value");
export const $$valueList = Symbol.for("ValueList");
Step.prototype.alt = Step.prototype["fantasy-land/alt"] = function(container) {
    return this.fold({
        Done: (_)=>container
        ,
        Loop: (_)=>this
    });
};
const concat = (x)=>(y)=>x.concat(y)
;
const serializeFunctionForDebug = (asyncFunction)=>asyncFunction.name && asyncFunction.name !== "" ? asyncFunction.name : asyncFunction.toString().length > 25 ? asyncFunction.toString().slice(0, 25).replace(/[\n\r]/g, "").replace(/\s\s*/g, " ") + "[...]" : asyncFunction.toString().replace(/[\n\r]/g, "").replace(/\s\s*/g, " ")
;
Task.prototype.run = async function() {
    const maybePromise = this.asyncFunction();
    return (maybePromise instanceof Promise ? maybePromise : Promise.resolve(maybePromise)).then((maybeContainer)=>__default.is(maybeContainer) ? maybeContainer : __default.Right(maybeContainer)
    , (maybeContainer)=>__default.is(maybeContainer) ? maybeContainer : __default.Left(maybeContainer)
    );
};
Task.prototype.toString = Task.prototype[$$inspect] = function() {
    return this[$$debug] || `Task("unknown")`;
};
const noColor = globalThis.Deno?.noColor ?? true;
let enabled = !noColor;
function code(open, close) {
    return {
        open: `\x1b[${open.join(";")}m`,
        close: `\x1b[${close}m`,
        regexp: new RegExp(`\\x1b\\[${close}m`, "g")
    };
}
function run(str, code1) {
    return enabled ? `${code1.open}${str.replace(code1.regexp, code1.open)}${code1.close}` : str;
}
function red(str) {
    return run(str, code([
        31
    ], 39));
}
function blue(str) {
    return run(str, code([
        34
    ], 39));
}
function brightBlack(str) {
    return run(str, code([
        90
    ], 39));
}
function clampAndTruncate(n, max = 255, min = 0) {
    return Math.trunc(Math.max(Math.min(n, max), min));
}
const ANSI_PATTERN = new RegExp([
    "[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:[a-zA-Z\\d]*(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)",
    "(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-ntqry=><~]))", 
].join("|"), "g");
const $$decoder = new TextDecoder();
const $$encoder = new TextEncoder();
export const assertIsArray = (value)=>value instanceof Array
;
export const assertIsBoolean = (value)=>value === true || value === false
;
export const assertIsFunction = (value)=>value instanceof Function
;
export const assertIsNull = (value)=>value === null
;
export const assertIsNumber = (value)=>typeof value === "number"
;
export const assertIsObject = (value)=>typeof value === "object" && !(value instanceof Array)
;
export const assertIsRegex = (value)=>value instanceof RegExp
;
export const assertIsString = (value)=>typeof value === "string"
;
export const assertIsUndefined = (value)=>value === undefined
;
export const decodeRaw = $$decoder.decode.bind($$decoder);
export const encodeText = $$encoder.encode.bind($$encoder);
export const log = (message)=>(x)=>console.debug(blue(message), x) || x
;
function XMap(f, xf) {
    this.xf = xf;
    this.f = f;
}
XMap.prototype['@@transducer/step'] = function(result, input) {
    return this.xf['@@transducer/step'](result, this.f(input));
};
const __default4 = Number.isInteger || function _isInteger(n) {
    return n << 0 === n;
};
function _arrayFromIterator(iter) {
    var list = [];
    var next;
    while(!(next = iter.next()).done){
        list.push(next.value);
    }
    return list;
}
function _includesWith(pred, x, list) {
    var idx = 0;
    var len = list.length;
    while(idx < len){
        if (pred(x, list[idx])) {
            return true;
        }
        idx += 1;
    }
    return false;
}
function _functionName(f) {
    var match = String(f).match(/^function (\w*)/);
    return match == null ? '' : match[1];
}
function _objectIs(a, b) {
    if (a === b) {
        return a !== 0 || 1 / a === 1 / b;
    } else {
        return a !== a && b !== b;
    }
}
const __default1 = typeof Object.is === 'function' ? Object.is : _objectIs;
function _quote(s) {
    var escaped = s.replace(/\\/g, '\\\\').replace(/[\b]/g, '\\b').replace(/\f/g, '\\f').replace(/\n/g, '\\n').replace(/\r/g, '\\r').replace(/\t/g, '\\t').replace(/\v/g, '\\v').replace(/\0/g, '\\0');
    return '"' + escaped.replace(/"/g, '\\"') + '"';
}
var pad = function pad(n) {
    return (n < 10 ? '0' : '') + n;
};
var _toISOString = typeof Date.prototype.toISOString === 'function' ? function _toISOString(d) {
    return d.toISOString();
} : function _toISOString(d) {
    return d.getUTCFullYear() + '-' + pad(d.getUTCMonth() + 1) + '-' + pad(d.getUTCDate()) + 'T' + pad(d.getUTCHours()) + ':' + pad(d.getUTCMinutes()) + ':' + pad(d.getUTCSeconds()) + '.' + (d.getUTCMilliseconds() / 1000).toFixed(3).slice(2, 5) + 'Z';
};
function _complement(f) {
    return function() {
        return !f.apply(this, arguments);
    };
}
function _filter(fn, list) {
    var idx = 0;
    var len = list.length;
    var result = [];
    while(idx < len){
        if (fn(list[idx])) {
            result[result.length] = list[idx];
        }
        idx += 1;
    }
    return result;
}
function _isObject(x) {
    return Object.prototype.toString.call(x) === '[object Object]';
}
function XFilter(f, xf) {
    this.xf = xf;
    this.f = f;
}
XFilter.prototype['@@transducer/step'] = function(result, input) {
    return this.f(input) ? this.xf['@@transducer/step'](result, input) : result;
};
function _map(fn, functor) {
    var idx = 0;
    var len = functor.length;
    var result = Array(len);
    while(idx < len){
        result[idx] = fn(functor[idx]);
        idx += 1;
    }
    return result;
}
function XWrap(fn) {
    this.f = fn;
}
XWrap.prototype['@@transducer/init'] = function() {
    throw new Error('init not implemented on XWrap');
};
XWrap.prototype['@@transducer/result'] = function(acc) {
    return acc;
};
XWrap.prototype['@@transducer/step'] = function(acc, x) {
    return this.f(acc, x);
};
function _xwrap(fn) {
    return new XWrap(fn);
}
function _arrayReduce(xf, acc, list) {
    var idx = 0;
    var len = list.length;
    while(idx < len){
        acc = xf['@@transducer/step'](acc, list[idx]);
        if (acc && acc['@@transducer/reduced']) {
            acc = acc['@@transducer/value'];
            break;
        }
        idx += 1;
    }
    return xf['@@transducer/result'](acc);
}
function _iterableReduce(xf, acc, iter) {
    var step = iter.next();
    while(!step.done){
        acc = xf['@@transducer/step'](acc, step.value);
        if (acc && acc['@@transducer/reduced']) {
            acc = acc['@@transducer/value'];
            break;
        }
        step = iter.next();
    }
    return xf['@@transducer/result'](acc);
}
var symIterator = typeof Symbol !== 'undefined' ? Symbol.iterator : '@@iterator';
function _isTransformer(obj) {
    return obj != null && typeof obj['@@transducer/step'] === 'function';
}
var toString1 = Object.prototype.toString;
var hasEnumBug = !({
    toString: null
}).propertyIsEnumerable('toString');
var nonEnumerableProps = [
    'constructor',
    'valueOf',
    'isPrototypeOf',
    'toString',
    'propertyIsEnumerable',
    'hasOwnProperty',
    'toLocaleString'
];
var hasArgsEnumBug = function() {
    'use strict';
    return arguments.propertyIsEnumerable('length');
}();
var contains = function contains(list, item) {
    var idx = 0;
    while(idx < list.length){
        if (list[idx] === item) {
            return true;
        }
        idx += 1;
    }
    return false;
};
function _concat(set1, set2) {
    set1 = set1 || [];
    set2 = set2 || [];
    var idx;
    var len1 = set1.length;
    var len2 = set2.length;
    var result = [];
    idx = 0;
    while(idx < len1){
        result[result.length] = set1[idx];
        idx += 1;
    }
    idx = 0;
    while(idx < len2){
        result[result.length] = set2[idx];
        idx += 1;
    }
    return result;
}
function _isPlaceholder(a) {
    return a != null && typeof a === 'object' && a['@@functional/placeholder'] === true;
}
function _arity(n, fn) {
    switch(n){
        case 0:
            return function() {
                return fn.apply(this, arguments);
            };
        case 1:
            return function(a0) {
                return fn.apply(this, arguments);
            };
        case 2:
            return function(a0, a1) {
                return fn.apply(this, arguments);
            };
        case 3:
            return function(a0, a1, a2) {
                return fn.apply(this, arguments);
            };
        case 4:
            return function(a0, a1, a2, a3) {
                return fn.apply(this, arguments);
            };
        case 5:
            return function(a0, a1, a2, a3, a4) {
                return fn.apply(this, arguments);
            };
        case 6:
            return function(a0, a1, a2, a3, a4, a5) {
                return fn.apply(this, arguments);
            };
        case 7:
            return function(a0, a1, a2, a3, a4, a5, a6) {
                return fn.apply(this, arguments);
            };
        case 8:
            return function(a0, a1, a2, a3, a4, a5, a6, a7) {
                return fn.apply(this, arguments);
            };
        case 9:
            return function(a0, a1, a2, a3, a4, a5, a6, a7, a8) {
                return fn.apply(this, arguments);
            };
        case 10:
            return function(a0, a1, a2, a3, a4, a5, a6, a7, a8, a9) {
                return fn.apply(this, arguments);
            };
        default:
            throw new Error('First argument to _arity must be a non-negative integer no greater than ten');
    }
}
function _isString(x) {
    return Object.prototype.toString.call(x) === '[object String]';
}
function _has(prop, obj) {
    return Object.prototype.hasOwnProperty.call(obj, prop);
}
const __default2 = Array.isArray || function _isArray(val) {
    return val != null && val.length >= 0 && Object.prototype.toString.call(val) === '[object Array]';
};
const __default3 = {
    init: function() {
        return this.xf['@@transducer/init']();
    },
    result: function(result) {
        return this.xf['@@transducer/result'](result);
    }
};
function _checkForMethod(methodname, fn) {
    return function() {
        var length = arguments.length;
        if (length === 0) {
            return fn();
        }
        var obj = arguments[length - 1];
        return __default2(obj) || typeof obj[methodname] !== 'function' ? fn.apply(this, arguments) : obj[methodname].apply(obj, Array.prototype.slice.call(arguments, 0, length - 1));
    };
}
const serializeTypeRepresentationBound = function() {
    return serializeTypeRepresentation(this[$$type]);
};
function gray(str) {
    return brightBlack(str);
}
XMap.prototype['@@transducer/init'] = __default3.init;
XMap.prototype['@@transducer/result'] = __default3.result;
XFilter.prototype['@@transducer/init'] = __default3.init;
XFilter.prototype['@@transducer/result'] = __default3.result;
function _curryN(length, received, fn) {
    return function() {
        var combined = [];
        var argsIdx = 0;
        var left = length;
        var combinedIdx = 0;
        while(combinedIdx < received.length || argsIdx < arguments.length){
            var result;
            if (combinedIdx < received.length && (!_isPlaceholder(received[combinedIdx]) || argsIdx >= arguments.length)) {
                result = received[combinedIdx];
            } else {
                result = arguments[argsIdx];
                argsIdx += 1;
            }
            combined[combinedIdx] = result;
            if (!_isPlaceholder(result)) {
                left -= 1;
            }
            combinedIdx += 1;
        }
        return left <= 0 ? fn.apply(this, combined) : _arity(left, _curryN(length, combined, fn));
    };
}
function _curry1(fn) {
    return function f1(a) {
        if (arguments.length === 0 || _isPlaceholder(a)) {
            return f1;
        } else {
            return fn.apply(this, arguments);
        }
    };
}
var _isArrayLike = _curry1(function isArrayLike(x) {
    if (__default2(x)) {
        return true;
    }
    if (!x) {
        return false;
    }
    if (typeof x !== 'object') {
        return false;
    }
    if (_isString(x)) {
        return false;
    }
    if (x.length === 0) {
        return true;
    }
    if (x.length > 0) {
        return x.hasOwnProperty(0) && x.hasOwnProperty(x.length - 1);
    }
    return false;
});
function _dispatchable(methodNames, transducerCreator, fn) {
    return function() {
        if (arguments.length === 0) {
            return fn();
        }
        var obj = arguments[arguments.length - 1];
        if (!__default2(obj)) {
            var idx = 0;
            while(idx < methodNames.length){
                if (typeof obj[methodNames[idx]] === 'function') {
                    return obj[methodNames[idx]].apply(obj, Array.prototype.slice.call(arguments, 0, -1));
                }
                idx += 1;
            }
            if (_isTransformer(obj)) {
                var transducer = transducerCreator.apply(null, Array.prototype.slice.call(arguments, 0, -1));
                return transducer(obj);
            }
        }
        return fn.apply(this, arguments);
    };
}
var _isArguments = function() {
    return toString1.call(arguments) === '[object Arguments]' ? function _isArguments(x) {
        return toString1.call(x) === '[object Arguments]';
    } : function _isArguments(x) {
        return _has('callee', x);
    };
}();
var keys = typeof Object.keys === 'function' && !hasArgsEnumBug ? _curry1(function keys(obj) {
    return Object(obj) !== obj ? [] : Object.keys(obj);
}) : _curry1(function keys(obj) {
    if (Object(obj) !== obj) {
        return [];
    }
    var prop, nIdx;
    var ks = [];
    var checkArgsLength = hasArgsEnumBug && _isArguments(obj);
    for(prop in obj){
        if (_has(prop, obj) && (!checkArgsLength || prop !== 'length')) {
            ks[ks.length] = prop;
        }
    }
    if (hasEnumBug) {
        nIdx = nonEnumerableProps.length - 1;
        while(nIdx >= 0){
            prop = nonEnumerableProps[nIdx];
            if (_has(prop, obj) && !contains(ks, prop)) {
                ks[ks.length] = prop;
            }
            nIdx -= 1;
        }
    }
    return ks;
});
var not = _curry1(function not(a) {
    return !a;
});
var reverse = _curry1(function reverse(list) {
    return _isString(list) ? list.split('').reverse().join('') : Array.prototype.slice.call(list, 0).reverse();
});
var isNil = _curry1(function isNil(x) {
    return x == null;
});
var identity = _curry1(_identity);
var type = _curry1(function type(val) {
    return val === null ? 'Null' : val === undefined ? 'Undefined' : Object.prototype.toString.call(val).slice(8, -1);
});
function _curry2(fn) {
    return function f2(a, b) {
        switch(arguments.length){
            case 0:
                return f2;
            case 1:
                return _isPlaceholder(a) ? f2 : _curry1(function(_b) {
                    return fn(a, _b);
                });
            default:
                return _isPlaceholder(a) && _isPlaceholder(b) ? f2 : _isPlaceholder(a) ? _curry1(function(_a) {
                    return fn(_a, b);
                }) : _isPlaceholder(b) ? _curry1(function(_b) {
                    return fn(a, _b);
                }) : fn(a, b);
        }
    };
}
var curryN = _curry2(function curryN(length, fn) {
    if (length === 1) {
        return _curry1(fn);
    }
    return _arity(length, _curryN(length, [], fn));
});
var bind = _curry2(function bind(fn, thisObj) {
    return _arity(fn.length, function() {
        return fn.apply(thisObj, arguments);
    });
});
function _methodReduce(xf, acc, obj, methodName) {
    return xf['@@transducer/result'](obj[methodName](bind(xf['@@transducer/step'], xf), acc));
}
function _reduce(fn, acc, list) {
    if (typeof fn === 'function') {
        fn = _xwrap(fn);
    }
    if (_isArrayLike(list)) {
        return _arrayReduce(fn, acc, list);
    }
    if (typeof list['fantasy-land/reduce'] === 'function') {
        return _methodReduce(fn, acc, list, 'fantasy-land/reduce');
    }
    if (list[symIterator] != null) {
        return _iterableReduce(fn, acc, list[symIterator]());
    }
    if (typeof list.next === 'function') {
        return _iterableReduce(fn, acc, list);
    }
    if (typeof list.reduce === 'function') {
        return _methodReduce(fn, acc, list, 'reduce');
    }
    throw new TypeError('reduce: list must be array or iterable');
}
function _curry3(fn) {
    return function f3(a, b, c) {
        switch(arguments.length){
            case 0:
                return f3;
            case 1:
                return _isPlaceholder(a) ? f3 : _curry2(function(_b, _c) {
                    return fn(a, _b, _c);
                });
            case 2:
                return _isPlaceholder(a) && _isPlaceholder(b) ? f3 : _isPlaceholder(a) ? _curry2(function(_a, _c) {
                    return fn(_a, b, _c);
                }) : _isPlaceholder(b) ? _curry2(function(_b, _c) {
                    return fn(a, _b, _c);
                }) : _curry1(function(_c) {
                    return fn(a, b, _c);
                });
            default:
                return _isPlaceholder(a) && _isPlaceholder(b) && _isPlaceholder(c) ? f3 : _isPlaceholder(a) && _isPlaceholder(b) ? _curry2(function(_a, _b) {
                    return fn(_a, _b, c);
                }) : _isPlaceholder(a) && _isPlaceholder(c) ? _curry2(function(_a, _c) {
                    return fn(_a, b, _c);
                }) : _isPlaceholder(b) && _isPlaceholder(c) ? _curry2(function(_b, _c) {
                    return fn(a, _b, _c);
                }) : _isPlaceholder(a) ? _curry1(function(_a) {
                    return fn(_a, b, c);
                }) : _isPlaceholder(b) ? _curry1(function(_b) {
                    return fn(a, _b, c);
                }) : _isPlaceholder(c) ? _curry1(function(_c) {
                    return fn(a, b, _c);
                }) : fn(a, b, c);
        }
    };
}
var apply = _curry2(function apply(fn, args) {
    return fn.apply(this, args);
});
var slice = _curry3(_checkForMethod('slice', function slice(fromIndex, toIndex, list) {
    return Array.prototype.slice.call(list, fromIndex, toIndex);
}));
var tail = _curry1(_checkForMethod('tail', slice(1, Infinity)));
var max = _curry2(function max(a, b) {
    return b > a ? b : a;
});
var hasPath = _curry2(function hasPath(_path, obj) {
    if (_path.length === 0 || isNil(obj)) {
        return false;
    }
    var val = obj;
    var idx = 0;
    while(idx < _path.length){
        if (!isNil(val) && _has(_path[idx], val)) {
            val = val[_path[idx]];
            idx += 1;
        } else {
            return false;
        }
    }
    return true;
});
var has = _curry2(function has(prop, obj) {
    return hasPath([
        prop
    ], obj);
});
var zipObj = _curry2(function zipObj(keys1, values) {
    var idx = 0;
    var len = Math.min(keys1.length, values.length);
    var out = {
    };
    while(idx < len){
        out[keys1[idx]] = values[idx];
        idx += 1;
    }
    return out;
});
const factorizeFold = (functionByTag, instanceTag, constructorTagList)=>{
    for (const tag of constructorTagList){
        if (!functionByTag[tag]) {
            throw new TypeError(`Constructors given to fold didn't include: ${tag}`);
        }
    }
    return apply(functionByTag[instanceTag]);
};
const factorizeFoldBound = function(functionByTag) {
    return factorizeFold(functionByTag, this[$$tag], this.constructor[$$tagList])(this[$$valueList]);
};
var append = _curry2(function append(el, list) {
    return _concat(list, [
        el
    ]);
});
var curry = _curry1(function curry(fn) {
    return curryN(fn.length, fn);
});
var _xmap = _curry2(function _xmap(f, xf) {
    return new XMap(f, xf);
});
var map = _curry2(_dispatchable([
    'fantasy-land/map',
    'map'
], _xmap, function map(fn, functor) {
    switch(Object.prototype.toString.call(functor)){
        case '[object Function]':
            return curryN(functor.length, function() {
                return fn.call(this, functor.apply(this, arguments));
            });
        case '[object Object]':
            return _reduce(function(acc, key) {
                acc[key] = fn(functor[key]);
                return acc;
            }, {
            }, keys(functor));
        default:
            return _map(fn, functor);
    }
}));
var nth = _curry2(function nth(offset, list) {
    var idx = offset < 0 ? list.length + offset : offset;
    return _isString(list) ? list.charAt(idx) : list[idx];
});
var prop = _curry2(function prop(p, obj) {
    if (obj == null) {
        return;
    }
    return __default4(p) ? nth(p, obj) : obj[p];
});
var reduce = _curry3(_reduce);
var _xfilter = _curry2(function _xfilter(f, xf) {
    return new XFilter(f, xf);
});
var filter = _curry2(_dispatchable([
    'fantasy-land/filter',
    'filter'
], _xfilter, function(pred, filterable) {
    return _isObject(filterable) ? _reduce(function(acc, key) {
        if (pred(filterable[key])) {
            acc[key] = filterable[key];
        }
        return acc;
    }, {
    }, keys(filterable)) : _filter(pred, filterable);
}));
var reject = _curry2(function reject(pred, filterable) {
    return filter(_complement(pred), filterable);
});
var ap = _curry2(function ap(applyF, applyX) {
    return typeof applyX['fantasy-land/ap'] === 'function' ? applyX['fantasy-land/ap'](applyF) : typeof applyF.ap === 'function' ? applyF.ap(applyX) : typeof applyF === 'function' ? function(x) {
        return applyF(x)(applyX(x));
    } : _reduce(function(acc, f) {
        return _concat(acc, map(f, applyX));
    }, [], applyF);
});
var liftN = _curry2(function liftN(arity, fn) {
    var lifted = curryN(arity, fn);
    return curryN(arity, function() {
        return _reduce(ap, map(lifted, arguments[0]), Array.prototype.slice.call(arguments, 1));
    });
});
var lift = _curry1(function lift(fn) {
    return liftN(fn.length, fn);
});
var complement = lift(not);
function pipe() {
    if (arguments.length === 0) {
        throw new Error('pipe requires at least one argument');
    }
    return _arity(arguments[0].length, reduce(_pipe, arguments[0], tail(arguments)));
}
function compose() {
    if (arguments.length === 0) {
        throw new Error('compose requires at least one argument');
    }
    return pipe.apply(this, reverse(arguments));
}
var pluck = _curry2(function pluck(p, list) {
    return map(prop(p), list);
});
var converge = _curry2(function converge(after, fns) {
    return curryN(reduce(max, 0, pluck('length', fns)), function() {
        var args = arguments;
        var context = this;
        return after.apply(context, _map(function(fn) {
            return fn.apply(context, args);
        }, fns));
    });
});
const assertIsUnit = curry((instance, value)=>instance === value || !!value && instance[$$tag] === value[$$tag] && instance.constructor[$$type] === value.constructor[$$type]
);
const assertIsTypeRepresentation = curry((typeName, value)=>value !== undefined && value !== null && typeName === value.constructor[$$type]
);
const assertIsVariant = curry((instance, value)=>!!value && instance[$$tag] === value[$$tag] && instance[$$returnType] === value.constructor[$$type]
);
const serializeConstructorType = curry((typeName, tag)=>`${typeName}.${tag}`
);
const serializeConstructorTypeBound = function() {
    return serializeConstructorType(this[$$returnType], this[$$tag]);
};
const factorizeValue = curry((propertyNameList, prototype, propertyValueList, argumentCount)=>{
    if (argumentCount !== propertyNameList.length) {
        throw new TypeError(`Expected ${propertyNameList.length} arguments, got ${argumentCount}.`);
    }
    return Object.assign(Object.create(prototype), {
        ...zipObj(propertyNameList, propertyValueList),
        [$$valueList]: propertyValueList
    });
});
const factorizeConstructor = (propertyNameList, prototype)=>{
    switch(propertyNameList.length){
        case 1:
            return function(a) {
                return factorizeValue(propertyNameList, prototype, [
                    a
                ], arguments.length);
            };
        case 2:
            return function(a, b) {
                return factorizeValue(propertyNameList, prototype, [
                    a,
                    b
                ], arguments.length);
            };
        case 3:
            return function(a, b, c) {
                return factorizeValue(propertyNameList, prototype, [
                    a,
                    b,
                    c
                ], arguments.length);
            };
        case 4:
            return function(a, b, c, d) {
                return factorizeValue(propertyNameList, prototype, [
                    a,
                    b,
                    c,
                    d
                ], arguments.length);
            };
        case 5:
            return function(a, b, c, d, e) {
                return factorizeValue(propertyNameList, prototype, [
                    a,
                    b,
                    c,
                    d,
                    e
                ], arguments.length);
            };
        case 6:
            return function(a, b, c, d, e, f) {
                return factorizeValue(propertyNameList, prototype, [
                    a,
                    b,
                    c,
                    d,
                    e,
                    f
                ], arguments.length);
            };
        case 7:
            return function(a, b, c, d, e, f, g) {
                return factorizeValue(propertyNameList, prototype, [
                    a,
                    b,
                    c,
                    d,
                    e,
                    f,
                    g
                ], arguments.length);
            };
        case 8:
            return function(a, b, c, d, e, f, g, h) {
                return factorizeValue(propertyNameList, prototype, [
                    a,
                    b,
                    c,
                    d,
                    e,
                    f,
                    g,
                    h
                ], arguments.length);
            };
        case 9:
            return function(a, b, c, d, e, f, g, h, i) {
                return factorizeValue(propertyNameList, prototype, [
                    a,
                    b,
                    c,
                    d,
                    e,
                    f,
                    g,
                    h,
                    i
                ], arguments.length);
            };
        case 10:
            return function(a, b, c, d, e, f, g, h, i, j) {
                return factorizeValue(propertyNameList, prototype, [
                    a,
                    b,
                    c,
                    d,
                    e,
                    f,
                    g,
                    h,
                    i,
                    j
                ], arguments.length);
            };
        default:
            return Object.defineProperty(function() {
                return factorizeValue(propertyNameList, prototype, arguments, arguments.length);
            }, 'length', {
                value: propertyNameList.length
            });
    }
};
const factorizeConstructorFromObject = (propertyNameList, prototype)=>compose(converge(factorizeValue(propertyNameList, prototype), [
        identity,
        prop("length")
    ]), (blueprintObject)=>reduce((accumulator, propertyName)=>{
            if (complement(has)(propertyName, blueprintObject)) {
                throw new TypeError(`Missing field: ${propertyName}`);
            }
            return [
                ...accumulator,
                blueprintObject[propertyName]
            ];
        }, [], propertyNameList)
    )
;
export const assertIsInstance = curry((T, value)=>value instanceof T
);
export const chainLift = curry((binaryFunction, chainableFunctor, functor)=>chainableFunctor.chain((x)=>functor.map(binaryFunction(x))
    )
);
export const chainRec = curry((ternaryFunction, initiator, chainableRecursiveFunctor)=>(chainableRecursiveFunctor.chainRec || chainableRecursiveFunctor["fantasy-land/chainRec"]).call(chainableRecursiveFunctor, ternaryFunction, initiator)
);
export const evert = curry((T, list)=>list.reduce((accumulator, x)=>lift(append)(x, accumulator)
    , T.of([]))
);
export const insideOut = evert;
export const runSequentially = (initialChainableFunctor, ...chainableFunctorList)=>reduce((accumulator, chainableFunctor)=>accumulator.chain((_)=>chainableFunctor
        )
    , initialChainableFunctor, chainableFunctorList)
;
export const safeExtract = curry((message, container)=>container.fold({
        Left: (error)=>{
            throw new Error(`${message} Error: ${error.hasOwnProperty('raw') ? decodeRaw(error.raw) : `${red(error.message)}\n${gray(error.stack)}`}`);
        },
        Right: (value)=>value
    })
);
export const stream = curry(async (composedFunction, accumulator, iterator)=>{
    for await (const data of iterator){
        accumulator = composedFunction(accumulator, data);
    }
    return accumulator;
});
Either.fromNullable = (value)=>!(typeof value !== "undefined") || !value && typeof value === "object" ? Either.Left(value) : Either.Right(value)
;
Either.left = (value)=>Either.Left(value)
;
Either.right = (value)=>Either.Right(value)
;
Either.of = Either.prototype.of = Either.prototype["fantasy-land/of"] = (value)=>Either.Right(value)
;
Either.prototype.ap = Either.prototype["fantasy-land/ap"] = function(container) {
    return this.fold({
        Left: (_)=>this
        ,
        Right: (value)=>Either.Right.is(container) ? Either.Right(container[$$value](value)) : container
    });
};
Either.prototype.extend = Either.prototype["fantasy-land/extend"] = function(unaryFunction) {
    return this.fold({
        Left: (_)=>this
        ,
        Right: (_)=>Either.of(unaryFunction(this))
    });
};
Either.prototype.map = Either.prototype["fantasy-land/map"] = function(unaryFunction) {
    return this.fold({
        Left: (_)=>this
        ,
        Right: (value)=>Either.of(unaryFunction(value))
    });
};
Either.prototype.traverse = Either.prototype["fantasy-land/traverse"] = function(TypeRepresentation, unaryFunction) {
    return this.fold({
        Left: (value)=>TypeRepresentation.of(Either.Left(value))
        ,
        Right: (value)=>unaryFunction(value).map((x)=>Either.Right(x)
            )
    });
};
Either.zero = Either.prototype.zero = Either.prototype["fantasy-land/zero"] = ()=>Either.Left(null)
;
IO.prototype.chain = IO.prototype["fantasy-land/chain"] = function(unaryFunction) {
    return IO((_)=>unaryFunction(this.asyncFunction())
    ).run();
};
IO.prototype.map = IO.prototype["fantasy-land/map"] = function(unaryFunction) {
    return IO((_)=>unaryFunction(this.asyncFunction())
    );
};
IO.of = IO.prototype.of = IO.prototype["fantasy-land/of"] = (value)=>IO((_)=>value
    )
;
Maybe.fromNullable = (value)=>!(typeof value !== "undefined") || !value && typeof value === "object" ? Maybe.nothing() : Maybe.just(value)
;
Maybe.just = (value)=>Maybe.Just(value)
;
Maybe.nothing = ()=>Maybe.Nothing
;
Maybe.of = Maybe.prototype.of = Maybe.prototype["fantasy-land/of"] = (value)=>Maybe.Just(value)
;
Maybe.prototype.ap = Maybe.prototype["fantasy-land/ap"] = function(container) {
    if (Maybe.Nothing.is(this)) return this;
    return Maybe.Just.is(container) ? Maybe.of(container[$$value](this[$$value])) : container;
};
Maybe.prototype.chain = Maybe.prototype["fantasy-land/chain"] = function(unaryFunction) {
    return this.fold({
        Nothing: (_)=>Maybe.Nothing
        ,
        Just: (value)=>unaryFunction(value)
    });
};
Maybe.prototype.extend = Maybe.prototype["fantasy-land/extend"] = function(unaryFunction) {
    return this.fold({
        Nothing: (_)=>Maybe.Nothing
        ,
        Just: (_)=>Maybe.of(unaryFunction(this))
    });
};
Maybe.prototype.extract = Maybe.prototype["fantasy-land/extract"] = function() {
    return this.fold({
        Nothing: (_)=>Maybe.Nothing
        ,
        Just: (value)=>value
    });
};
Maybe.prototype.filter = Maybe.prototype["fantasy-land/filter"] = function(predicate) {
    return this.fold({
        Nothing: (_)=>this
        ,
        Just: (value)=>predicate(value) ? this : Maybe.Nothing
    });
};
Maybe.prototype.map = Maybe.prototype["fantasy-land/map"] = function(unaryFunction) {
    return this.fold({
        Nothing: (_)=>this
        ,
        Just: (value)=>Maybe.of(unaryFunction(value))
    });
};
Maybe.prototype.traverse = Maybe.prototype["fantasy-land/traverse"] = function(TypeRepresentation, unaryFunction) {
    return this.fold({
        Nothing: (_)=>TypeRepresentation.of(Maybe.Nothing)
        ,
        Just: (value)=>unaryFunction(value).map((x)=>Maybe.Just(x)
            )
    });
};
Maybe.zero = Maybe.prototype.zero = Maybe.prototype["fantasy-land/zero"] = ()=>Maybe.Nothing
;
var invoker = _curry2(function invoker(arity, method) {
    return curryN(arity + 1, function() {
        var target = arguments[arity];
        if (target != null && _isFunction(target[method])) {
            return target[method].apply(target, Array.prototype.slice.call(arguments, 0, arity));
        }
        throw new TypeError(toString3(target) + ' does not have a method named "' + method + '"');
    });
});
var join = invoker(1, 'join');
const serializeTypeInstance = curry((typeName, valueList)=>`${typeName}(${serializeList(valueList)})`
);
const serializeTypeInstanceWithTag = curry((typeName, tagName, valueList)=>valueList.length > 0 ? `${typeName}.${tagName}(${serializeList(valueList)})` : `${typeName}.${tagName}`
);
const serializeTypeInstanceBound = function() {
    return Object.getPrototypeOf(this).hasOwnProperty($$tag) ? serializeTypeInstanceWithTag(this.constructor[$$type], this[$$tag], this[$$valueList]) : serializeTypeInstance(this.constructor[$$type], this[$$valueList]);
};
export const factorizeType = (typeName, propertyNameList)=>{
    let prototypeAccumulator = {
        toString: serializeTypeInstanceBound,
        [$$inspect]: serializeTypeInstanceBound,
        [$$type]: typeName
    };
    const typeRepresentationConstructor = factorizeConstructor(propertyNameList, prototypeAccumulator);
    typeRepresentationConstructor.from = factorizeConstructorFromObject(propertyNameList, prototypeAccumulator);
    typeRepresentationConstructor.is = assertIsTypeRepresentation(typeName);
    typeRepresentationConstructor.prototype = prototypeAccumulator;
    typeRepresentationConstructor.toString = serializeTypeRepresentationBound;
    typeRepresentationConstructor[$$inspect] = serializeTypeRepresentationBound;
    typeRepresentationConstructor[$$type] = typeName;
    prototypeAccumulator.constructor = typeRepresentationConstructor;
    return typeRepresentationConstructor;
};
export const factorizeSumType = (typeName, propertyNameListByTag)=>{
    let prototypeAccumulator = {
        fold: factorizeFoldBound,
        toString: serializeTypeInstanceBound,
        [$$inspect]: serializeTypeInstanceBound
    };
    const tagList = Object.keys(propertyNameListByTag);
    const typeRepresentation = prototypeAccumulator.constructor = {
        is: assertIsTypeRepresentation(typeName),
        prototype: prototypeAccumulator,
        toString: serializeTypeRepresentationBound,
        [$$inspect]: serializeTypeRepresentationBound,
        [$$tagList]: tagList,
        [$$type]: typeName
    };
    for (const [tag, propertyNameList] of Object.entries(propertyNameListByTag)){
        const tagPrototypeAccumulator = Object.assign(Object.create(prototypeAccumulator), {
            [$$tag]: tag
        });
        if (propertyNameList.length === 0) {
            typeRepresentation[tag] = factorizeValue(propertyNameList, tagPrototypeAccumulator, [], 0);
            typeRepresentation[tag].is = assertIsUnit(typeRepresentation[tag]);
            continue;
        }
        typeRepresentation[tag] = factorizeConstructor(propertyNameList, tagPrototypeAccumulator);
        typeRepresentation[tag].from = factorizeConstructorFromObject(propertyNameList, tagPrototypeAccumulator);
        typeRepresentation[tag].toString = serializeConstructorTypeBound;
        typeRepresentation[tag][$$inspect] = serializeConstructorTypeBound;
        typeRepresentation[tag][$$returnType] = typeName;
        typeRepresentation[tag][$$tag] = tag;
        typeRepresentation[tag].is = assertIsVariant(typeRepresentation[tag]);
    }
    return typeRepresentation;
};
export const Pair = factorizeType("Pair", [
    "first",
    "second"
]);
Pair.prototype.bimap = Pair.prototype["fantasy-land/bimap"] = function(unaryFunctionA, unaryFunctionB) {
    return Pair(unaryFunctionA(this.first), unaryFunctionB(this.second));
};
Pair.prototype.map = Pair.prototype["fantasy-land/map"] = function(unaryFunction) {
    return Pair(unaryFunction(this.first), this.second);
};
export const factorizePair = curry(Pair);
export default Pair;
const Step = factorizeSumType("Step", {
    Done: [
        'value'
    ],
    Loop: [
        'value'
    ]
});
const Done = Step.Done;
const Loop = Step.Loop;
export const Task = factorizeType("Task", [
    "asyncFunction"
]);
Task.wrap = (asyncFunction)=>{
    let promise;
    const proxyFunction = function(...argumentList) {
        promise = promise || asyncFunction.call(null, ...argumentList);
        return promise.then((maybeContainer)=>__default.is(maybeContainer) ? maybeContainer : __default.Right(maybeContainer)
        , (maybeContainer)=>__default.is(maybeContainer) ? maybeContainer : __default.Left(maybeContainer)
        );
    };
    return Object.defineProperty(Task(Object.defineProperty(proxyFunction, 'length', {
        value: asyncFunction.length
    })), $$debug, {
        writable: false,
        value: `Task(${serializeFunctionForDebug(asyncFunction)})`
    });
};
Task.prototype.ap = Task.prototype["fantasy-land/ap"] = function(container) {
    return Object.defineProperty(Task((_)=>{
        const maybePromiseValue = this.asyncFunction();
        const maybePromiseUnaryFunction = container.asyncFunction();
        return Promise.all([
            maybePromiseUnaryFunction instanceof Promise ? maybePromiseUnaryFunction : Promise.resolve(maybePromiseUnaryFunction),
            maybePromiseValue instanceof Promise ? maybePromiseValue : Promise.resolve(maybePromiseValue)
        ]).then(([maybeApplicativeUnaryFunction, maybeContainerValue])=>{
            return (Reflect.getPrototypeOf(maybeContainerValue).ap ? maybeContainerValue : __default.Right(maybeContainerValue)).ap(Reflect.getPrototypeOf(maybeApplicativeUnaryFunction).ap ? maybeApplicativeUnaryFunction : __default.Right(maybeApplicativeUnaryFunction));
        });
    }), $$debug, {
        writable: false,
        value: `${this[$$debug]}.ap(${container})`
    });
};
Task.prototype.chain = Task.prototype["fantasy-land/chain"] = function(unaryFunction) {
    return Object.defineProperty(Task((_)=>{
        const maybePromise = this.asyncFunction();
        return (maybePromise instanceof Promise ? maybePromise : Promise.resolve(maybePromise)).then((maybeContainer)=>(__default.is(maybeContainer) ? maybeContainer : __default.Right(maybeContainer)).chain((value)=>{
                const maybePromise1 = unaryFunction(value).run();
                return (maybePromise1 instanceof Promise ? maybePromise1 : Promise.resolve(maybePromise1)).then((maybeContainer1)=>__default.is(maybeContainer1) ? maybeContainer1 : __default.Right(maybeContainer1)
                , (maybeContainer1)=>__default.is(maybeContainer1) ? maybeContainer1 : __default.Left(maybeContainer1)
                );
            })
        , __default.Left);
    }), $$debug, {
        writable: false,
        value: `${this[$$debug]}.chain(${serializeFunctionForDebug(unaryFunction)})`
    });
};
Task.prototype.chainRec = Task.prototype["fantasy-land/chainRec"] = function(ternaryFunction, initialCursor) {
    let accumulator = this;
    let result = Loop(__default(initialCursor, null));
    while(!Done.is(result)){
        result = ternaryFunction(Loop, Done, result.value.first);
        if (Loop.is(result)) {
            accumulator = chainLift(concat, accumulator, result.value.second);
        }
    }
    return accumulator;
};
Task.prototype.map = Task.prototype["fantasy-land/map"] = function(unaryFunction) {
    return Object.defineProperty(Task((_)=>{
        const promise = this.asyncFunction();
        return promise.then((container)=>container.chain((value)=>{
                const maybeContainer = unaryFunction(value);
                return __default.is(maybeContainer) ? maybeContainer : __default.Right(maybeContainer);
            })
        , __default.Left);
    }), $$debug, {
        writable: false,
        value: `${this[$$debug]}.map(${serializeFunctionForDebug(unaryFunction)})`
    });
};
Task.of = Task.prototype.of = Task.prototype["fantasy-land/of"] = (value)=>Object.defineProperty(Task((_)=>Promise.resolve(__default.Right(value))
    ), $$debug, {
        writable: false,
        value: `Task(${serializeFunctionForDebug(value)})`
    })
;
export default Task;
function _uniqContentEquals(aIterator, bIterator, stackA, stackB) {
    var a = _arrayFromIterator(aIterator);
    var b = _arrayFromIterator(bIterator);
    function eq(_a, _b) {
        return _equals(_a, _b, stackA.slice(), stackB.slice());
    }
    return !_includesWith(function(b1, aItem) {
        return !_includesWith(eq, aItem, b1);
    }, b, a);
}
function _equals(a, b, stackA, stackB) {
    if (__default1(a, b)) {
        return true;
    }
    var typeA = type(a);
    if (typeA !== type(b)) {
        return false;
    }
    if (typeof a['fantasy-land/equals'] === 'function' || typeof b['fantasy-land/equals'] === 'function') {
        return typeof a['fantasy-land/equals'] === 'function' && a['fantasy-land/equals'](b) && typeof b['fantasy-land/equals'] === 'function' && b['fantasy-land/equals'](a);
    }
    if (typeof a.equals === 'function' || typeof b.equals === 'function') {
        return typeof a.equals === 'function' && a.equals(b) && typeof b.equals === 'function' && b.equals(a);
    }
    switch(typeA){
        case 'Arguments':
        case 'Array':
        case 'Object':
            if (typeof a.constructor === 'function' && _functionName(a.constructor) === 'Promise') {
                return a === b;
            }
            break;
        case 'Boolean':
        case 'Number':
        case 'String':
            if (!(typeof a === typeof b && __default1(a.valueOf(), b.valueOf()))) {
                return false;
            }
            break;
        case 'Date':
            if (!__default1(a.valueOf(), b.valueOf())) {
                return false;
            }
            break;
        case 'Error':
            return a.name === b.name && a.message === b.message;
        case 'RegExp':
            if (!(a.source === b.source && a.global === b.global && a.ignoreCase === b.ignoreCase && a.multiline === b.multiline && a.sticky === b.sticky && a.unicode === b.unicode)) {
                return false;
            }
            break;
    }
    var idx = stackA.length - 1;
    while(idx >= 0){
        if (stackA[idx] === a) {
            return stackB[idx] === b;
        }
        idx -= 1;
    }
    switch(typeA){
        case 'Map':
            if (a.size !== b.size) {
                return false;
            }
            return _uniqContentEquals(a.entries(), b.entries(), stackA.concat([
                a
            ]), stackB.concat([
                b
            ]));
        case 'Set':
            if (a.size !== b.size) {
                return false;
            }
            return _uniqContentEquals(a.values(), b.values(), stackA.concat([
                a
            ]), stackB.concat([
                b
            ]));
        case 'Arguments':
        case 'Array':
        case 'Object':
        case 'Boolean':
        case 'Number':
        case 'String':
        case 'Date':
        case 'Error':
        case 'RegExp':
        case 'Int8Array':
        case 'Uint8Array':
        case 'Uint8ClampedArray':
        case 'Int16Array':
        case 'Uint16Array':
        case 'Int32Array':
        case 'Uint32Array':
        case 'Float32Array':
        case 'Float64Array':
        case 'ArrayBuffer': break;
        default:
            return false;
    }
    var keysA = keys(a);
    if (keysA.length !== keys(b).length) {
        return false;
    }
    var extendedStackA = stackA.concat([
        a
    ]);
    var extendedStackB = stackB.concat([
        b
    ]);
    idx = keysA.length - 1;
    while(idx >= 0){
        var key = keysA[idx];
        if (!(_has(key, b) && _equals(b[key], a[key], extendedStackA, extendedStackB))) {
            return false;
        }
        idx -= 1;
    }
    return true;
}
var equals = _curry2(function equals(a, b) {
    return _equals(a, b, [], []);
});
function _indexOf(list, a, idx) {
    var inf, item;
    if (typeof list.indexOf === 'function') {
        switch(typeof a){
            case 'number':
                if (a === 0) {
                    inf = 1 / a;
                    while(idx < list.length){
                        item = list[idx];
                        if (item === 0 && 1 / item === inf) {
                            return idx;
                        }
                        idx += 1;
                    }
                    return -1;
                } else if (a !== a) {
                    while(idx < list.length){
                        item = list[idx];
                        if (typeof item === 'number' && item !== item) {
                            return idx;
                        }
                        idx += 1;
                    }
                    return -1;
                }
                return list.indexOf(a, idx);
            case 'string':
            case 'boolean':
            case 'function':
            case 'undefined':
                return list.indexOf(a, idx);
            case 'object':
                if (a === null) {
                    return list.indexOf(a, idx);
                }
        }
    }
    while(idx < list.length){
        if (equals(list[idx], a)) {
            return idx;
        }
        idx += 1;
    }
    return -1;
}
function _includes(a, list) {
    return _indexOf(list, a, 0) >= 0;
}
function _toString(x, seen) {
    var recur = function recur(y) {
        var xs = seen.concat([
            x
        ]);
        return _includes(y, xs) ? '<Circular>' : _toString(y, xs);
    };
    var mapPairs = function(obj, keys1) {
        return _map(function(k) {
            return _quote(k) + ': ' + recur(obj[k]);
        }, keys1.slice().sort());
    };
    switch(Object.prototype.toString.call(x)){
        case '[object Arguments]':
            return '(function() { return arguments; }(' + _map(recur, x).join(', ') + '))';
        case '[object Array]':
            return '[' + _map(recur, x).concat(mapPairs(x, reject(function(k) {
                return /^\d+$/.test(k);
            }, keys(x)))).join(', ') + ']';
        case '[object Boolean]':
            return typeof x === 'object' ? 'new Boolean(' + recur(x.valueOf()) + ')' : x.toString();
        case '[object Date]':
            return 'new Date(' + (isNaN(x.valueOf()) ? recur(NaN) : _quote(_toISOString(x))) + ')';
        case '[object Null]':
            return 'null';
        case '[object Number]':
            return typeof x === 'object' ? 'new Number(' + recur(x.valueOf()) + ')' : 1 / x === -Infinity ? '-0' : x.toString(10);
        case '[object String]':
            return typeof x === 'object' ? 'new String(' + recur(x.valueOf()) + ')' : _quote(x);
        case '[object Undefined]':
            return 'undefined';
        default:
            if (typeof x.toString === 'function') {
                var repr = x.toString();
                if (repr !== '[object Object]') {
                    return repr;
                }
            }
            return '{' + mapPairs(x, keys(x)).join(', ') + '}';
    }
}
var toString2 = _curry1(function toString2(val) {
    return _toString(val, []);
});
export const Either = factorizeSumType("Either", {
    Left: [
        $$value
    ],
    Right: [
        $$value
    ]
});
export default Either;
export const IO = factorizeType("IO", [
    "asyncFunction"
]);
export default IO;
export const Maybe = factorizeSumType("Maybe", {
    Nothing: [],
    Just: [
        $$value
    ]
});
export default Maybe;
const toString3 = toString2;
const serializeList = compose(join(", "), map(toString2));
