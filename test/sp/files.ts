import { expect } from "chai";
import "@pnp/sp/folders";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/sharing";
import "@pnp/sp/site-users/web";
import "@pnp/sp/files";
import { getRandomString, combine } from "@pnp/core";
import { IFiles, TemplateFileType, fileFromServerRelativePath } from "@pnp/sp/files";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import findupSync from "findup-sync";
import { pnpTest } from "../pnp-test.js";

// give ourselves a single reference to the projectRoot
const projectRoot = resolve(dirname(findupSync("package.json")));

describe("Files", function () {

    let testFileName = "";
    let testFileNamePercentPound = "";
    let testFileNamePercentPoundServerRelPath = "";
    let files: IFiles = null;

    before(pnpTest("948e4449-4cc4-4353-a584-b35c497acbd4", async function () {

        if (!this.pnp.settings.enableWebTests) {
            this.skip();
        }

        const { rand } = await this.props({
            rand: getRandomString(4),
        });

        testFileName = `testing - ${rand}.txt`;
        testFileNamePercentPound = `testing %# - ${rand}.txt`;

        files = this.pnp.sp.web.defaultDocumentLibrary.rootFolder.files;
        // ensure we have at least one file to get
        await files.addUsingPath(testFileName, "Test file!", { Overwrite: true });
        const res = await files.addUsingPath(testFileNamePercentPound, "Test file!", { Overwrite: true });
        testFileNamePercentPoundServerRelPath = res.ServerRelativeUrl;
    }));

    it("getByUrl (FileName)", pnpTest("d1a5f3e2-3c4b-4b6e-9f7a-2c8d9e5f6a7b", async function () {

        return expect(files.getByUrl(testFileName)()).to.eventually.be.fulfilled;
    }));

    it("getFileByServerRelativePath (%#)", async function () {

        return expect(this.pnp.sp.web.getFileByServerRelativePath(testFileNamePercentPoundServerRelPath)()).to.eventually.be.fulfilled;
    });

    it("getFileByUrl", pnpTest("e2b4c5d6-7f8a-9b0c-1d2e-3f4a5b6c7d8e", async function () {

        const item = await this.pnp.sp.web.getFileByServerRelativePath(testFileNamePercentPoundServerRelPath).getItem();
        const urlData = await item.select("EncodedAbsUrl")();
        return expect(this.pnp.sp.web.getFileByUrl(urlData.EncodedAbsUrl)()).to.eventually.be.fulfilled;
    }));

    it("addUsingPath", pnpTest("f72dcc6d-4244-403e-a80a-fdfad7aeaf12", async function () {

        const { name } = await this.props({
            name: `Testing Add - ${getRandomString(4)}.txt`,
        });

        await files.addUsingPath(name, "Some test text content.");
        const file = await files.getByUrl(name)();
        expect(file.Name).to.eq(name);
    }));

    it("addUsingPath (overwrite)", pnpTest("92560729-4219-4697-a896-3ec405423a6f", async function () {

        const { name } = await this.props({
            name: `Testing Add - ${getRandomString(4)}.txt`,
        });

        await files.addUsingPath(name, "Some test text content.");
        await files.addUsingPath(name, "Different Content.", { Overwrite: true });
        const file = await files.getByUrl(name).getText();
        expect(file).to.eq("Different Content.");
    }));

    it("addUsingPath (' char)", pnpTest("331ee929-3789-43f3-95a3-d45c82c2a744", async function () {

        const { name } = await this.props({
            name: `Testing Add - ${getRandomString(4)}.txt`,
        });

        await files.addUsingPath(name, "Some test text content.");
        const file = await files.getByUrl(name)();
        expect(file.Name).to.eq(name);
    }));

    it("addUsingPath (result invokable)", pnpTest("cee7b2be-ea39-4e1a-ab67-be750e84e79f", async function () {

        const { name } = await this.props({
            name: `Testing Add - ${getRandomString(4)}.txt`,
        });

        const file = await files.addUsingPath(name, "Some test text content.");
        return expect(files.getByUrl(file.Name).getText()).to.eventually.be.fulfilled;
    }));

    it("addUsingPath (silly chars)", pnpTest("4d50ea7e-3021-4f54-88af-29340e7f8a0c", async function () {

        const { name } = await this.props({
            name: `Testing Add & = + - ${getRandomString(4)}.txt`,
        });

        const res = await files.addUsingPath(name, "Some test text content.");
        const file = await this.pnp.sp.web.getFileByServerRelativePath(res.ServerRelativeUrl)();
        expect(file.Name).to.eq(name);
    }));

    it("addChunked", pnpTest("9f41ae88-aada-4989-a41c-8cb7f66ef67f", async function () {

        const { name } = await this.props({
            name: `Testing Chunked - ${getRandomString(4)}.jpg`,
        });

        const content = readFileSync(resolve(projectRoot, "./test/sp/assets/sample_file.jpg"));
        const far = await files.addChunked(name, <any>content, null);
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        expect(far).to.not.be.null;
        return expect(files.getByUrl(name)()).to.eventually.be.fulfilled;
    }));

    it("addTemplateFile", pnpTest("3492ead4-15d8-4ab3-b3c0-46747e6856bc", async function () {

        const webData = await this.pnp.sp.web.select("ServerRelativeUrl")();
        const { path } = await this.props({
            path: combine("/", webData.ServerRelativeUrl, `/SitePages/Testing template file - ${getRandomString(4)}.aspx`),
        });

        const far = await files.addTemplateFile(path, TemplateFileType.StandardPage);
        return expect(fileFromServerRelativePath(files, far.ServerRelativeUrl)()).to.eventually.be.fulfilled;
    }));

    it("getFileById", pnpTest("02c0497b-9cb1-41e9-a967-5c674a64b104", async function () {

        const { name } = await this.props({
            name: `Testing getFileById - ${getRandomString(4)}.txt`,
        });

        const far = await files.addUsingPath(name, "Some test text content.");
        const fileById = await this.pnp.sp.web.getFileById(far.UniqueId).select("UniqueId")();
        return expect(far.UniqueId).to.eq(fileById.UniqueId);
    }));

    it("filter (silly chars)", pnpTest("cc2782c9-1134-4f5c-89c1-f864f56a6e2d", async function () {

        const { name } = await this.props({
            name: `Testing Silly Chars & = + - ${getRandomString(4)}.txt`,
        });

        await files.addUsingPath(name, "Some test text content.");
        const fileList = await files.filter(`Name eq '${name}'`)();
        return expect(fileList).to.be.an.instanceOf(Array).and.to.have.lengthOf(1);
    }));
});

