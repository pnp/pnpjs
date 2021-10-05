// TODO: MODULE STATUS: done, pending testing

// BUG: batched pollutes this._root adding batching onto the original not returning a new instance. To debug, run debug tests with a breakpoint in test/main.ts line 290/291 with it.only on line 21 of test/sp/batch.ts. After the test runs the _sp object that was used to create the batched instance now has batching on it.