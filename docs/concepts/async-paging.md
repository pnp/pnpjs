# Async Paging

With the introduction of the async iterator pattern to both sp/items and all graph collections we wanted to share a discussion for working with async paging.

The easiest example is to process all of the items in a loop. In this example each page of 1000 results is retrieved from the list. The `items` collection itself is AsyncIterable so you can use it directly in the loop.

```TypeScript
for await (const items of sp.web.lists.getByTitle("BigList").items.top(1000)) {
  console.log(items.length);
}
```

And a graph example:

```TypeScript
for await (const items of graph.users) {
  console.log(items.length);
}
```

## Accessing the Iterator

You might in some cases want to access the iterator object directly from the collection, which you can do using `Symbol.asyncIterator` method:

```TypeScript
const iterator = collection[Symbol.asyncIterator]();
```

## Paging Helper

We are also providing an example paging class to control prev/next paging through the collection using the AsyncIterator. The code here is provided as an example only.

```TypeScript
class AsyncPager<T> {

  private iterator: AsyncIterator<T>;

  constructor(iterable: AsyncIterable<T>, private pages: T[] = [], private pagePointer = -1, private isDone = false) {
    this.iterator = iterable[Symbol.asyncIterator]();
  }

  /**
   * Provides access to the current page of values
   */
  async current(): Promise<T> {

    // we don't have any pages yet
    if (this.pagePointer < 0) {
      return this.next();
    }

    // return the current page
    return this.pages[this.pagePointer];
  }

  /**
   * Access the next page, either from the local cache or make a request to load it
   */
  async next(): Promise<T> {

    // does the page exist?
    let page = this.pages[++this.pagePointer];

    if (typeof page === "undefined") {

      if (this.isDone) {

        // if we are already done make sure we don't make any more requests
        // and return the last page
        --this.pagePointer;

      } else {

        // get the next page of links
        const next = await this.iterator.next();

        if (next.done) {

          this.isDone = true;

        } else {

          this.pages.push(next.value);
        }
      }
    }

    return this.pages[this.pagePointer];
  }

  async prev(): Promise<T> {

    // handle already at the start
    if (this.pagePointer < 1) {
      return this.pages[0];
    }

    // return the previous page moving our pointer
    return this.pages[--this.pagePointer];
  }
}
```

And some usage:

```TypeScript
const pager = new AsyncPager(sp.web.lists.getByTitle("BigList").items.top(1000));

const items1 = await pager.next();
```
