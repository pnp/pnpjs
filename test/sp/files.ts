import { expect } from "chai";
import "@pnp/sp/folders";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/sharing";
import "@pnp/sp/site-users/web";
import "@pnp/sp/files";
import { getRandomString, combine } from "@pnp/core";
import { IFiles, TemplateFileType } from "@pnp/sp/files";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import findupSync from "findup-sync";

// give ourselves a single reference to the projectRoot
const projectRoot = resolve(dirname(findupSync("package.json")));

describe("Files", function () {

    const testFileName = `testing - ${getRandomString(4)}.txt`;
    const testFileNamePercentPound = `testing %# - ${getRandomString(4)}.txt`;
    let testFileNamePercentPoundServerRelPath = "";
    let files: IFiles = null;

    before(async function () {

        if (!this.pnp.settings.enableWebTests) {
            this.skip();
        }

        files = this.pnp.sp.web.defaultDocumentLibrary.rootFolder.files;
        // ensure we have at least one file to get
        await files.addUsingPath(testFileName, "Test file!", { Overwrite: true });
        const res = await files.addUsingPath(testFileNamePercentPound, "Test file!", { Overwrite: true });
        testFileNamePercentPoundServerRelPath = res.data.ServerRelativeUrl;
    });

    it("getByUrl (FileName)", async function () {

        return expect(files.getByUrl(testFileName)()).to.eventually.be.fulfilled;
    });

    it("getFileByServerRelativePath (%#)", async function () {

        return expect(this.pnp.sp.web.getFileByServerRelativePath(testFileNamePercentPoundServerRelPath)()).to.eventually.be.fulfilled;
    });

    it("getFileByUrl", async function () {

        const item = await this.pnp.sp.web.getFileByServerRelativePath(testFileNamePercentPoundServerRelPath).getItem();
        const urlData = await item.select("EncodedAbsUrl")();
        return expect(this.pnp.sp.web.getFileByUrl(urlData.EncodedAbsUrl)()).to.eventually.be.fulfilled;
    });

    it("addUsingPath", async function () {

        const name = `Testing Add - ${getRandomString(4)}.txt`;
        await files.addUsingPath(name, "Some test text content.");
        const file = await files.getByUrl(name)();
        expect(file.Name).to.eq(name);
    });

    it("addUsingPath (overwrite)", async function () {

        const name = `Testing Add - ${getRandomString(4)}.txt`;
        await files.addUsingPath(name, "Some test text content.");
        await files.addUsingPath(name, "Different Content.", { Overwrite: true });
        const file = await files.getByUrl(name).getText();
        expect(file).to.eq("Different Content.");
    });

    it("addUsingPath (' char)", async function () {

        const name = `Testing Add ' ${getRandomString(4)}.txt`;
        await files.addUsingPath(name, "Some test text content.");
        const file = await files.getByUrl(name)();
        expect(file.Name).to.eq(name);
    });

    it("addUsingPath (result invokable)", async function () {
        const name = `Testing Add - ${getRandomString(4)}.txt`;
        const file = await files.addUsingPath(name, "Some test text content.");
        return expect(file.file.getText()).to.eventually.be.fulfilled;
    });

    it("addUsingPath (silly chars)", async function () {

        const name = `Testing Add & = + - ${getRandomString(4)}.txt`;
        const res = await files.addUsingPath(name, "Some test text content.");
        const file = await this.pnp.sp.web.getFileByServerRelativePath(res.data.ServerRelativeUrl)();
        expect(file.Name).to.eq(name);
    });

    it("addChunked", async function () {

        const name = `Testing Chunked - ${getRandomString(4)}.jpg`;
        const content = readFileSync(resolve(projectRoot, "./test/sp/assets/sample_file.jpg"));
        const far = await files.addChunked(name, <any>content, null, true, 1000000);
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        expect(far).to.not.be.null;
        return expect(far.file()).to.eventually.be.fulfilled;
    });

    it("addTemplateFile", async function () {

        const webData = await this.pnp.sp.web.select("ServerRelativeUrl")();
        const path = combine("/", webData.ServerRelativeUrl, `/SitePages/Testing template file - ${getRandomString(4)}.aspx`);
        const far = await files.addTemplateFile(path, TemplateFileType.StandardPage);
        return expect(far.file()).to.eventually.be.fulfilled;
    });

    it("getFileById", async function () {

        const name = `Testing getFileById - ${getRandomString(4)}.txt`;
        const far = await files.addUsingPath(name, "Some test text content.");
        const fileById = await this.pnp.sp.web.getFileById(far.data.UniqueId).select("UniqueId")();
        return expect(far.data.UniqueId).to.eq(fileById.UniqueId);
    });

    it("filter (silly chars)", async function () {

        const name = `Testing Silly Chars & = + - ${getRandomString(4)}.txt`;
        await files.addUsingPath(name, "Some test text content.");
        const fileList = await files.filter(`Name eq '${name}'`)();
        return expect(fileList).to.be.an.instanceOf(Array).and.to.have.lengthOf(1);
    });
});

