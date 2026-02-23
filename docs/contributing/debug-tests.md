# Writing Tests

With version 2 we have made a significant effort to improve out test coverage. To keep that up, all changes submitted will require one or more tests be included. For new functionality at least a basic test that the method executes is required. For bug fixes please include a test that would have caught the bug (i.e. fail before your fix) and passes with your fix in place.

## How to write Tests

We use [Mocha](https://mochajs.org/) and [Chai](https://www.chaijs.com/) for our testing framework. You can see many examples of writing tests within the ./test folder. Here is a sample with extra comments to help explain what's happening, taken from [./test/sp/items.ts](https://github.com/pnp/pnpjs/blob/main/test/sp/items.ts):

```TypeScript
import { getRandomString } from "@pnp/core";
import { testSettings } from "../main";
import { expect } from "chai";
import { sp } from "@pnp/sp";
import "@pnp/sp/lists/web";
import "@pnp/sp/items/list";
import { IList } from "@pnp/sp/lists";

describe("Items", () => {

    // any tests that make a web request should be withing a block checking if web tests are enabled
    if (testSettings.enableWebTests) {

        // a block scoped var we will use across our tests
        let list: IList = null;

        // we use the before block to setup
        // executed before all the tests in this block, see the mocha docs for more details
        // mocha prefers using function vs arrow functions and this is recommended
        before(async function () {

            // execute a request to ensure we have a list
            const ler = await sp.web.lists.ensure("ItemTestList", "Used to test item operations");
            list = ler.list;

            // in this case we want to have some items in the list for testing so we add those
            // only if the list was just created
            if (ler.created) {

                // add a few items to get started
                const batch = sp.web.createBatch();
                list.items.inBatch(batch).add({ Title: `Item ${getRandomString(4)}` });
                list.items.inBatch(batch).add({ Title: `Item ${getRandomString(4)}` });
                list.items.inBatch(batch).add({ Title: `Item ${getRandomString(4)}` });
                list.items.inBatch(batch).add({ Title: `Item ${getRandomString(4)}` });
                list.items.inBatch(batch).add({ Title: `Item ${getRandomString(4)}` });
                await batch.execute();
            }
        });

        // this test has a label "get items" and is run via an async function
        it("get items", async function () {

            // make a request for the list's items
            const items = await list.items();

            // report that we expect that result to be an array with more than 0 items
            expect(items.length).to.be.gt(0);
        });

        // ... remainder of code removed
    }
}
```

## General Guidelines for Writing Tests

- Tests should operate within the site defined in testSettings
- Tests should be able to run multiple times on the same site, but do not need to cleanup after themselves
- Each test should be self contained and not depend on other tests, they can depend on work done in before or beforeAll
- When writing tests you can use "only" and "skip" from mochajs to focus on only the tests you are writing
- Be sure to review the [various options](./npm-scripts.md#test) when running your tests
- If you are writing a test and the endpoint doesn't support app only permissions, you can skip writing a test - but please note that in the PR description

## Next Steps

Now that you've written tests to cover your changes you'll need to [update the docs](./documentation.md).
