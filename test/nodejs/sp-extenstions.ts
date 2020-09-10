import { expect } from "chai";
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/folders/web";
import "@pnp/sp/folders/list";
import "@pnp/sp/files/web";
import "@pnp/sp/files/folder";
import "@pnp/sp/lists/web";
import { testSettings } from "../main";
import { getRandomString } from "@pnp/common";

describe("nodejs - sp-extensions", () => {

    if (testSettings.enableWebTests) {

        it("Should allow reading of a stream", async function () {

            const content = "Some test text content.";
            const name = `Testing setContent - ${getRandomString(4)}.txt`;
            const files = sp.web.defaultDocumentLibrary.rootFolder.files;
            await files.add(name, content);

            const stream = await files.getByName(name).getStream();

            // tslint:disable-next-line: no-unused-expression
            expect(stream).to.not.be.null;

            expect(stream.knownLength).to.be.greaterThan(0);

            // tslint:disable-next-line: no-unused-expression
            expect(stream.body).to.not.be.null;

            const txt = await new Promise<string>((resolve) => {
                let data = "";
                stream.body.on("data", (chunk) => data += chunk);
                stream.body.on("end", () => resolve(data));
            });

            expect(txt).to.eq(content);
        });
    }
});
