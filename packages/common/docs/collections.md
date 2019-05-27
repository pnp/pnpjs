# @pnp/common/collections

The collections module provides typings and classes related to working with dictionaries.

## TypedHash<T>

Interface used to described an object with string keys corresponding to values of type T

```TypeScript
export interface TypedHash<T> {
    [key: string]: T;
}
```

## objectToMap

Converts a plain object to a Map instance

```TypeScript
const map = objectToMap({ a: "b", c: "d"});
```

## mergeMaps

Merges two or more maps, overwriting values with the same key. Last value in wins.

```TypeScript
const m1 = new Map();
const m2 = new Map();
const m3 = new Map();
const m4 = new Map();

const m = mergeMaps(m1, m2, m3, m4);
```
