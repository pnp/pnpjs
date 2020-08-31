import { expect } from "chai";
import { testSettings } from "../main";
import "@pnp/sp/folders";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/sharing";
import "@pnp/sp/site-users/web";
import "@pnp/sp/files";
import { getRandomString, combine } from "@pnp/common";
import { sp } from "@pnp/sp";
import { IFiles, TemplateFileType, MoveOperations } from "@pnp/sp/files";
import { readFileSync } from "fs";
import { resolve } from "path";

describe("files", () => {

    if (testSettings.enableWebTests) {

        const testFileName = `testing - ${getRandomString(4)}.txt`;
        const testFileNamePercentPound = `testing %# - ${getRandomString(4)}.txt`;
        let testFileNamePercentPoundServerRelPath = "";
        let files: IFiles = null;

        before(async function () {

            files = sp.web.defaultDocumentLibrary.rootFolder.files;
            // ensure we have at least one file to get
            await files.add(testFileName, "Test file!", true);
            const res = await files.addUsingPath(testFileNamePercentPound, "Test file!", { Overwrite: true });
            testFileNamePercentPoundServerRelPath = res.data.ServerRelativeUrl;
        });

        it("getByName", async function () {

            return expect(files.getByName(testFileName)()).to.eventually.be.fulfilled;
        });

        it("getByName (percent pound)", async function () {

            return expect(sp.web.getFileByServerRelativePath(testFileNamePercentPoundServerRelPath)()).to.eventually.be.fulfilled;
        });

        it("getByUrl", async function () {

            const item = await sp.web.getFileByServerRelativePath(testFileNamePercentPoundServerRelPath).getItem();
            const urlData = await item.select("EncodedAbsUrl")();
            return expect(sp.web.getFileByUrl(urlData.EncodedAbsUrl)()).to.eventually.be.fulfilled;
        });

        it("add", async function () {

            const name = `Testing Add - ${getRandomString(4)}.txt`;
            await files.add(name, "Some test text content.");
            const file = await files.getByName(name)();
            expect(file.Name).to.eq(name);
        });

        it("add (overwrite)", async function () {

            const name = `Testing Add - ${getRandomString(4)}.txt`;
            await files.add(name, "Some test text content.");
            await files.add(name, "Different Content.", true);
            const file = await files.getByName(name).getText();
            expect(file).to.eq("Different Content.");
        });

        it("add (' char)", async function () {

            const name = `Testing Add ' ${getRandomString(4)}.txt`;
            await files.add(name, "Some test text content.");
            const file = await files.getByName(name)();
            expect(file.Name).to.eq(name);
        });

        it("add (result invokable)", async function () {

            const name = `Testing Add ' ${getRandomString(4)}.txt`;
            const file = await files.add(name, "Some test text content.");
            return expect(file.file.getText()).to.eventually.be.fulfilled;
        });

        it("addUsingPath", async function () {

            const name = `Testing Add %# - ${getRandomString(4)}.txt`;
            const res = await files.addUsingPath(name, "Some test text content.");
            const file = await sp.web.getFileByServerRelativePath(res.data.ServerRelativeUrl)();
            expect(file.Name).to.eq(name);
        });

        it("addUsingPath (silly chars)", async function () {

            const name = `Testing Add & = + - ${getRandomString(4)}.txt`;
            const res = await files.addUsingPath(name, "Some test text content.");
            const file = await sp.web.getFileByServerRelativePath(res.data.ServerRelativeUrl)();
            expect(file.Name).to.eq(name);
        });

        it("addUsingPath (overwrite)", async function () {

            const name = `Testing Add %# - ${getRandomString(4)}.txt`;
            await files.addUsingPath(name, "Some test text content.");
            const res = await files.addUsingPath(name, "Different Content.", { Overwrite: true });
            const file = await sp.web.getFileByServerRelativePath(res.data.ServerRelativeUrl).getText();
            expect(file).to.eq("Different Content.");
        });

        it("addUsingPath  (result invokable)", async function () {

            const name = `Testing Add %# - ${getRandomString(4)}.txt`;
            const file = await files.addUsingPath(name, "Some test text content.");
            return expect(file.file.getText()).to.eventually.be.fulfilled;
        });

        it.skip("addChunked", async function () {

            const name = `Testing Chunked - ${getRandomString(4)}.jpg`;
            const content = readFileSync(resolve(__dirname, "./assets/sample_file.jpg"));
            const far = await files.addChunked(name, <any>content, null, true, 1000000);
            // tslint:disable-next-line:no-unused-expression
            expect(far).to.not.be.null;
            return expect(far.file()).to.eventually.be.fulfilled;
        });

        it("addTemplateFile", async function () {

            const webData = await sp.web.select("ServerRelativeUrl")();
            const path = combine("/", webData.ServerRelativeUrl, `/SitePages/Testing template file - ${getRandomString(4)}.aspx`);
            const far = await files.addTemplateFile(path, TemplateFileType.StandardPage);
            return expect(far.file()).to.eventually.be.fulfilled;
        });

        it("getFileById", async function () {

            const name = `Testing getFileById - ${getRandomString(4)}.txt`;
            const far = await files.add(name, "Some test text content.");
            const fileById = await sp.web.getFileById(far.data.UniqueId).select("UniqueId")();
            return expect(far.data.UniqueId).to.eq(fileById.UniqueId);
        });

        it("filter works for silly chars (issue # 1208)", async function () {

            const name = `Testing Silly Chars & = + - ${getRandomString(4)}.txt`;
            await files.addUsingPath(name, "Some test text content.");
            const fileList = await files.filter(`Name eq '${name}'`)();
            return expect(fileList).to.be.an.instanceOf(Array).and.to.have.lengthOf(1);
        });
    }
});

