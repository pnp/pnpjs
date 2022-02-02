import { expect } from "chai";
import "@pnp/sp/webs";
import "@pnp/sp/folders/web";
import "@pnp/sp/folders/list";
import "@pnp/sp/files/web";
import "@pnp/sp/files/folder";
import "@pnp/sp/lists/web";
import { combine } from "@pnp/core";

describe("Alias Parameters", function () {

    let webRelativeUrl = "";

    before(async function () {

        if (!this.pnp.settings.enableWebTests) {
            this.skip();
        }

        const webInfo: { ServerRelativeUrl: string; Url: string } = await this.pnp.sp.web.select("ServerRelativeUrl", "Url")();

        // make sure we have the correct server relative url
        webRelativeUrl = webInfo.ServerRelativeUrl;

        const ler = await this.pnp.sp.web.lists.ensure("AliasTestLib", "Used to test alias parameters", 101);

        await ler.list.rootFolder.folders.addUsingPath("MyTestFolder");
        await ler.list.rootFolder.files.addUsingPath("text.txt", "Some file content!");
    });

    it("Folders", function () {

        return expect(this.pnp.sp.web.getFolderByServerRelativePath(`!@p1::/${combine(webRelativeUrl, "AliasTestLib/MyTestFolder")}`)()).to.eventually.be.fulfilled;
    });

    it("Files", function () {

        return expect(this.pnp.sp.web.getFileByServerRelativePath(`!@p1::/${combine(webRelativeUrl, "AliasTestLib/text.txt")}`)()).to.eventually.be.fulfilled;
    });

    it("Sub-parameters", function () {

        const folder = this.pnp.sp.web.getFolderByServerRelativePath(`!@p1::/${combine(webRelativeUrl, "AliasTestLib/MyTestFolder")}`);
        return expect(folder.files.addUsingPath("!@p2::myfilename.txt", "new file content")).to.eventually.be.fulfilled;
    });
});
