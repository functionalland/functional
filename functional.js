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
function _isPlaceholder(a) {
    return a != null && typeof a === 'object' && a['@@functional/placeholder'] === true;
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
function _has(prop, obj) {
    return Object.prototype.hasOwnProperty.call(obj, prop);
}
var toString = Object.prototype.toString;
var _isArguments = function() {
    return toString.call(arguments) === '[object Arguments]' ? function _isArguments(x) {
        return toString.call(x) === '[object Arguments]';
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
const _arity1 = (n, fn)=>{
    if (n >= 0 && n <= 10) return Object.defineProperty((...xs)=>fn.apply(null, xs)
    , "length", {
        enumerable: true,
        value: n
    });
    else throw new Error('First argument to _arity must be a non-negative integer no greater than ten');
};
const _curry11 = (f)=>{
    return function f1(_) {
        return arguments.length === 0 ? f1 : f.apply(this, arguments);
    };
};
const _curry21 = (f)=>{
    return function f2(x, y) {
        switch(arguments.length){
            case 0:
                return f2;
            case 1:
                return _curry11(function(z) {
                    return f(x, z);
                });
            default:
                return f(x, y);
        }
    };
};
const _curryN = (n, xs, f)=>(...zs)=>{
        const ys = [];
        let i = 0;
        let l = n;
        let xi = 0;
        while(xi < xs.length || i < zs.length){
            let x;
            if (xi < xs.length || i >= zs.length) {
                x = xs[xi];
            } else {
                x = zs[i];
                i += 1;
            }
            ys[xi] = x;
            l -= 1;
            xi += 1;
        }
        return l <= 0 ? f.apply(this, ys) : _arity1(l, _curryN(n, ys, f));
    }
;
const curryN = _curry21((n, f)=>n === 1 ? _curry11(f) : _arity1(n, _curryN(n, [], f))
);
const curry2 = curryN(2);
const curry3 = curryN(3);
const append = curry2((x, xs)=>[
        ...xs,
        x
    ]
);
const not = (x)=>!x
;
const startling_ = curryN(4, (f, g, h, x)=>f(g(x))(h(x))
);
const applicator = curryN(2, (f, xs)=>f.apply(null, xs instanceof Array ? xs : [
        xs
    ])
);
const bluebird = curryN(3, (f, g, x)=>f(g(x))
);
const idiot = (x)=>x
;
const complement = bluebird(not);
const assertIsObject = (value)=>typeof value === "object" && !(value instanceof Array)
;
const has = curry2((x, y)=>assertIsObject(x) ? y.has(x) : !!y[x]
);
const prop = curry2((x, y)=>y[x]
);
const zip = curry2((xs, ys)=>{
    let i = 0;
    let zs = [];
    for(; i < xs.length; i++){
        zs[i] = [
            xs[i],
            ys[i]
        ];
    }
    return zs;
});
const zipObj = curry2((xs, ys)=>{
    let i = 0;
    let zs = {
    };
    for(; i < xs.length; i++){
        zs[xs[i]] = ys[i];
    }
    return zs;
});
const chainLift = curry2((binaryFunction, chainableFunctor, functor)=>chainableFunctor.chain((x)=>functor.map(binaryFunction(x))
    )
);
const find = curry2((x, xs)=>xs.find(x)
);
const join = curry2((x, y)=>y.join(x)
);
const map = curry2((f, x)=>(x.map || x["fantasy-land/map"]).call(x, f)
);
const reduce = curry3((f, xs, x)=>(x.reduce || x["fantasy-land/reduce"]).call(x, f, xs)
);
const toString1 = (x)=>x && x.toString() || ""
;
const $$decoder = new TextDecoder();
const $$encoder = new TextEncoder();
const decodeRaw = $$decoder.decode.bind($$decoder);
const encodeText = $$encoder.encode.bind($$encoder);
function _curryN1(length, received, fn) {
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
        return left <= 0 ? fn.apply(this, combined) : _arity(left, _curryN1(length, combined, fn));
    };
}
var curryN1 = _curry2(function curryN1(length, fn) {
    if (length === 1) {
        return _curry1(fn);
    }
    return _arity(length, _curryN1(length, [], fn));
});
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
const __default = Array.isArray || function _isArray(val) {
    return val != null && val.length >= 0 && Object.prototype.toString.call(val) === '[object Array]';
};
function _isString(x) {
    return Object.prototype.toString.call(x) === '[object String]';
}
var _isArrayLike = _curry1(function isArrayLike(x) {
    if (__default(x)) {
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
var bind = _curry2(function bind(fn, thisObj) {
    return _arity(fn.length, function() {
        return fn.apply(thisObj, arguments);
    });
});
function _methodReduce(xf, acc, obj, methodName) {
    return xf['@@transducer/result'](obj[methodName](bind(xf['@@transducer/step'], xf), acc));
}
var symIterator = typeof Symbol !== 'undefined' ? Symbol.iterator : '@@iterator';
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
function _isTransformer(obj) {
    return obj != null && typeof obj['@@transducer/step'] === 'function';
}
function _dispatchable(methodNames, transducerCreator, fn) {
    return function() {
        if (arguments.length === 0) {
            return fn();
        }
        var obj = arguments[arguments.length - 1];
        if (!__default(obj)) {
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
function XMap(f, xf) {
    this.xf = xf;
    this.f = f;
}
const __default1 = {
    init: function() {
        return this.xf['@@transducer/init']();
    },
    result: function(result) {
        return this.xf['@@transducer/result'](result);
    }
};
XMap.prototype['@@transducer/init'] = __default1.init;
XMap.prototype['@@transducer/result'] = __default1.result;
XMap.prototype['@@transducer/step'] = function(result, input) {
    return this.xf['@@transducer/step'](result, this.f(input));
};
var _xmap = _curry2(function _xmap(f, xf) {
    return new XMap(f, xf);
});
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
var map1 = _curry2(_dispatchable([
    'fantasy-land/map',
    'map'
], _xmap, function map1(fn, functor) {
    switch(Object.prototype.toString.call(functor)){
        case '[object Function]':
            return curryN1(functor.length, function() {
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
var ap = _curry2(function ap(applyF, applyX) {
    return typeof applyX['fantasy-land/ap'] === 'function' ? applyX['fantasy-land/ap'](applyF) : typeof applyF.ap === 'function' ? applyF.ap(applyX) : typeof applyF === 'function' ? function(x) {
        return applyF(x)(applyX(x));
    } : _reduce(function(acc, f) {
        return _concat(acc, map1(f, applyX));
    }, [], applyF);
});
var liftN = _curry2(function liftN(arity, fn) {
    var lifted = curryN1(arity, fn);
    return curryN1(arity, function() {
        return _reduce(ap, map1(lifted, arguments[0]), Array.prototype.slice.call(arguments, 1));
    });
});
var lift = _curry1(function lift(fn) {
    return liftN(fn.length, fn);
});
const evert = curry2((T, list)=>list.reduce((accumulator, x)=>lift(append)(x, accumulator)
    , T.of([]))
);
const insideOut = evert;
const log = (message)=>(x)=>console.debug(message, x) || x
;
const runSequentially = (initialChainableFunctor, ...chainableFunctorList)=>reduce((accumulator, chainableFunctor)=>accumulator.chain((_)=>chainableFunctor
        )
    , initialChainableFunctor, chainableFunctorList)
;
const safeExtract = curry2((message, container)=>container.fold({
        Left: (error)=>{
            throw new Error(`${message} Error: ${error.hasOwnProperty('raw') ? decodeRaw(error.raw) : `${error.message}\n${error.stack}`}`);
        },
        Right: (value)=>value
    })
);
const stream = curry3(async (binaryFunction, accumulator, iterator)=>{
    for await (const data of iterator){
        accumulator = binaryFunction(accumulator, data);
    }
    return accumulator;
});
function _objectIs(a, b) {
    if (a === b) {
        return a !== 0 || 1 / a === 1 / b;
    } else {
        return a !== a && b !== b;
    }
}
const __default2 = typeof Object.is === 'function' ? Object.is : _objectIs;
var type = _curry1(function type(val) {
    return val === null ? 'Null' : val === undefined ? 'Undefined' : Object.prototype.toString.call(val).slice(8, -1);
});
function _functionName(f) {
    var match = String(f).match(/^function (\w*)/);
    return match == null ? '' : match[1];
}
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
    if (__default2(a, b)) {
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
            if (!(typeof a === typeof b && __default2(a.valueOf(), b.valueOf()))) {
                return false;
            }
            break;
        case 'Date':
            if (!__default2(a.valueOf(), b.valueOf())) {
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
const factorizeSpy = ()=>{
    const history = [];
    return [
        (functionArity, nAryFunction)=>curryN(functionArity, function(...argumentList) {
                return history.push(argumentList) && nAryFunction.call(this, ...argumentList);
            })
        ,
        {
            assertCalledWith: (...argumentList)=>!!find(equals(argumentList), history)
            ,
            assertCallCount: (n)=>n === history.length
            ,
            get callCount () {
                return history.length;
            },
            get history () {
                return history;
            }
        }
    ];
};
const factorizeFakeInstance = (instance)=>({
        ["fantasy-land/equals"]: (value)=>value instanceof instance
    })
;
const concat = (x)=>(y)=>x.concat(y)
;
const $$debug = Symbol.for("TaskDebug");
const $$inspect1 = typeof Deno !== "undefined" ? Deno.customInspect : "inspect";
const $$returnType = Symbol.for("ReturnType");
const $$tag = Symbol.for("Tag");
const $$tagList = Symbol.for("TagList");
const $$type = Symbol.for("Type");
const $$value = Symbol.for("Value");
const $$valueList = Symbol.for("ValueList");
export { $$inspect1 as $$inspect };
const $$inspect2 = $$inspect1;
const $$type1 = $$type;
const $$tag1 = $$tag;
const assertIsUnit = curry2((instance, value)=>instance === value || !!value && instance[$$tag] === value[$$tag] && instance.constructor[$$type] === value.constructor[$$type]
);
const assertIsTypeRepresentation = curry2((typeName, value)=>value !== undefined && value !== null && typeName === value.constructor[$$type]
);
const $$returnType1 = $$returnType;
const assertIsVariant = curry2((instance, value)=>!!value && instance[$$tag] === value[$$tag] && instance[$$returnType] === value.constructor[$$type]
);
const serializeConstructorType = curry2((typeName, tag)=>`${typeName}.${tag}`
);
const serializeConstructorTypeBound = function() {
    return serializeConstructorType(this[$$returnType], this[$$tag]);
};
const serializeList = bluebird(join(", "), map(toString1));
const serializeTypeInstance = curry2((typeName, valueList)=>`${typeName}(${serializeList(valueList)})`
);
const serializeTypeInstanceWithTag = curry3((typeName, tagName, valueList)=>valueList.length > 0 ? `${typeName}.${tagName}(${serializeList(valueList)})` : `${typeName}.${tagName}`
);
const $$valueList1 = $$valueList;
const serializeTypeInstanceBound = function() {
    return Object.getPrototypeOf(this).hasOwnProperty($$tag) ? serializeTypeInstanceWithTag(this.constructor[$$type], this[$$tag], this[$$valueList]) : serializeTypeInstance(this.constructor[$$type], this[$$valueList]);
};
const serializeTypeRepresentation = (typeName)=>typeName
;
const serializeTypeRepresentationBound = function() {
    return serializeTypeRepresentation(this[$$type]);
};
const factorizeFold = (functionByTag, instanceTag, constructorTagList)=>{
    for (const tag of constructorTagList){
        if (!functionByTag[tag]) {
            throw new TypeError(`Constructors given to fold didn't include: ${tag}`);
        }
    }
    return applicator(functionByTag[instanceTag]);
};
const $$tagList1 = $$tagList;
const factorizeFoldBound = function(functionByTag) {
    return factorizeFold(functionByTag, this[$$tag], this.constructor[$$tagList])(this[$$valueList]);
};
const factorizeType1 = (typeName, propertyNameList)=>{
    let prototypeAccumulator = {
        toString: serializeTypeInstanceBound,
        [$$inspect1]: serializeTypeInstanceBound,
        [$$type]: typeName
    };
    const typeRepresentationConstructor = factorizeConstructor(propertyNameList, prototypeAccumulator);
    typeRepresentationConstructor.from = factorizeConstructorFromObject(propertyNameList, prototypeAccumulator);
    typeRepresentationConstructor.is = assertIsTypeRepresentation(typeName);
    typeRepresentationConstructor.prototype = prototypeAccumulator;
    typeRepresentationConstructor.toString = serializeTypeRepresentationBound;
    typeRepresentationConstructor[$$inspect1] = serializeTypeRepresentationBound;
    typeRepresentationConstructor[$$type] = typeName;
    prototypeAccumulator.constructor = typeRepresentationConstructor;
    return typeRepresentationConstructor;
};
const factorizeSumType = (typeName, propertyNameListByTag)=>{
    let prototypeAccumulator = {
        fold: factorizeFoldBound,
        toString: serializeTypeInstanceBound,
        [$$inspect1]: serializeTypeInstanceBound
    };
    const tagList = Object.keys(propertyNameListByTag);
    const typeRepresentation = prototypeAccumulator.constructor = {
        is: assertIsTypeRepresentation(typeName),
        prototype: prototypeAccumulator,
        toString: serializeTypeRepresentationBound,
        [$$inspect1]: serializeTypeRepresentationBound,
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
        typeRepresentation[tag][$$inspect1] = serializeConstructorTypeBound;
        typeRepresentation[tag][$$returnType] = typeName;
        typeRepresentation[tag][$$tag] = tag;
        typeRepresentation[tag].is = assertIsVariant(typeRepresentation[tag]);
    }
    return typeRepresentation;
};
const factorizeValue = curryN(4, (propertyNameList, prototype, propertyValueList, argumentCount)=>{
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
const factorizeConstructorFromObject = (propertyNameList, prototype)=>bluebird(startling_(factorizeValue(propertyNameList, prototype), idiot, prop("length")), (blueprintObject)=>reduce((accumulator, propertyName)=>{
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
export { factorizeType1 as factorizeType };
const factorizeType2 = factorizeType1;
const Task = factorizeType1("Task", [
    "asyncFunction"
]);
const serializeFunctionForDebug = (asyncFunction)=>asyncFunction.name && asyncFunction.name !== "" ? asyncFunction.name : asyncFunction.toString().length > 25 ? asyncFunction.toString().slice(0, 25).replace(/[\n\r]/g, "").replace(/\s\s*/g, " ") + "[...]" : asyncFunction.toString().replace(/[\n\r]/g, "").replace(/\s\s*/g, " ")
;
const factorizeSumType1 = factorizeSumType;
const $$value1 = $$value;
const Either = factorizeSumType("Either", {
    Left: [
        $$value
    ],
    Right: [
        $$value
    ]
});
Either.fromNullable = (value)=>!(typeof value !== "undefined") || !value && typeof value === "object" ? Either.Left(value) : Either.Right(value)
;
Either.left = (value)=>Either.Left(value)
;
Either.right = (value)=>Either.Right(value)
;
Either.of = Either.prototype.of = Either.prototype["fantasy-land/of"] = (value)=>Either.Right(value)
;
Either.prototype.alt = Either.prototype["fantasy-land/alt"] = function(container) {
    return this.fold({
        Left: (_)=>container
        ,
        Right: (_)=>this
    });
};
Either.prototype.ap = Either.prototype["fantasy-land/ap"] = function(container) {
    return this.fold({
        Left: (_)=>this
        ,
        Right: (value)=>Either.Right.is(container) ? Either.Right(container[$$value](value)) : container
    });
};
Either.prototype.chain = Either.prototype["fantasy-land/chain"] = function(unaryFunction) {
    return this.fold({
        Left: (_)=>this
        ,
        Right: (value)=>unaryFunction(value)
    });
};
Either.prototype.extend = Either.prototype["fantasy-land/extend"] = function(unaryFunction) {
    return this.fold({
        Left: (_)=>this
        ,
        Right: (_)=>Either.of(unaryFunction(this))
    });
};
Either.prototype.extract = Either.prototype["fantasy-land/extract"] = function() {
    return this.fold({
        Left: (_)=>this
        ,
        Right: (value)=>value
    });
};
Either.prototype.map = Either.prototype["fantasy-land/map"] = function(unaryFunction) {
    return this.fold({
        Left: (_)=>this
        ,
        Right: (value)=>Either.of(unaryFunction(value))
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
const __default3 = Either;
export { __default3 as default };
const $$debug1 = $$debug;
Task.wrap = (asyncFunction)=>{
    let promise;
    const proxyFunction = function(...argumentList) {
        promise = promise || asyncFunction.call(null, ...argumentList);
        return promise.then((maybeContainer)=>Either.is(maybeContainer) ? maybeContainer : Either.Right(maybeContainer)
        , (maybeContainer)=>Either.is(maybeContainer) ? maybeContainer : Either.Left(maybeContainer)
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
            return (Reflect.getPrototypeOf(maybeContainerValue).ap ? maybeContainerValue : Either.Right(maybeContainerValue)).ap(Reflect.getPrototypeOf(maybeApplicativeUnaryFunction).ap ? maybeApplicativeUnaryFunction : Either.Right(maybeApplicativeUnaryFunction));
        });
    }), $$debug, {
        writable: false,
        value: `${this[$$debug]}.ap(${container})`
    });
};
Task.prototype.chain = Task.prototype["fantasy-land/chain"] = function(unaryFunction) {
    return Object.defineProperty(Task((_)=>{
        const maybePromise = this.asyncFunction();
        return (maybePromise instanceof Promise ? maybePromise : Promise.resolve(maybePromise)).then((maybeContainer)=>(Either.is(maybeContainer) ? maybeContainer : Either.Right(maybeContainer)).chain((value)=>{
                const maybePromise1 = unaryFunction(value).run();
                return (maybePromise1 instanceof Promise ? maybePromise1 : Promise.resolve(maybePromise1)).then((maybeContainer1)=>Either.is(maybeContainer1) ? maybeContainer1 : Either.Right(maybeContainer1)
                , (maybeContainer1)=>Either.is(maybeContainer1) ? maybeContainer1 : Either.Left(maybeContainer1)
                );
            })
        , Either.Left);
    }), $$debug, {
        writable: false,
        value: `${this[$$debug]}.chain(${serializeFunctionForDebug(unaryFunction)})`
    });
};
const Step = factorizeSumType("Step", {
    Done: [
        'value'
    ],
    Loop: [
        'value'
    ]
});
Step.prototype.alt = Step.prototype["fantasy-land/alt"] = function(container) {
    return this.fold({
        Done: (_)=>container
        ,
        Loop: (_)=>this
    });
};
const Done = Step.Done;
const Loop = Step.Loop;
const Pair = factorizeType1("Pair", [
    "first",
    "second"
]);
Pair.prototype.bimap = Pair.prototype["fantasy-land/bimap"] = function(unaryFunctionA, unaryFunctionB) {
    return Pair(unaryFunctionA(this.first), unaryFunctionB(this.second));
};
Pair.prototype.map = Pair.prototype["fantasy-land/map"] = function(unaryFunction) {
    return Pair(unaryFunction(this.first), this.second);
};
const factorizePair = curryN(2, Pair);
const __default4 = Pair;
export { __default4 as default };
Task.prototype.chainRec = Task.prototype["fantasy-land/chainRec"] = function(ternaryFunction, initialCursor) {
    let accumulator = this;
    let result = Loop(Pair(initialCursor, null));
    while(!Done.is(result)){
        result = ternaryFunction(Loop, Done, result.value.first);
        if (Loop.is(result)) {
            accumulator = chainLift(concat, accumulator, result.value.second);
        }
    }
    return accumulator;
};
Task.prototype.map = Task.prototype["fantasy-land/map"] = Task.prototype.then = function(unaryFunction) {
    return Object.defineProperty(Task((_)=>{
        const promise = this.asyncFunction();
        return promise.then((container)=>container.chain((value)=>{
                const maybeContainer = unaryFunction(value);
                return Either.is(maybeContainer) ? maybeContainer : Either.Right(maybeContainer);
            })
        , Either.Left);
    }), $$debug, {
        writable: false,
        value: `${this[$$debug]}.map(${serializeFunctionForDebug(unaryFunction)})`
    });
};
Task.prototype.catch = function(unaryFunction) {
    return Object.defineProperty(Task((_)=>{
        const promise = this.asyncFunction();
        return promise.then((container)=>Either.Left.is(container) ? Either.Right(unaryFunction(container[$$value])) : container
        , Either.Left);
    }), $$debug, {
        writable: false,
        value: `${this[$$debug]}.map(${serializeFunctionForDebug(unaryFunction)})`
    });
};
Task.of = Task.prototype.of = Task.prototype["fantasy-land/of"] = (value)=>Object.defineProperty(Task((_)=>Promise.resolve(Either.Right(value))
    ), $$debug, {
        writable: false,
        value: `Task(${serializeFunctionForDebug(value)})`
    })
;
Task.prototype.run = async function() {
    const maybePromise = this.asyncFunction();
    return (maybePromise instanceof Promise ? maybePromise : Promise.resolve(maybePromise)).then((maybeContainer)=>Either.is(maybeContainer) ? maybeContainer : Either.Right(maybeContainer)
    , (maybeContainer)=>Either.is(maybeContainer) ? maybeContainer : Either.Left(maybeContainer)
    );
};
Task.prototype.toString = Task.prototype[$$inspect1] = function() {
    return this[$$debug] || `Task("unknown")`;
};
const factorizeTask = (x)=>Task.of(x)
;
const Maybe = factorizeSumType("Maybe", {
    Nothing: [],
    Just: [
        $$value
    ]
});
Maybe.fromNullable = (value)=>!(typeof value !== "undefined") || !value && typeof value === "object" ? Maybe.nothing() : Maybe.just(value)
;
Maybe.just = (value)=>Maybe.Just(value)
;
Maybe.nothing = ()=>Maybe.Nothing
;
Maybe.of = Maybe.prototype.of = Maybe.prototype["fantasy-land/of"] = (value)=>Maybe.Just(value)
;
Maybe.prototype.alt = Maybe.prototype["fantasy-land/alt"] = function(container) {
    return this.fold({
        Nothing: (_)=>container
        ,
        Just: (_)=>this
    });
};
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
const IO = factorizeType1("IO", [
    "asyncFunction"
]);
IO.prototype.ap = IO.prototype["fantasy-land/ap"] = function(container) {
    return container.map((unaryFunction)=>unaryFunction(this.asyncFunction())
    );
};
IO.prototype.chain = IO.prototype["fantasy-land/chain"] = function(unaryFunction) {
    return IO((_)=>unaryFunction(this.asyncFunction())
    ).run();
};
IO.prototype.map = IO.prototype["fantasy-land/map"] = function(unaryFunction) {
    return IO((_)=>unaryFunction(this.asyncFunction())
    );
};
IO.prototype.run = function() {
    return this.asyncFunction();
};
IO.of = IO.prototype.of = IO.prototype["fantasy-land/of"] = (value)=>IO((_)=>value
    )
;
const decodeRaw1 = decodeRaw;
const encodeText1 = encodeText;
const evert1 = evert;
const insideOut1 = evert;
const log1 = log;
const runSequentially1 = runSequentially;
const safeExtract1 = safeExtract;
const stream1 = stream;
const factorizeSpy1 = factorizeSpy;
const factorizeFakeInstance1 = factorizeFakeInstance;
const Task1 = Task;
const factorizeTask1 = factorizeTask;
const __default5 = Task;
export { __default5 as default };
const Pair1 = Pair;
const factorizePair1 = factorizePair;
const Maybe1 = Maybe;
const __default6 = Maybe;
export { __default6 as default };
const IO1 = IO;
const __default7 = IO;
export { __default7 as default };
const Either1 = Either;
export { decodeRaw as decodeRaw };
export { encodeText as encodeText };
export { evert as evert };
export { insideOut as insideOut };
export { log as log };
export { runSequentially as runSequentially };
export { safeExtract as safeExtract };
export { stream as stream };
export { factorizeSpy as factorizeSpy };
export { factorizeFakeInstance as factorizeFakeInstance };
export { Task as Task };
export { factorizeTask as factorizeTask };
export { $$debug as $$debug };
export { $$returnType as $$returnType };
export { $$tag as $$tag };
export { $$tagList as $$tagList };
export { $$type as $$type };
export { $$value as $$value };
export { $$valueList as $$valueList };
export { factorizeSumType as factorizeSumType };
export { Pair as Pair };
export { factorizePair as factorizePair };
export { Maybe as Maybe };
export { IO as IO };
export { Either as Either };
