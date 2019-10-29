import { expect } from "chai";
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/folders/web";
import "@pnp/sp/folders/list";
import "@pnp/sp/files/web";
import "@pnp/sp/files/folder";
import "@pnp/sp/lists/web";
import { Web, IWeb } from "@pnp/sp/webs";
import { testSettings } from "../main";
import { combine } from "@pnp/common";

describe("Alias Parameters", () => {

    let webRelativeUrl = "";
    let web: IWeb;

    if (testSettings.enableWebTests) {

        before(async function () {

            web = Web(testSettings.sp.webUrl);

            const webInfo: { ServerRelativeUrl: string, Url: string } = await web.select("ServerRelativeUrl", "Url")();

            // make sure we have the correct server relative url
            webRelativeUrl = webInfo.ServerRelativeUrl;

            const ler = await web.lists.ensure("AliasTestLib", "Used to test alias parameters", 101);

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
