# PnPjs Test Recording

The testing recording is available to provide a way to record and rerun tests to save network traffic and speed up integration testing of changes, especially to core library components.

## Activate test recording

In testing you can use:

 `--record` flag to enable recording in read mode, which will use any recorded test data it finds

 Using `--record write` will start the recorder in write mode, meaning it will execute requests and record the results.

 ## What is recorded

 The recording records both input parameters and network responses into files stored (by default) in a `.recordings` folder. All of the properties are stored in a single file `test-props.json` in the form:

 {
    "{test id guid}":{ 
        "name":"PnPJSTest_dTHOvBPwVN",
        "id":"cf328183-0e3c-4c69-b181-fa462a958db7"
    },
    "{test2 id guid}":{ 
        "prop1":"PnPJSTest_dTHOvBPwVN",
        "prop2":"some other value"
    }
    // ...
 }

 This allows the tests to be consistent in checking responses against input values and behave the same across runs.

 The response data is recorded in files with computed names, but starting with the test id. Some tests execute many requests and all are recorded. We record the response, request body, and request init separately as this works better with the per-request Queryable model.

 ## Adding recording to a test function

Each test is defined by a single function, which in Mocha looks like the below. Note that on each run different random values will be used. We also have no way to identify this test against all the other tests.

```TS
it("attachmentFiles", async function () {

    // add some attachments to an item
    const r = await list.items.add({
        Title: `Test_${getRandomString(4)}`,
    });

    await r.attachmentFiles.add(`att_${getRandomString(4)}.txt`, "Some Content");
    await r.attachmentFiles.add(`att_${getRandomString(4)}.txt`, "Some Content");

    return expect(list.items.getById(r.Id).attachmentFiles()).to.eventually.be.fulfilled.and.to.be.an("Array").and.have.length(2);
});
```

To transform the test function into a PnP Test function we need to take two main steps, wrap the test function and handle the props. We wrap the test in the pnpTest wrapper function, and supply an id. This id is a new guid that must be unique within the scope of our tests. Don't worry - we throw an error if guids are reused.

The second thing is to handle the props. To do this we augment `this` for the test with a `.props` method that takes any plain object and returns it based on some simple logic:

|Recording Mode|Behavior|
|---|---|
|Off|Pass-through the supplied values|
|Read|Attempt to read values from the `test-props.json` data and returns the values found, or failing to find any returns the properties supplied|
|Write|Write the supplied values to `test-props.json` and return the values.|

> Note: If you change the number or type of the properties within the test function, those recorded results will need to be updated or the test will break as the old values will be returned. There is no logic to handle cases where we stored 3 values but the test now needs 4.


```TS
import { pnpTest } from "../pnp-test.js";

it("attachmentFiles", pnpTest("9bc6dba6-6690-4453-8d13-4f42e051a245", async function () {

    const props = await this.props({
        itemTitle: `Test_${getRandomString(4)}`,
        attachmentFile1Name: `att_${getRandomString(4)}.txt`,
        attachmentFile2Name: `att_${getRandomString(4)}.txt`,
    });

    // add some attachments to an item
    const r = await list.items.add({
        Title: props.itemTitle,
    });

    await r.attachmentFiles.add(props.attachmentFile1Name, "Some Content");
    await r.attachmentFiles.add(props.attachmentFile2Name, "Some Content");

    return expect(list.items.getById(r.Id).attachmentFiles()).to.eventually.be.fulfilled.and.to.be.an("Array").and.have.length(2);
}));
```

You can use this PowerShell snippet to generate code to paste into the front of each function:

```PowerShell
"pnpTest(""$(([guid]::NewGuid() | select Guid -expandproperty Guid | Out-String).Trim())"", " | Set-Clipboard
```

## How it works

The [test recording](./test-recording.ts) replaces the default `.send` behavior with one that performs a series of steps:

1. Generate file names for body and init
2. Look-up if files exist, and if so construct and return a new Response object based on the data
3. If no files exist and operating in read mode, make the request and return the Response 
4. If no files exist and operating in write mode, make the request and write the response data to the fs


