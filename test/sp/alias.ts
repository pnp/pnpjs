import { expect } from "chai";
import "@pnp/sp/webs";
import "@pnp/sp/folders/web";
import "@pnp/sp/folders/list";
import "@pnp/sp/files/web";
import "@pnp/sp/files/folder";
import "@pnp/sp/lists/web";
import { combine } from "@pnp/core";
import { SPQueryable } from "@pnp/sp";

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

    it('Parameter parsing', function() {
        /** Values to test */
        const values = [
            "value",
            "value's",
            "value with space",
            "value with space' and apostrophe",
            "ending with apostrophe'",
            "'staring with apostrophe",
            "'staring and ending with apostrophe'",
            "with,' comma",
        ];
        /** Aliased parameters to test */
        const tests = values.reduce<Record<string, Record<string, string>>>((obj, value)=>{
            // Escape apostrophe in value
            value = value.replace(/'/g, "''");

            obj[`something('!@p1::${value}')`] = {'@p1': `'${value}'`};
            obj[`something('!@p1::${value}','!@p2::${value}2')`] = {'@p1': `'${value}'`, '@p2': `'${value}2'`};
            obj[`something('!@p1::${value}', param=value)`] = {'@p1': `'${value}'`};
            obj[`something('!@p1::${value}', param=value, '!@p2::${value}2')`] = {'@p1': `'${value}'`, '@p2': `'${value}2'`};
            obj[`something(param=value,'!@p1::${value}')`] = {'@p1': `'${value}'`};
            obj[`something(param=value,'!@p1::${value}','!@p2::${value}2')`] = {'@p1': `'${value}'`, '@p2': `'${value}2'`};
            obj[`something(param=value,'!@p1::${value}',param=value)`] = {'@p1': `'${value}'`};
            obj[`something(param=value,'!@p1::${value}',param=value,'!@p2::${value}2')`] = {'@p1': `'${value}'`, '@p2': `'${value}2'`};
            obj[`something(param='!@p1::${value}')`] = {'@p1': `'${value}'`};
            obj[`something(param='!@p1::${value}',param2='!@p2::${value}2')`] = {'@p1': `'${value}'`, '@p2': `'${value}2'`};
            return obj;
        }, {});

        // Test all aliased parameters
        for(const [alias, params] of Object.entries(tests)) {
            const requestUrl = SPQueryable(this.pnp.sp.web, alias).toRequestUrl();
            const searchParams = Object.fromEntries(new URL(requestUrl).searchParams.entries());

            for(const param in params) {
                expect(searchParams, `Failed to parse "${alias}"`).to.have.property(param);
                expect(searchParams[param], `Failed to parse "${alias}"`).to.equal(params[param]);
            }
        }
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
