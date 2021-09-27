import { expect } from "chai";
import "@pnp/sp/webs";
import "@pnp/sp/folders/web";
import "@pnp/sp/folders/list";
import "@pnp/sp/files/web";
import "@pnp/sp/files/folder";
import "@pnp/sp/lists/web";
import { getSP, testSettings } from "../main-2.js";
import { combine } from "@pnp/core";

describe("Alias Parameters", () => {

    let webRelativeUrl = "";

    if (testSettings.enableWebTests) {

        before(async function () {
            let sp = getSP();

            const webInfo: { ServerRelativeUrl: string; Url: string } = await sp.web.select("ServerRelativeUrl", "Url")();

            // make sure we have the correct server relative url
            webRelativeUrl = webInfo.ServerRelativeUrl;

            const ler = await sp.web.lists.ensure("AliasTestLib", "Used to test alias parameters", 101);

            await ler.list.rootFolder.folders.add("MyTestFolder");
            await ler.list.rootFolder.files.add("text.txt", "Some file content!");
        });

        it("Should allow aliasing for folders", function () {

            return expect(sp.web.getFolderByServerRelativeUrl(`!@p1::/${combine(webRelativeUrl, "AliasTestLib/MyTestFolder")}`)()).to.eventually.be.fulfilled;
        });

        it("Should allow aliasing for files", function () {

            return expect(sp.web.getFileByServerRelativeUrl(`!@p1::/${combine(webRelativeUrl, "AliasTestLib/text.txt")}`)()).to.eventually.be.fulfilled;
        });

        it("Should allow aliasing for sub-parameters", function () {

            const folder = sp.web.getFolderByServerRelativeUrl(`!@p1::/${combine(webRelativeUrl, "AliasTestLib/MyTestFolder")}`);
            return expect(folder.files.add("!@p2::myfilename.txt", "new file content")).to.eventually.be.fulfilled;
        });
    }
});
