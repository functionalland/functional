const assertIsFunction = (value)=>value instanceof Function
;
const _arity = (n, fn)=>{
    if (n >= 0 && n <= 10) return Object.defineProperty((...xs)=>fn.apply(null, xs)
    , "length", {
        enumerable: true,
        value: n
    });
    else throw new Error('First argument to _arity must be a non-negative integer no greater than ten');
};
const _curry1 = (f)=>{
    return function f1(_) {
        return arguments.length === 0 ? f1 : f.apply(this, arguments);
    };
};
const _curry2 = (f)=>{
    return function f2(x, y) {
        switch(arguments.length){
            case 0:
                return f2;
            case 1:
                return _curry1(function(z) {
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
        return l <= 0 ? f.apply(this, ys) : _arity(l, _curryN(n, ys, f));
    }
;
const curryN1 = _curry2((n, f)=>n === 1 ? _curry1(f) : _arity(n, _curryN(n, [], f))
);
export { curryN1 as curryN };
const curry21 = curryN1(2);
export { curry21 as curry2 };
const curry31 = curryN1(3);
export { curry31 as curry3 };
const ap1 = curry21((f, g, ...a)=>assertIsFunction(f["fantasy-land/ap"]) && assertIsFunction(g["fantasy-land/ap"]) || assertIsFunction(f.ap) && assertIsFunction(g.ap) ? (g.ap || g["fantasy-land/ap"]).call(g, f) : a.length === 1 ? starling1(f, g, a[0]) : (x)=>starling1(f, g, x)
);
export { ap1 as ap };
const assertIsNull = (value)=>value === null
;
const assertIsObject = (value)=>typeof value === "object" && !(value instanceof Array)
;
const assertIsString = (value)=>typeof value === "string"
;
const mod = function() {
    const alt = curry21((x, y)=>(y.alt || y["fantasy-land/alt"]).call(y, x)
    );
    const ap2 = ap1;
    const bimap = curry31((f, g, x)=>(x.bimap || x["fantasy-land/bimap"]).call(x, f, g)
    );
    const chain = curry21((f, x)=>(x.chain || x["fantasy-land/chain"]).call(x, f)
    );
    const chainLift = curry21((binaryFunction, chainableFunctor, functor)=>chainableFunctor.chain((x)=>functor.map(binaryFunction(x))
        )
    );
    const chainRec = curry21((ternaryFunction, initiator, chainableRecursiveFunctor)=>(chainableRecursiveFunctor.chainRec || chainableRecursiveFunctor["fantasy-land/chainRec"]).call(chainableRecursiveFunctor, ternaryFunction, initiator)
    );
    const concat = curry21((x, y)=>assertIsString(x) && assertIsString(y) ? x + y : (y.concat || y["fantasy-land/concat"]).call(y, x)
    );
    const extend = curry21((f, x)=>(x.extend || x["fantasy-land/extend"]).call(x, f)
    );
    const extract = (x)=>(x.extract || x["fantasy-land/extract"]).call(x)
    ;
    const map = curry21((f, x)=>(x.map || x["fantasy-land/map"]).call(x, f)
    );
    const reduce = curry31((f, xs, x)=>(x.reduce || x["fantasy-land/reduce"]).call(x, (ys, y, ...a)=>f.length === 1 ? f(ys)(y) : f(ys, y, ...a)
        , xs)
    );
    const then = curry21((f, $p)=>assertIsFunction($p) ? ($q)=>$q.then(f, $p)
         : $p.then(f)
    );
    const toString = (x)=>x && x.toString() || ""
    ;
    return {
        alt,
        ap: ap1,
        bimap,
        chain,
        chainLift,
        chainRec,
        concat,
        extend,
        extract,
        map,
        reduce,
        then,
        toString
    };
}();
const assertIsUndefined = (value)=>value === undefined
;
const starling1 = curry31((f, g, x)=>f(x)(g(x))
);
export { starling1 as starling };
const S1 = starling1;
export { S1 as S };
const applicator1 = curry21((f, xs)=>f.apply(null, xs instanceof Array ? xs : [
        xs
    ])
);
export { applicator1 as applicator };
const idiotStar1 = applicator1;
export { idiotStar1 as idiotStar };
const apply1 = applicator1;
export { apply1 as apply };
const apply2 = apply1;
const $1 = applicator1;
export { $1 as $ };
const thrush1 = curry21((x, f)=>f(x)
);
export { thrush1 as thrush };
const applyTo1 = thrush1;
export { applyTo1 as applyTo };
const T1 = thrush1;
export { T1 as T };
const CI1 = thrush1;
export { CI1 as CI };
const bluebird1 = curry31((f, g, x)=>f(g(x))
);
export { bluebird1 as bluebird };
const compose21 = bluebird1;
export { compose21 as compose2 };
const compose22 = compose21;
const o1 = bluebird1;
export { o1 as o };
const B1 = bluebird1;
export { B1 as B };
const becard1 = curryN1(4, (f, g, h, x)=>f(g(h(x)))
);
export { becard1 as becard };
const compose31 = becard1;
export { compose31 as compose3 };
const compose32 = compose31;
const B31 = becard1;
export { B31 as B3 };
const kestrel1 = curry21((x, _)=>x
);
export { kestrel1 as kestrel };
const constant1 = kestrel1;
export { constant1 as constant };
const first1 = kestrel1;
export { first1 as first };
const K1 = kestrel1;
export { K1 as K };
const cardinal1 = curry31((f, x, y)=>f(y)(x)
);
export { cardinal1 as cardinal };
const flip1 = cardinal1;
export { flip1 as flip };
const flip2 = flip1;
const C1 = cardinal1;
export { C1 as C };
const kite1 = curry21((x, y)=>y
);
export { kite1 as kite };
const second1 = kite1;
export { second1 as second };
const idiot1 = (x)=>x
;
export { idiot1 as idiot };
const identity1 = idiot1;
export { identity1 as identity };
const identity2 = identity1;
const id1 = idiot1;
export { id1 as id };
const I1 = idiot1;
export { I1 as I };
const starling_1 = curryN1(4, (f, g, h, x)=>f(g(x))(h(x))
);
export { starling_1 as starling_ };
const apBinary1 = starling_1;
export { apBinary1 as apBinary };
const S_1 = starling_1;
export { S_1 as S_ };
const idiotStarStar1 = curry31((f, x, y)=>f(x)(y)
);
export { idiotStarStar1 as idiotStarStar };
const applyBinary1 = idiotStarStar1;
export { applyBinary1 as applyBinary };
const applyBinary2 = applyBinary1;
const I$$1 = idiotStarStar1;
export { I$$1 as I$$ };
const dickcissel1 = curryN1(5, (f, x, y, g, z)=>f(x)(y)(g(z))
);
export { dickcissel1 as dickcissel };
const applyBinaryCompose1 = dickcissel1;
export { applyBinaryCompose1 as applyBinaryCompose };
const D11 = dickcissel1;
export { D11 as D1 };
const dove1 = curryN1(4, (f, x, g, y)=>f(x)(g(y))
);
export { dove1 as dove };
const applyCompose1 = dove1;
export { applyCompose1 as applyCompose };
const D2 = dove1;
export { D2 as D };
const dovekie1 = curryN1(5, (f, g, x, h, y)=>f(g(x))(h(y))
);
export { dovekie1 as dovekie };
const apply2Compose1 = dovekie1;
export { apply2Compose1 as apply2Compose };
const D21 = dovekie1;
export { D21 as D2 };
const eagle1 = curryN1(5, (f, x, g, y, z)=>f(x)(g(y)(z))
);
export { eagle1 as eagle };
const applyComposeBinary1 = eagle1;
export { applyComposeBinary1 as applyComposeBinary };
const E1 = eagle1;
export { E1 as E };
const finch1 = curry31((x, y, f)=>f(y)(x)
);
export { finch1 as finch };
const applyToFlip1 = finch1;
export { applyToFlip1 as applyToFlip };
const F1 = finch1;
export { F1 as F };
const finchStar1 = curryN1(4, (f, x, y, z)=>f(z)(y)(x)
);
export { finchStar1 as finchStar };
const applyTernaryFlip1 = finchStar1;
export { applyTernaryFlip1 as applyTernaryFlip };
const F$1 = finchStar1;
export { F$1 as F$ };
const finchStarStar1 = curryN1(5, (f, w, x, y, z)=>f(w)(z)(y)(x)
);
export { finchStarStar1 as finchStarStar };
const applyQuaternaryFlip1 = finchStarStar1;
export { applyQuaternaryFlip1 as applyQuaternaryFlip };
const F$$1 = finchStarStar1;
export { F$$1 as F$$ };
const blackbird1 = curryN1(4, (f, g, x, y)=>f(g(x)(y))
);
export { blackbird1 as blackbird };
const composeBinary1 = blackbird1;
export { composeBinary1 as composeBinary };
const composeBinary2 = composeBinary1;
const oo1 = blackbird1;
export { oo1 as oo };
const B11 = blackbird1;
export { B11 as B1 };
const eaglebald1 = curryN1(7, (f, g, w, x, h, y, z)=>f(g(w)(x))(h(y)(z))
);
export { eaglebald1 as eaglebald };
const composeBinaryApBinary1 = eaglebald1;
export { composeBinaryApBinary1 as composeBinaryApBinary };
const E_1 = eaglebald1;
export { E_1 as E_ };
const bunting1 = curryN1(5, (f, g, x, y, z)=>f(g(x)(y)(z))
);
export { bunting1 as bunting };
const composeTernary1 = bunting1;
export { composeTernary1 as composeTernary };
const ooo1 = bunting1;
export { ooo1 as ooo };
const B21 = bunting1;
export { B21 as B2 };
const goldfinch1 = curryN1(4, (f, g, x, y)=>f(y)(g(x))
);
export { goldfinch1 as goldfinch };
const composeFlip1 = goldfinch1;
export { composeFlip1 as composeFlip };
const G1 = goldfinch1;
export { G1 as G };
const hummingbird1 = curry31((f, x, y)=>f(x)(y)(x)
);
export { hummingbird1 as hummingbird };
const H1 = hummingbird1;
export { H1 as H };
const cardinal_1 = curryN1(4, (f, g, x, y)=>f(g(y))(x)
);
export { cardinal_1 as cardinal_ };
const flipAp1 = cardinal_1;
export { flipAp1 as flipAp };
const C_1 = cardinal_1;
export { C_1 as C_ };
const cardinalStar1 = curryN1(4, (f, x, y, z)=>f(x)(z)(y)
);
export { cardinalStar1 as cardinalStar };
const flipTernary1 = cardinalStar1;
export { flipTernary1 as flipTernary };
const C$1 = cardinalStar1;
export { C$1 as C$ };
const BC1 = cardinalStar1;
export { BC1 as BC };
const cardinalStarStar1 = curryN1(5, (f, w, x, y, z)=>f(w)(x)(z)(y)
);
export { cardinalStarStar1 as cardinalStarStar };
const flipQuaternary1 = cardinalStarStar1;
export { flipQuaternary1 as flipQuaternary };
const C$$1 = cardinalStarStar1;
export { C$$1 as C$$ };
const jalt1 = curry31((f, x, _)=>f(x)
);
export { jalt1 as jalt };
const jalt_1 = curryN1(4, (f, x, y, _)=>f(x)(y)
);
export { jalt_1 as jalt_ };
const jay1 = curryN1(4, (f, x, y, z)=>f(x)(f(z)(y))
);
export { jay1 as jay };
const owl1 = curry21((f, g)=>g(f(g))
);
export { owl1 as owl };
const phoenix1 = curryN1(4, (f, g, h, x)=>f(g(x))(h(x))
);
export { phoenix1 as phoenix };
const psi1 = curryN1(4, (f, g, x, y)=>f(g(x))(g(y))
);
export { psi1 as psi };
const quacky1 = curry31((x, f, g)=>g(f(x))
);
export { quacky1 as quacky };
const applyToPipe1 = quacky1;
export { applyToPipe1 as applyToPipe };
const queer1 = curry31((f, g, x)=>g(f(x))
);
export { queer1 as queer };
const pipe1 = queer1;
export { pipe1 as pipe };
const quirky1 = curry31((f, x, g)=>g(f(x))
);
export { quirky1 as quirky };
const applyPipe1 = quirky1;
export { applyPipe1 as applyPipe };
const quixotic1 = curry31((f, x, g)=>f(g(x))
);
export { quixotic1 as quixotic };
const quizzical1 = curry31((x, f, g)=>f(g(x))
);
export { quizzical1 as quizzical };
const robin1 = curry31((x, f, y)=>f(y)(x)
);
export { robin1 as robin };
const robinstar1 = curryN1(4, (f, x, y, z)=>f(y)(z)(x)
);
export { robinstar1 as robinstar };
const robinstarstar1 = curryN1(5, (f, w, x, y, z)=>f(w)(y)(z)(x)
);
export { robinstarstar1 as robinstarstar };
const vireo1 = curry31((x, y, f)=>f(x)(y)
);
export { vireo1 as vireo };
const applyToBinary1 = vireo1;
export { applyToBinary1 as applyToBinary };
const V1 = vireo1;
export { V1 as V };
const vireostar1 = curryN1(4, (f, x, y, z)=>f(y)(x)(z)
);
export { vireostar1 as vireostar };
const vireostarstar1 = curryN1(5, (f, w, x, y, z)=>f(w)(z)(x)(y)
);
export { vireostarstar1 as vireostarstar };
const warbler1 = curry21((f, x)=>f(x)(x)
);
export { warbler1 as warbler };
const duplicate1 = warbler1;
export { duplicate1 as duplicate };
const W1 = warbler1;
export { W1 as W };
const warbler_1 = curry21((x, f)=>f(x)(x)
);
export { warbler_1 as warbler_ };
const warblerstar1 = curry31((f, x, y)=>f(x)(y)(y)
);
export { warblerstar1 as warblerstar };
const warblerstarstar1 = curryN1(4, (f, x, y, z)=>f(x)(y)(z)(z)
);
export { warblerstarstar1 as warblerstarstar };
const $$debug1 = Symbol.for("TaskDebug");
export { $$debug1 as $$debug };
const $$debug2 = $$debug1;
const $$inspect1 = typeof Deno !== "undefined" ? Deno.customInspect : "inspect";
export { $$inspect1 as $$inspect };
const $$inspect2 = $$inspect1;
const $$inspect3 = $$inspect1;
const $$returnType1 = Symbol.for("ReturnType");
export { $$returnType1 as $$returnType };
const $$returnType2 = $$returnType1;
const $$tag1 = Symbol.for("Tag");
export { $$tag1 as $$tag };
const $$tag2 = $$tag1;
const $$tagList1 = Symbol.for("TagList");
export { $$tagList1 as $$tagList };
const $$tagList2 = $$tagList1;
const $$type1 = Symbol.for("Type");
export { $$type1 as $$type };
const $$type2 = $$type1;
const $$value1 = Symbol.for("Value");
export { $$value1 as $$value };
const $$value2 = $$value1;
const $$value3 = $$value1;
const $$value4 = $$value1;
const $$value5 = $$value1;
const $$valueList1 = Symbol.for("ValueList");
export { $$valueList1 as $$valueList };
const assertIsUnit = curry21((instance, value)=>instance === value || !!value && instance[$$tag1] === value[$$tag1] && instance.constructor[$$type1] === value.constructor[$$type1]
);
const assertIsTypeRepresentation = curry21((typeName, value)=>value !== undefined && value !== null && typeName === value.constructor[$$type1]
);
const assertIsVariant = curry21((instance, value)=>!!value && instance[$$tag1] === value[$$tag1] && instance[$$returnType1] === value.constructor[$$type1]
);
const serializeConstructorType = curry21((typeName, tag)=>`${typeName}.${tag}`
);
const serializeConstructorTypeBound = function() {
    return serializeConstructorType(this[$$returnType1], this[$$tag1]);
};
const append1 = curry21((x, xs)=>[
        ...xs,
        x
    ]
);
export { append1 as append };
const not1 = (x)=>!x
;
export { not1 as not };
const complement1 = compose21(not1);
export { complement1 as complement };
const find1 = curry21((f, xs)=>xs.find(f)
);
export { find1 as find };
const has1 = curry21((x, y)=>assertIsObject(x) ? y.has(x) : !!y[x]
);
export { has1 as has };
const join1 = curry21((x, y)=>y.join(x)
);
export { join1 as join };
const lift21 = curry31((f, x, y)=>y.ap(x.map(f))
);
export { lift21 as lift2 };
const lift31 = curryN1(4, (f, x, y, z)=>z.ap(y.ap(x.map(f)))
);
export { lift31 as lift3 };
const prop1 = curry21((x, y)=>y[x]
);
export { prop1 as prop };
const set1 = curry31((s, x, o2)=>Object.defineProperty(o2, s, {
        enumerable: true,
        value: x,
        writable: true
    })
);
export { set1 as set };
const zip1 = curry21((xs, ys)=>{
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
export { zip1 as zip };
const zipObj1 = curry21((xs, ys)=>{
    let i = 0;
    let zs = {
    };
    for(; i < xs.length; i++){
        zs[xs[i]] = ys[i];
    }
    return zs;
});
export { zipObj1 as zipObj };
const zipWith1 = curry31((f, xs, ys)=>{
    let i = 0;
    let zs = [];
    for(; i < xs.length; i++){
        zs[i] = f(xs[i])(ys[i]);
    }
    return zs;
});
export { zipWith1 as zipWith };
const serializeList = compose21(join1(", "), map(toString));
const serializeTypeInstance = curry21((typeName, valueList)=>`${typeName}(${serializeList(valueList)})`
);
const serializeTypeInstanceWithTag = curry31((typeName, tagName, valueList)=>valueList.length > 0 ? `${typeName}.${tagName}(${serializeList(valueList)})` : `${typeName}.${tagName}`
);
const serializeTypeInstanceBound = function() {
    return Object.getPrototypeOf(this).hasOwnProperty($$tag1) ? serializeTypeInstanceWithTag(this.constructor[$$type1], this[$$tag1], this[$$valueList1]) : serializeTypeInstance(this.constructor[$$type1], this[$$valueList1]);
};
const serializeTypeRepresentation = (typeName)=>typeName
;
const serializeTypeRepresentationBound = function() {
    return serializeTypeRepresentation(this[$$type1]);
};
const factorizeFold = (functionByTag, instanceTag, constructorTagList)=>{
    for (const tag of constructorTagList){
        if (!functionByTag[tag]) {
            throw new TypeError(`Constructors given to fold didn't include: ${tag}`);
        }
    }
    return apply1(functionByTag[instanceTag]);
};
const factorizeFoldBound = function(functionByTag) {
    return factorizeFold(functionByTag, this[$$tag1], this.constructor[$$tagList1])(this[$$valueList1]);
};
const factorizeType1 = curry21((typeName, propertyNameList)=>{
    let prototypeAccumulator = {
        toString: serializeTypeInstanceBound,
        [$$inspect1]: serializeTypeInstanceBound,
        [$$type1]: typeName
    };
    const typeRepresentationConstructor = factorizeConstructor(propertyNameList, prototypeAccumulator);
    typeRepresentationConstructor.from = factorizeConstructorFromObject(propertyNameList, prototypeAccumulator);
    typeRepresentationConstructor.is = assertIsTypeRepresentation(typeName);
    typeRepresentationConstructor.prototype = prototypeAccumulator;
    typeRepresentationConstructor.toString = serializeTypeRepresentationBound;
    typeRepresentationConstructor[$$inspect2] = serializeTypeRepresentationBound;
    typeRepresentationConstructor[$$type2] = typeName;
    prototypeAccumulator.constructor = typeRepresentationConstructor;
    return typeRepresentationConstructor;
});
export { factorizeType1 as factorizeType };
const factorizeSumType1 = curry21((typeName, propertyNameListByTag)=>{
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
        [$$inspect2]: serializeTypeRepresentationBound,
        [$$tagList2]: tagList,
        [$$type2]: typeName
    };
    for (const [tag, propertyNameList] of Object.entries(propertyNameListByTag)){
        const tagPrototypeAccumulator = Object.assign(Object.create(prototypeAccumulator), {
            [$$tag1]: tag
        });
        if (propertyNameList.length === 0) {
            typeRepresentation[tag] = factorizeValue(propertyNameList, tagPrototypeAccumulator, [], 0);
            typeRepresentation[tag].is = assertIsUnit(typeRepresentation[tag]);
            continue;
        }
        typeRepresentation[tag] = factorizeConstructor(propertyNameList, tagPrototypeAccumulator);
        typeRepresentation[tag].from = factorizeConstructorFromObject(propertyNameList, tagPrototypeAccumulator);
        typeRepresentation[tag].toString = serializeConstructorTypeBound;
        typeRepresentation[tag][$$inspect2] = serializeConstructorTypeBound;
        typeRepresentation[tag][$$returnType2] = typeName;
        typeRepresentation[tag][$$tag2] = tag;
        typeRepresentation[tag].is = assertIsVariant(typeRepresentation[tag]);
    }
    return typeRepresentation;
});
export { factorizeSumType1 as factorizeSumType };
const factorizeValue = curryN1(4, (propertyNameList, prototype, propertyValueList, argumentCount)=>{
    if (argumentCount !== propertyNameList.length) {
        throw new TypeError(`Expected ${propertyNameList.length} arguments, got ${argumentCount}.`);
    }
    return Object.assign(Object.create(prototype), {
        ...zipObj1(propertyNameList, propertyValueList),
        [$$valueList1]: propertyValueList
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
const factorizeConstructorFromObject = (propertyNameList, prototype)=>compose21(apBinary1(factorizeValue(propertyNameList, prototype), identity1, prop1("length")), (blueprintObject)=>reduce((accumulator, propertyName)=>{
            if (complement1(has1)(propertyName, blueprintObject)) {
                throw new TypeError(`Missing field: ${propertyName}`);
            }
            return [
                ...accumulator,
                blueprintObject[propertyName]
            ];
        }, [], propertyNameList)
    )
;
const Box1 = factorizeType1("Box")([
    $$value1
]);
Box1.prototype.ap = Box1.prototype["fantasy-land/ap"] = function(A) {
    return Box1(A[$$value5](this[$$value5]));
};
Box1.prototype.chain = Box1.prototype["fantasy-land/chain"] = function(f) {
    return f(this[$$value5]);
};
Box1.prototype.extend = Box1.prototype["fantasy-land/extend"] = function(f) {
    return Box1(f(this));
};
Box1.prototype.extract = Box1.prototype["fantasy-land/extract"] = function() {
    return this[$$value5];
};
Box1.prototype.map = Box1.prototype["fantasy-land/map"] = function(f) {
    return Box1(f(this[$$value5]));
};
Box1.of = Box1.prototype.of = Box1.prototype["fantasy-land/of"] = function(x) {
    return Box1(x);
};
export { Box1 as default };
export { Box1 as Box };
const factorizeBox1 = Box1.of;
export { factorizeBox1 as factorizeBox };
const Either2 = factorizeSumType1("Either", {
    Left: [
        $$value1
    ],
    Right: [
        $$value1
    ]
});
Either2.prototype.alt = Either2.prototype["fantasy-land/alt"] = function(A) {
    return this.fold({
        Left: (_)=>A
        ,
        Right: (_)=>this
    });
};
Either2.prototype.ap = Either2.prototype["fantasy-land/ap"] = function(A) {
    return this.fold({
        Left: (_)=>this
        ,
        Right: (x)=>Either2.Right.is(A) ? Either2.Right(A[$$value4](x)) : A
    });
};
Either2.prototype.chain = Either2.prototype["fantasy-land/chain"] = function(f) {
    return this.fold({
        Left: (_)=>this
        ,
        Right: (x)=>f(x)
    });
};
Either2.prototype.extend = Either2.prototype["fantasy-land/extend"] = function(f) {
    return this.fold({
        Left: (_)=>this
        ,
        Right: (_)=>Either2.of(f(this))
    });
};
Either2.prototype.extract = Either2.prototype["fantasy-land/extract"] = function() {
    return this.fold({
        Left: identity2,
        Right: identity2
    });
};
Either2.prototype.map = Either2.prototype["fantasy-land/map"] = function(f) {
    return this.fold({
        Left: (_)=>this
        ,
        Right: (x)=>Either2.Right(f(x))
    });
};
Either2.of = Either2.prototype.of = Either2.prototype["fantasy-land/of"] = (x)=>Either2.Right(x)
;
Either2.zero = Either2.prototype.zero = Either2.prototype["fantasy-land/zero"] = ()=>Either2.Left(null)
;
const factorizeEitherFromNullable1 = (x)=>assertIsNull(x) || assertIsUndefined(x) || !x && assertIsObject(x) ? Either2.Left(x) : Either2.Right(x)
;
export { factorizeEitherFromNullable1 as factorizeEitherFromNullable };
const factorizeEitherRight1 = (x)=>Either2.Right(x)
;
export { factorizeEitherRight1 as factorizeEitherRight };
const factorizeEitherLeft1 = (x)=>Either2.Left(x)
;
export { factorizeEitherLeft1 as factorizeEitherLeft };
Either2.fromNullable = factorizeEitherFromNullable1;
Either2.left = factorizeEitherLeft1;
Either2.right = factorizeEitherRight1;
export { Either2 as default };
const Either1 = Either2;
export { Either2 as Either };
const IO1 = factorizeType1("IO", [
    "asyncFunction"
]);
IO1.prototype.ap = IO1.prototype["fantasy-land/ap"] = function(C2) {
    return C2.map((f)=>f(this.asyncFunction())
    );
};
IO1.prototype.chain = IO1.prototype["fantasy-land/chain"] = function(f) {
    return IO1((_)=>f(this.asyncFunction())
    ).run();
};
IO1.prototype.map = IO1.prototype["fantasy-land/map"] = function(f) {
    return IO1((_)=>f(this.asyncFunction())
    );
};
IO1.prototype.run = function() {
    return this.asyncFunction();
};
IO1.of = IO1.prototype.of = IO1.prototype["fantasy-land/of"] = (x)=>IO1((_)=>x
    )
;
export { IO1 as default };
export { IO1 as IO };
const factorizeIO1 = (f)=>IO1(f)
;
export { factorizeIO1 as factorizeIO };
const Maybe1 = factorizeSumType1("Maybe", {
    Nothing: [],
    Just: [
        $$value1
    ]
});
Maybe1.prototype.alt = Maybe1.prototype["fantasy-land/alt"] = function(A) {
    return this.fold({
        Nothing: (_)=>A
        ,
        Just: (_)=>this
    });
};
Maybe1.prototype.ap = Maybe1.prototype["fantasy-land/ap"] = function(A) {
    if (Maybe1.Nothing.is(this)) return this;
    return Maybe1.Just.is(A) ? Maybe1.of(A[$$value3](this[$$value3])) : A;
};
Maybe1.prototype.chain = Maybe1.prototype["fantasy-land/chain"] = function(f) {
    return this.fold({
        Nothing: (_)=>Maybe1.Nothing
        ,
        Just: (value)=>f(value)
    });
};
Maybe1.prototype.extend = Maybe1.prototype["fantasy-land/extend"] = function(f) {
    return this.fold({
        Nothing: (_)=>Maybe1.Nothing
        ,
        Just: (_)=>Maybe1.of(f(this))
    });
};
Maybe1.prototype.extract = Maybe1.prototype["fantasy-land/extract"] = function() {
    return this.fold({
        Nothing: (_)=>Maybe1.Nothing
        ,
        Just: (value)=>value
    });
};
Maybe1.prototype.map = Maybe1.prototype["fantasy-land/map"] = function(f) {
    return this.fold({
        Nothing: (_)=>this
        ,
        Just: (value)=>Maybe1.of(f(value))
    });
};
Maybe1.of = Maybe1.prototype.of = Maybe1.prototype["fantasy-land/of"] = (x)=>Maybe1.Just(x)
;
Maybe1.zero = Maybe1.prototype.zero = Maybe1.prototype["fantasy-land/zero"] = ()=>Maybe1.Nothing
;
const factorizeMaybeFromNullable1 = (x)=>assertIsNull(x) || assertIsUndefined(x) || !x && assertIsObject(x) ? Maybe1.Nothing : Maybe1.Just(x)
;
export { factorizeMaybeFromNullable1 as factorizeMaybeFromNullable };
const factorizeMaybeJust1 = (x)=>Maybe1.Just(x)
;
export { factorizeMaybeJust1 as factorizeMaybeJust };
const factorizeMaybeNothing1 = ()=>Maybe1.Nothing
;
export { factorizeMaybeNothing1 as factorizeMaybeNothing };
Maybe1.fromNullable = factorizeMaybeFromNullable1;
Maybe1.just = factorizeMaybeJust1;
Maybe1.nothing = factorizeMaybeNothing1;
export { Maybe1 as default };
export { Maybe1 as Maybe };
const Pair2 = factorizeType1("Pair", [
    "first",
    "second"
]);
Pair2.prototype.bimap = Pair2.prototype["fantasy-land/bimap"] = function(unaryFunctionA, unaryFunctionB) {
    return Pair2(unaryFunctionA(this.first), unaryFunctionB(this.second));
};
Pair2.prototype.map = Pair2.prototype["fantasy-land/map"] = function(unaryFunction) {
    return Pair2(unaryFunction(this.first), this.second);
};
export { Pair2 as default };
const Pair1 = Pair2;
export { Pair2 as Pair };
const factorizePair1 = curryN1(2, Pair2);
export { factorizePair1 as factorizePair };
const Step = factorizeSumType1("Step", {
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
const Done1 = Done;
const Loop = Step.Loop;
const Loop1 = Loop;
const defineDebug = curry21((x, t)=>Object.defineProperty(t, $$debug1, {
        writable: false,
        value: x
    })
);
const Task1 = factorizeType1("Task", [
    "asyncFunction"
]);
const then1 = then;
const serializeFunctionForDebug = (f)=>f.name && f.name !== "" ? f.name : f.toString().length > 25 ? f.toString().slice(0, 25).replace(/[\n\r]/g, "").replace(/\s\s*/g, " ") + "[...]" : f.toString().replace(/[\n\r]/g, "").replace(/\s\s*/g, " ")
;
Task1.prototype.ap = Task1.prototype["fantasy-land/ap"] = function(A) {
    return defineDebug(`${this[$$debug2]}.ap(${serializeFunctionForDebug(A)})`)(Task1((_)=>composeBinary2(then1(([x, y])=>applyBinary2((A1)=>(B4)=>B4.ap(A1)
            )(Reflect.getPrototypeOf(x).ap ? x : Either1.Right(x))(Reflect.getPrototypeOf(y).ap ? y : Either1.Right(y))
        ))(($p)=>($q)=>Promise.all([
                    $q instanceof Promise ? $q : Promise.resolve($q),
                    $p instanceof Promise ? $p : Promise.resolve($p)
                ])
        )(this.asyncFunction())(A.asyncFunction())
    ));
};
const chain1 = chain;
Task1.prototype.chain = Task1.prototype["fantasy-land/chain"] = function(f) {
    return defineDebug(`${this[$$debug2]}.chain(${serializeFunctionForDebug(f)})`)(Task1((_)=>compose22(then1(compose22(chain1(compose32(then1((A)=>Either1.is(A) ? A : Either1.Right(A)
        )((A)=>Either1.is(A) ? A : Either1.Left(A)
        ))(($q)=>$q instanceof Promise ? $q : Promise.resolve($q)
        )((x)=>f(x).run()
        )))((A)=>Either1.is(A) ? A : Either1.Right(A)
        )))(($p)=>$p instanceof Promise ? $p : Promise.resolve($p)
        )(this.asyncFunction())
    ));
};
const chainLift1 = chainLift;
const concat1 = concat;
Task1.prototype.chainRec = Task1.prototype["fantasy-land/chainRec"] = function(ternaryFunction, i) {
    let A = this;
    let r = Loop1(Pair1(i, null));
    while(!Done1.is(r)){
        r = ternaryFunction(Loop1, Done1, r.value.first);
        if (Loop1.is(r)) {
            A = chainLift1(flip2(concat1), A, r.value.second);
        }
    }
    return A;
};
Task1.prototype.map = Task1.prototype["fantasy-land/map"] = Task1.prototype.then = function(f) {
    return defineDebug(`${this[$$debug2]}.map(${serializeFunctionForDebug(f)})`)(Task1((_)=>apply2(then1(chain1(compose22((A)=>Either1.is(A) ? A : Either1.Right(A)
        )(f)))(Either1.Left))(this.asyncFunction())
    ));
};
Task1.prototype.catch = function(f) {
    return defineDebug(`${this[$$debug2]}.map(${serializeFunctionForDebug(f)})`)(Task1((_)=>apply2(then1((A)=>Either1.Left.is(A) ? Either1.Right(f(A[$$value2])) : A
        )(Either1.Left))(this.asyncFunction())
    ));
};
Task1.prototype.run = async function() {
    return compose22(then1((A)=>Either1.is(A) ? A : Either1.Right(A)
    )((A)=>Either1.is(A) ? A : Either1.Left(A)
    ))(($p)=>$p instanceof Promise ? $p : Promise.resolve($p)
    )(this.asyncFunction());
};
Task1.of = Task1.prototype.of = Task1.prototype["fantasy-land/of"] = (x)=>defineDebug(`Task(${x.toString()})`)(Task1((_)=>Promise.resolve(Either1.Right(x))
    ))
;
Task1.prototype.toString = Task1.prototype[$$inspect3] = function() {
    return this[$$debug2] || `Task("unknown")`;
};
Task1.wrap = (f)=>{
    let $p;
    const proxyFunction = (...xs)=>{
        $p = $p || f.call(null, ...xs);
        return $p.then((A)=>Either1.is(A) ? A : Either1.Right(A)
        , (A)=>Either1.is(A) ? A : Either1.Left(A)
        );
    };
    return defineDebug(`Task(${serializeFunctionForDebug(f)})`)(Task1(Object.defineProperty(proxyFunction, 'length', {
        value: f.length
    })));
};
export { Task1 as default };
export { Task1 as Task };
const factorizeTask1 = (x)=>Task1.of(x)
;
export { factorizeTask1 as factorizeTask };
const $$decoder = new TextDecoder();
const $$encoder = new TextEncoder();
const decodeRaw1 = $$decoder.decode.bind($$decoder);
export { decodeRaw1 as decodeRaw };
const encodeText1 = $$encoder.encode.bind($$encoder);
export { encodeText1 as encodeText };
const evert1 = curry21((T2, xs)=>xs.reduce((ys, x)=>lift21(append1)(x, ys)
    , T2.of([]))
);
export { evert1 as evert };
const insideOut1 = evert1;
export { insideOut1 as insideOut };
const fold1 = curry21((o2, A)=>A.fold(o2)
);
export { fold1 as fold };
const log1 = (message)=>(x)=>console.debug(message, x) || x
;
export { log1 as log };
const runSequentially1 = (x, ...ys)=>reduce((xs, y)=>xs.chain((_)=>y
        )
    , x, ys)
;
export { runSequentially1 as runSequentially };
const safeExtract1 = curry21((message, A)=>fold1({
        Left: (error)=>{
            throw new Error(`${message} Error: ${error.hasOwnProperty('raw') ? decodeRaw1(error.raw) : `${error.message}\n${error.stack}`}`);
        },
        Right: (x)=>x
    }, A)
);
export { safeExtract1 as safeExtract };
const stream1 = curry31(async (binaryFunction, accumulator, iterator)=>{
    for await (const data of iterator){
        accumulator = binaryFunction(accumulator, data);
    }
    return accumulator;
});
export { stream1 as stream };
const { alt: alt1 , ap: ap2 , bimap: bimap1 , chain: chain2 , extend: extend1 , extract: extract1 , map: map1 , toString: toString1  } = mod;
export { alt1 as alt, bimap1 as bimap, chain2 as chain, extend1 as extend, extract1 as extract, map1 as map, toString1 as toString };

