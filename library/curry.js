const _arity = (n, fn) => {
  if (n >= 0 && n <= 10) return Object.defineProperty(
    (...xs) => fn.apply(null, xs),
    "length",
    { enumerable: true, value: n }
  );
  else throw new Error('First argument to _arity must be a non-negative integer no greater than ten');
};

const _curry1 = (f) => {
  return function f1(_) {
    return arguments.length === 0 ? f1 : f.apply(this, arguments);
  };
};

const _curry2 = (f) => {
  return function f2(x, y) {
    switch (arguments.length) {
      case 0:
        return f2;
      case 1:
        return _curry1(function(z) { return f(x, z); });
      default:
        return f(x, y);
    }
  };
};

const _curryN = (n, xs, f) =>
  (...zs) => {
    const ys = [];
    let i = 0;
    let l = n;
    let xi = 0;

    while (xi < xs.length || i < zs.length) {
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

export const curryN = _curry2((n, f) => n === 1 ? _curry1(f) : _arity(n, _curryN(n, [], f)));
export const curry2 = curryN(2);
export const curry3 = curryN(3);