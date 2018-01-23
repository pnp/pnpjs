# @pnp/common/collections

The collections module provides typings and classes related to working with dictionaries.

## TypedHash<T>

Interface used to described an object with string keys corresponding to values of type T

```TypeScript
export interface TypedHash<T> {
    [key: string]: T;
}
```

## Dictionary<T>

A dictionary using string keys and containing values of type T. It works by maintaining two parallel arrays of keys and values.

```TypeScript
const d = new Dictionary<number>();

// add an item to the dictionary
d.add("one", 1);
d.add("two", 2);

// remove an item from the dictionary
d.remove("two");

// get the array of keys within the dictionary
const keys = d.getKeys();

// get the array of values within the dictionary
const values = d.getValues();

// get the item count contained in the dictionary
const count = d.count;

// clear the collection
d.clear();


// merge a second dictionary into an existing one, adding the second's keys and values to the first
// this will overwrite keys/values in the target with keys/values from the first
const d2 = new Dictionary<number>();
d2.add("three", 3);
d3.add("four", 4);
d.merge(d2);

// you can also merge a plain object that satisfies TypedHash<T>
d.merge({
    "five": 5,
    "six": 6
});
```