describe("File", function () {

    let testFileName = "";
    let files: IFiles = null;

    before(pnpTest("e6d3b2de-b3cf-49e5-b4f1-627fd675928c", async function () {

        if (!this.pnp.settings.enableWebTests) {
            this.skip();
        }
        const { rand } = await this.props({
            rand: getRandomString(4),
        });
        testFileName = `testing - ${rand}.txt`;

        files = this.pnp.sp.web.defaultDocumentLibrary.rootFolder.files;
        await files.addUsingPath(testFileName, "Test file!", { Overwrite: true });
    }));

    it("delete", pnpTest("f4e41c3e-fb7f-4b4c-8784-ecc543605116", async function () {
        const { name } = await this.props({
            name: `Testing Delete - ${getRandomString(4)}.txt`,
        });

        await files.addUsingPath(name, "Some test text content.");
        let r = await files.filter(`Name eq '${name}'`)();
        expect(r.length).to.eq(1);
        await files.getByUrl(name).delete();
        r = await files.filter(`Name eq '${name}'`)();
        expect(r.length).to.eq(0);
    }));

    it("deleteWithParams", pnpTest("53ed0910-cfa8-40a9-91b9-75b790e415b4", async function () {
        const { name } = await this.props({
            name: `Testing Delete - ${getRandomString(4)}.txt`,
        });

        await files.addUsingPath(name, "Some test text content.");
        let r = await files.filter(`Name eq '${name}'`)();
        expect(r.length).to.eq(1);

        await files.getByUrl(name).deleteWithParams({
            BypassSharedLock: true,
        });

        r = await files.filter(`Name eq '${name}'`)();
        expect(r.length).to.eq(0);
    }));

    it("listItemAllFields", pnpTest("d5183bec-23bf-4b90-b565-7fd4abf4f5ec", function () {

        return expect(files.getByUrl(testFileName).listItemAllFields()).to.be.fulfilled;
    }));

    it("versions", pnpTest("a0f2ab21-4a87-412c-92b7-c571bb3309be", function () {

        return expect(files.getByUrl(testFileName).versions()).to.be.fulfilled;
    }));

    it("checkin/checkout", pnpTest("838abd26-fa13-4015-ae3f-46c08c7f87c4", async function () {
        const { name } = await this.props({
            name: `Testing check in out - ${getRandomString(4)}.txt`,
        });

        await files.addUsingPath(name, "Some test text content.");
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        const file = files.getByUrl(name);

        await file.checkout();

        let check = await file.select("CheckOutType")<{ CheckOutType: 0 | 1 | 2 }>();

        expect(check.CheckOutType).to.eq(0);

        await file.checkin();

        check = await file.select("CheckOutType")<{ CheckOutType: 0 | 1 | 2 }>();

        expect(check.CheckOutType).to.eq(2);
    }));

    it("copyTo", pnpTest("b974f1cd-b9ac-4487-a554-6c78876e16e9", async function () {
        const { rand, randPath} = await this.props({
            rand: getRandomString(4),
            randPath: getRandomString(42),
        });

        const name = `Testing copyTo - ${rand}.txt`;
        await files.addUsingPath(name, randPath);
        const folderData = await this.pnp.sp.web.defaultDocumentLibrary.rootFolder.select("ServerRelativeUrl")();
        const name2 = `I Copied - ${rand}.aspx`;
        const path = combine("/", folderData.ServerRelativeUrl, name2);

        await files.getByUrl(name).copyTo(path, true);

        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        return expect(files.getByUrl(name2)()).to.eventually.be.fulfilled;
    }));

    it("copyByPath", pnpTest("177a04e8-9973-4e26-983b-2c2ba5f32867", async function () {
        const { rand, randPath} = await this.props({
            rand: getRandomString(4),
            randPath: getRandomString(42),
        });

        const name = `Testing copyByPath - ${rand}.txt`;
        await files.addUsingPath(name, randPath);
        const folderData = await this.pnp.sp.web.defaultDocumentLibrary.rootFolder.select("ServerRelativeUrl")();
        const name2 = `I Copied - ${rand}.aspx`;
        const path = combine("/", folderData.ServerRelativeUrl, name2);

        await files.getByUrl(name).copyByPath(path, true);
        return expect(files.getByUrl(name2)()).to.eventually.be.fulfilled;
    }));

    it("copyByPath - options", pnpTest("3fe587e6-4e27-4db4-be32-c52dc2f282bf", async function () {
        const { rand, randPath} = await this.props({
            rand: getRandomString(4),
            randPath: getRandomString(42),
        });

        const name = `Testing copyByPath - ${rand}.txt`;
        await files.addUsingPath(name, randPath);
        const folderData = await this.pnp.sp.web.defaultDocumentLibrary.rootFolder.select("ServerRelativeUrl")();
        const name2 = `I Copied - ${rand}.aspx`;
        const path = combine("/", folderData.ServerRelativeUrl, name2);

        await files.getByUrl(name).copyByPath(path, true, {
            KeepBoth: true,
            ResetAuthorAndCreatedOnCopy: false,
            ShouldBypassSharedLocks: true,
        });
        return expect(files.getByUrl(name2)()).to.eventually.be.fulfilled;
    }));

    it("moveByPath", pnpTest("cfb617f4-08f1-425f-95f8-810714dcf118", async function () {
        const { rand, randPath} = await this.props({
            rand: getRandomString(4),
            randPath: getRandomString(42),
        });
        const name = `Testing moveByPath - ${rand}.txt`;
        await files.addUsingPath(name, randPath);
        const folderData = await this.pnp.sp.web.defaultDocumentLibrary.rootFolder.select("ServerRelativeUrl")();
        const name2 = `I Copied - ${rand}.aspx`;
        const path = combine("/", folderData.ServerRelativeUrl, name2);

        await files.getByUrl(name).moveByPath(path, true);
        return expect(files.getByUrl(name2)()).to.eventually.be.fulfilled;
    }));

    it("moveByPath - options", pnpTest("c5052cb7-37db-4e2c-8ab9-0d56d0a35c31", async function () {
        const { rand, randPath} = await this.props({
            rand: getRandomString(4),
            randPath: getRandomString(42),
        });
        const name = `Testing moveByPath - ${rand}.txt`;
        await files.addUsingPath(name, randPath);
        const folderData = await this.pnp.sp.web.defaultDocumentLibrary.rootFolder.select("ServerRelativeUrl")();
        const name2 = `I Copied - ${rand}.aspx`;
        const path = combine("/", folderData.ServerRelativeUrl, name2);

        await files.getByUrl(name).moveByPath(path, true, {
            KeepBoth: true,
            RetainEditorAndModifiedOnMove: false,
            ShouldBypassSharedLocks: true,
        });
        return expect(files.getByUrl(name2)()).to.eventually.be.fulfilled;
    }));

    it("moveByPath - batched", pnpTest("2abcbe61-edae-4721-8cd4-53bbb458ffa2", async function () {
        const { rand, randPath} = await this.props({
            rand: getRandomString(4),
            randPath: getRandomString(42),
        });
        const name = `Testing moveByPath - ${rand}.txt`;
        await files.addUsingPath(name, randPath);
        const folderData = await this.pnp.sp.web.defaultDocumentLibrary.rootFolder.select("ServerRelativeUrl")();
        const name2 = `I Copied - ${rand}.aspx`;

        const sourcePath = combine("/", folderData.ServerRelativeUrl, name);
        const path = combine("/", folderData.ServerRelativeUrl, name2);

        const [batch, execute] = this.pnp.sp.web.batched();

        batch.getFileByServerRelativePath(sourcePath).moveByPath(path, true);

        await execute();

        return expect(files.getByUrl(name2)()).to.eventually.be.fulfilled;
    }));

    it("recycle", pnpTest("94fe5632-dc29-4e70-93c7-a6816c08489f", async function () {
        const { name } = await this.props({
            name: `Testing Recycle - ${getRandomString(4)}.txt`,
        });
        await files.addUsingPath(name, "Some test text content.");
        let r = await files.filter(`Name eq '${name}'`)();
        expect(r.length).to.eq(1);
        await files.getByUrl(name).recycle();
        r = await files.filter(`Name eq '${name}'`)();
        expect(r.length).to.eq(0);
    }));

    it("exists (true)", pnpTest("454baa14-702b-4b60-bf7d-f86c255503cb", async function () {
        const { name } = await this.props({
            name:`Testing Exists - ${getRandomString(4)}.txt`,
        });
        await files.addUsingPath(name, "Some test text content.");
        const exists = await files.getByUrl(name).exists();
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        expect(exists).to.be.true;
    }));

    it("exists (false)", pnpTest("fb0163e7-ed58-4f90-9d6e-572343a2b79b", async function () {
        const { rand } = await this.props({
            rand: `${getRandomString(4)}`,
        });
        const exists = await files.getByUrl(`Testing Exists - ${rand}`).exists();
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        expect(exists).to.be.false;
    }));

    it("setContent", pnpTest("cd56ad67-9bac-47be-95e9-3bcfe5a111af", async function () {
        const { name } = await this.props({
            name: `Testing setContent - ${getRandomString(4)}.txt`,
        });

        await files.addUsingPath(name, "Some test text content.");
        await files.getByUrl(name).setContent("different.");
        const file = await files.getByUrl(name).getText();
        expect(file).to.eq("different.");
    }));

    it("getItem", pnpTest("b5be7c57-9770-4921-9d37-e69bb7ca6e37", async function () {
        const { name } = await this.props({
            name: `Testing getItem - ${getRandomString(4)}.txt`,
        });

        await files.addUsingPath(name, "Some test text content.");
        const item = await files.getByUrl(name).getItem();
        return expect(item()).to.eventually.be.fulfilled;
    }));

    it("getLockedByUser", pnpTest("abcd44ea-680a-4a7a-9661-5fc3c96f67b3", async function () {
        const { name } = await this.props({
            name: `Testing getLockedByUser - ${getRandomString(4)}.txt`,
        });

        await files.addUsingPath(name, "Some test text content.");
        const lockedByUser = await files.getByUrl(name).getLockedByUser();
        return expect(lockedByUser).to.be.null;
    }));
});
