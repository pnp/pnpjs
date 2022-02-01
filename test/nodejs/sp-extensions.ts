import { expect } from "chai";
import "@pnp/sp/webs";
import "@pnp/sp/folders/web";
import "@pnp/sp/folders/list";
import "@pnp/sp/files/web";
import "@pnp/sp/files/folder";
import "@pnp/sp/lists/web";
import { getRandomString, isFunc } from "@pnp/core";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";


describe("NodeJS: sp-extensions", function () {

    before(function () {

        if (!this.pnp.settings.enableWebTests) {
            this.skip();
        }
    });

    it("Read Stream", async function () {

        const content = "Some test text content.";
        const name = `Testing setContent - ${getRandomString(4)}.txt`;
        const files = this.pnp.sp.web.defaultDocumentLibrary.rootFolder.files;
        await files.addUsingPath(name, content);

        const stream = await files.getByUrl(name).getStream();

        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        expect(stream).to.not.be.null;

        expect(stream.knownLength).to.be.greaterThan(0);

        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        expect(stream.body).to.not.be.null;

        const txt = await new Promise<string>((resolve) => {
            let data = "";
            stream.body.on("data", (chunk) => data += chunk);
            stream.body.on("end", () => resolve(data));
        });

        expect(txt).to.eq(content);
    });

    it("Adding Chunks via Stream", async function () {

        const name = `Testing addChunked (with Nodejs stream) - ${getRandomString(4)}.txt`;
        const content = "Some test text content.";

        const tmpFilePath = path.join(os.tmpdir(), name);
        fs.writeFileSync(tmpFilePath, content);

        const stream = fs.createReadStream(tmpFilePath);
        const files = this.pnp.sp.web.defaultDocumentLibrary.rootFolder.files;

        await files.addChunked(name, stream, null, true);

        const fileContent = await files.getByUrl(name).getText();

        expect(fileContent.length).be.equal(content.length);

        if (isFunc((<any>fs).rmSync)) {
            (<any>fs).rmSync(tmpFilePath);
        } else {
            fs.unlinkSync(tmpFilePath);
        }
    });

    it("Adding Chunks Non-Stream", async function () {

        const name = `Testing addChunked (with Nodejs buffer) - ${getRandomString(4)}.txt`;
        const content = "Some test text content.";

        const files = this.pnp.sp.web.defaultDocumentLibrary.rootFolder.files;

        await files.addChunked(name, content as any, null, true, 10);

        const fileContent = await files.getByUrl(name).getText();

        expect(fileContent.length).be.equal(content.length);
    });
});