describe("File", function () {

    const testFileName = `testing - ${getRandomString(4)}.txt`;
    let files: IFiles = null;

    before(async function () {

        if (!this.pnp.settings.enableWebTests) {
            this.skip();
        }

        files = this.pnp.sp.web.defaultDocumentLibrary.rootFolder.files;
        await files.addUsingPath(testFileName, "Test file!", { Overwrite: true });
    });

    it("delete", async function () {
        const name = `Testing Delete - ${getRandomString(4)}.txt`;
        await files.addUsingPath(name, "Some test text content.");
        let r = await files.filter(`Name eq '${name}'`)();
        expect(r.length).to.eq(1);
        await files.getByUrl(name).delete();
        r = await files.filter(`Name eq '${name}'`)();
        expect(r.length).to.eq(0);
    });

    it("deleteWithParams", async function () {
        const name = `Testing Delete - ${getRandomString(4)}.txt`;
        await files.addUsingPath(name, "Some test text content.");
        let r = await files.filter(`Name eq '${name}'`)();
        expect(r.length).to.eq(1);

        await files.getByUrl(name).deleteWithParams({
            BypassSharedLock: true,
        });

        r = await files.filter(`Name eq '${name}'`)();
        expect(r.length).to.eq(0);
    });

    it("listItemAllFields", function () {

        return expect(files.getByUrl(testFileName).listItemAllFields()).to.be.fulfilled;
    });

    it("versions", function () {

        return expect(files.getByUrl(testFileName).versions()).to.be.fulfilled;
    });

    it("checkin/checkout", async function () {

        const name = `Testing check in out - ${getRandomString(4)}.txt`;
        await files.addUsingPath(name, "Some test text content.");
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        const file = files.getByUrl(name);

        await file.checkout();

        let check = await file.select("CheckOutType")<{ CheckOutType: 0 | 1 | 2 }>();

        expect(check.CheckOutType).to.eq(0);

        await file.checkin();

        check = await file.select("CheckOutType")<{ CheckOutType: 0 | 1 | 2 }>();

        expect(check.CheckOutType).to.eq(2);
    });

    it("copyTo", async function () {

        const rand = getRandomString(4);
        const name = `Testing copyTo - ${rand}.txt`;
        await files.addUsingPath(name, getRandomString(42));
        const folderData = await this.pnp.sp.web.defaultDocumentLibrary.rootFolder.select("ServerRelativeUrl")();
        const name2 = `I Copied - ${rand}.aspx`;
        const path = combine("/", folderData.ServerRelativeUrl, name2);

        await files.getByUrl(name).copyTo(path, true);

        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        return expect(files.getByUrl(name2)()).to.eventually.be.fulfilled;
    });

    it("copyByPath", async function () {

        const rand = getRandomString(4);
        const name = `Testing copyByPath - ${rand}.txt`;
        await files.addUsingPath(name, getRandomString(42));
        const folderData = await this.pnp.sp.web.defaultDocumentLibrary.rootFolder.select("ServerRelativeUrl")();
        const name2 = `I Copied - ${rand}.aspx`;
        const path = combine("/", folderData.ServerRelativeUrl, name2);

        await files.getByUrl(name).copyByPath(path, true);
        return expect(files.getByUrl(name2)()).to.eventually.be.fulfilled;
    });

    it("copyByPath - options", async function () {

        const rand = getRandomString(4);
        const name = `Testing copyByPath - ${rand}.txt`;
        await files.addUsingPath(name, getRandomString(42));
        const folderData = await this.pnp.sp.web.defaultDocumentLibrary.rootFolder.select("ServerRelativeUrl")();
        const name2 = `I Copied - ${rand}.aspx`;
        const path = combine("/", folderData.ServerRelativeUrl, name2);

        await files.getByUrl(name).copyByPath(path, true, {
            KeepBoth: true,
            ResetAuthorAndCreatedOnCopy: false,
            ShouldBypassSharedLocks: true,
        });
        return expect(files.getByUrl(name2)()).to.eventually.be.fulfilled;
    });

    it("moveByPath", async function () {

        const rand = getRandomString(4);
        const name = `Testing moveByPath - ${rand}.txt`;
        await files.addUsingPath(name, getRandomString(42));
        const folderData = await this.pnp.sp.web.defaultDocumentLibrary.rootFolder.select("ServerRelativeUrl")();
        const name2 = `I Copied - ${rand}.aspx`;
        const path = combine("/", folderData.ServerRelativeUrl, name2);

        await files.getByUrl(name).moveByPath(path, true);
        return expect(files.getByUrl(name2)()).to.eventually.be.fulfilled;
    });

    it("moveByPath - options", async function () {

        const rand = getRandomString(4);
        const name = `Testing moveByPath - ${rand}.txt`;
        await files.addUsingPath(name, getRandomString(42));
        const folderData = await this.pnp.sp.web.defaultDocumentLibrary.rootFolder.select("ServerRelativeUrl")();
        const name2 = `I Copied - ${rand}.aspx`;
        const path = combine("/", folderData.ServerRelativeUrl, name2);

        await files.getByUrl(name).moveByPath(path, true, {
            KeepBoth: true,
            RetainEditorAndModifiedOnMove: false,
            ShouldBypassSharedLocks: true,
        });
        return expect(files.getByUrl(name2)()).to.eventually.be.fulfilled;
    });

    it("moveByPath - batched", async function () {

        const rand = getRandomString(4);
        const name = `Testing moveByPath - ${rand}.txt`;
        await files.addUsingPath(name, getRandomString(42));
        const folderData = await this.pnp.sp.web.defaultDocumentLibrary.rootFolder.select("ServerRelativeUrl")();
        const name2 = `I Copied - ${rand}.aspx`;

        const sourcePath = combine("/", folderData.ServerRelativeUrl, name);
        const path = combine("/", folderData.ServerRelativeUrl, name2);

        const [batch, execute] = this.pnp.sp.web.batched();

        batch.getFileByServerRelativePath(sourcePath).moveByPath(path, true);

        await execute();

        return expect(files.getByUrl(name2)()).to.eventually.be.fulfilled;
    });

    it("recycle", async function () {

        const name = `Testing Recycle - ${getRandomString(4)}.txt`;
        await files.addUsingPath(name, "Some test text content.");
        let r = await files.filter(`Name eq '${name}'`)();
        expect(r.length).to.eq(1);
        await files.getByUrl(name).recycle();
        r = await files.filter(`Name eq '${name}'`)();
        expect(r.length).to.eq(0);
    });

    it("exists (true)", async function () {
        const name = `Testing Exists - ${getRandomString(4)}.txt`;
        await files.addUsingPath(name, "Some test text content.");
        const exists = await files.getByUrl(name).exists();
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        expect(exists).to.be.true;
    });

    it("exists (false)", async function () {
        const exists = await files.getByUrl(`Testing Exists - ${getRandomString(4)}.txt`).exists();
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        expect(exists).to.be.false;
    });

    it("setContent", async function () {
        const name = `Testing setContent - ${getRandomString(4)}.txt`;
        await files.addUsingPath(name, "Some test text content.");
        await files.getByUrl(name).setContent("different.");
        const file = await files.getByUrl(name).getText();
        expect(file).to.eq("different.");
    });

    it("getItem", async function () {
        const name = `Testing setContent - ${getRandomString(4)}.txt`;
        await files.addUsingPath(name, "Some test text content.");
        const item = await files.getByUrl(name).getItem();
        return expect(item()).to.eventually.be.fulfilled;
    });

    it("getLockedByUser", async function () {
        const name = `Testing getLockedByUser - ${getRandomString(4)}.txt`;
        await files.addUsingPath(name, "Some test text content.");
        const lockedByUser = await files.getByUrl(name).getLockedByUser();
        return expect(lockedByUser).to.be.null;
    });
});
