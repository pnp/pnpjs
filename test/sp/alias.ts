import { expect } from "chai";
import "@pnp/sp/webs";
import "@pnp/sp/folders/web";
import "@pnp/sp/folders/list";
import "@pnp/sp/files/web";
import "@pnp/sp/files/folder";
import "@pnp/sp/lists/web";
import { getSP, testSettings } from "../main.js";
import { combine } from "@pnp/core";
import { SPRest } from "@pnp/sp";

describe("Alias Parameters", function () {

    let webRelativeUrl = "";

    if (testSettings.enableWebTests) {
        let _spRest: SPRest = null;

        before(async function () {
            _spRest = getSP();

            const webInfo: { ServerRelativeUrl: string; Url: string } = await _spRest.web.select("ServerRelativeUrl", "Url")();

            // make sure we have the correct server relative url
            webRelativeUrl = webInfo.ServerRelativeUrl;

            const ler = await _spRest.web.lists.ensure("AliasTestLib", "Used to test alias parameters", 101);

            await ler.list.rootFolder.folders.addUsingPath("MyTestFolder");
            await ler.list.rootFolder.files.addUsingPath("text.txt", "Some file content!");
        });

        it("Should allow aliasing for folders", function () {

            return expect(_spRest.web.getFolderByServerRelativePath(`!@p1::/${combine(webRelativeUrl, "AliasTestLib/MyTestFolder")}`)()).to.eventually.be.fulfilled;
        });

        it("Should allow aliasing for files", function () {

            return expect(_spRest.web.getFileByServerRelativePath(`!@p1::/${combine(webRelativeUrl, "AliasTestLib/text.txt")}`)()).to.eventually.be.fulfilled;
        });

        it("Should allow aliasing for sub-parameters", function () {

            const folder = _spRest.web.getFolderByServerRelativePath(`!@p1::/${combine(webRelativeUrl, "AliasTestLib/MyTestFolder")}`);
            return expect(folder.files.addUsingPath("!@p2::myfilename.txt", "new file content")).to.eventually.be.fulfilled;
        });
    }
});