describe("file", () => {


    if (testSettings.enableWebTests) {

        const testFileName = `testing - ${getRandomString(4)}.txt`;
        let files: IFiles = null;

        before(async function () {
            files = sp.web.defaultDocumentLibrary.rootFolder.files;
            await files.add(testFileName, "Test file!", true);
        });

        it("delete", async function () {

            const name = `Testing Delete - ${getRandomString(4)}.txt`;
            await files.add(name, "Some test text content.");
            let r = await files.filter(`Name eq '${name}'`)();
            expect(r.length).to.eq(1);
            await files.getByName(name).delete();
            r = await files.filter(`Name eq '${name}'`)();
            expect(r.length).to.eq(0);
        });

        it("delete file with params", async function () {
            const name = `Testing Delete - ${getRandomString(4)}.txt`;
            await files.add(name, "Some test text content.");
            let r = await files.filter(`Name eq '${name}'`)();
            expect(r.length).to.eq(1);

            await files.getByName(name).deleteWithParams({
                BypassSharedLock: true,
            });

            r = await files.filter(`Name eq '${name}'`)();
            expect(r.length).to.eq(0);
        });

        it("listItemAllFields", function () {

            return expect(files.getByName(testFileName).listItemAllFields()).to.be.fulfilled;
        });

        it("versions", function () {

            return expect(files.getByName(testFileName).versions()).to.be.fulfilled;
        });

        it("check in/out", async function () {

            const name = `Testing check in out - ${getRandomString(4)}.txt`;
            await files.add(name, "Some test text content.");
            // tslint:disable-next-line:no-unused-expression
            expect(files.getByName(name).checkout()).to.eventually.be.fulfilled;
            return expect(files.getByName(name).checkin()).to.eventually.be.fulfilled;
        });

        it("copyTo", async function () {

            const rand = getRandomString(4);
            const name = `Testing copyTo - ${rand}.txt`;
            await files.add(name, getRandomString(42));
            const folderData = await sp.web.defaultDocumentLibrary.rootFolder.select("ServerRelativeUrl")();
            const name2 = `I Copied - ${rand}.aspx`;
            const path = combine("/", folderData.ServerRelativeUrl, name2);

            await files.getByName(name).copyTo(path, true);

            // tslint:disable-next-line:no-unused-expression
            return expect(files.getByName(name2)()).to.eventually.be.fulfilled;
        });

        it("moveTo", async function () {

            const rand = getRandomString(4);
            const name = `Testing copyTo - ${rand}.txt`;
            await files.add(name, getRandomString(42));
            const folderData = await sp.web.defaultDocumentLibrary.rootFolder.select("ServerRelativeUrl")();
            const name2 = `I Moved - ${rand}.aspx`;
            const path = combine("/", folderData.ServerRelativeUrl, name2);

            await files.getByName(name).moveTo(path, MoveOperations.Overwrite);

            // tslint:disable-next-line:no-unused-expression
            return expect(files.getByName(name2)()).to.eventually.be.fulfilled;
        });

        it("copyByPath", async function () {

            const rand = getRandomString(4);
            const name = `Testing copyByPath - ${rand}.txt`;
            await files.add(name, getRandomString(42));
            const folderData = await sp.web.defaultDocumentLibrary.rootFolder.select("ServerRelativeUrl")();
            const name2 = `I Copied - ${rand}.aspx`;
            const path = combine("/", folderData.ServerRelativeUrl, name2);

            await files.getByName(name).copyByPath(path, true);

            // tslint:disable-next-line:no-unused-expression
            return expect(files.getByName(name2)()).to.eventually.be.fulfilled;
        });

        it("moveByPath", async function () {

            const rand = getRandomString(4);
            const name = `Testing moveByPath - ${rand}.txt`;
            await files.add(name, getRandomString(42));
            const folderData = await sp.web.defaultDocumentLibrary.rootFolder.select("ServerRelativeUrl")();
            const name2 = `I Copied - ${rand}.aspx`;
            const path = combine("/", folderData.ServerRelativeUrl, name2);

            await files.getByName(name).moveByPath(path, true);

            // tslint:disable-next-line:no-unused-expression
            return expect(files.getByName(name2)()).to.eventually.be.fulfilled;
        });

        it("recycle", async function () {

            const name = `Testing Recycle - ${getRandomString(4)}.txt`;
            await files.add(name, "Some test text content.");
            let r = await files.filter(`Name eq '${name}'`)();
            expect(r.length).to.eq(1);
            await files.getByName(name).recycle();
            r = await files.filter(`Name eq '${name}'`)();
            expect(r.length).to.eq(0);
        });

        it("exists - true", async function () {

            const name = `Testing Exists - ${getRandomString(4)}.txt`;
            await files.add(name, "Some test text content.");
            const exists = await files.getByName(name).exists();
            // tslint:disable-next-line: no-unused-expression
            expect(exists).to.be.true;
        });

        it("exists - false", async function () {

            const exists = await files.getByName(`Testing Exists - ${getRandomString(4)}.txt`).exists();
            // tslint:disable-next-line: no-unused-expression
            expect(exists).to.be.false;
        });

        it("setContent", async function () {

            const name = `Testing setContent - ${getRandomString(4)}.txt`;
            await files.add(name, "Some test text content.");
            await files.getByName(name).setContent("different.");
            const file = await files.getByName(name).getText();
            expect(file).to.eq("different.");
        });

        it("getItem", async function () {

            const name = `Testing setContent - ${getRandomString(4)}.txt`;
            await files.add(name, "Some test text content.");
            const item = await files.getByName(name).getItem();
            return expect(item()).to.eventually.be.fulfilled;
        });
    }
});
