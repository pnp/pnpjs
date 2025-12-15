import { expect } from "chai";
import "@pnp/sp/webs";
import "@pnp/sp/folders/web";
import "@pnp/sp/folders/list";
import "@pnp/sp/files/web";
import "@pnp/sp/files/folder";
import "@pnp/sp/lists/web";
import { combine } from "@pnp/core";
import { SPQueryable } from "@pnp/sp";
import { pnpTest } from "../pnp-test.js";

describe("Alias Parameters", function () {

    let webRelativeUrl = "";

    before(pnpTest("20d1a4cc-a5ab-400b-a6a2-55d06f3f0dbf", async function () {

        if (!this.pnp.settings.enableWebTests) {
            this.skip();
        }

        const webInfo: { ServerRelativeUrl: string; Url: string } = await this.pnp.sp.web.select("ServerRelativeUrl", "Url")();

        // make sure we have the correct server relative url
        webRelativeUrl = webInfo.ServerRelativeUrl;

        const ler = await this.pnp.sp.web.lists.ensure("AliasTestLib", "Used to test alias parameters", 101);
        const list = ler.list;

        await list.rootFolder.folders.addUsingPath("MyTestFolder");
        await list.rootFolder.files.addUsingPath("text.txt", "Some file content!");
    }));

    it("Parameter parsing", pnpTest("b3e1f8a7-4c2b-4b8e-9f3e-2e7c3c9d8f1a", async function() {
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

            obj[`something('!@p1::${value}')`] = {"@p1": `'${value}'`};
            obj[`something('!@p1::${value}','!@p2::${value}2')`] = { "@p1": `'${value}'`, "@p2": `'${value}2'` };
            obj[`something('!@p1::${value}', param=value)`] = { "@p1": `'${value}'` };
            obj[`something('!@p1::${value}', param=value, '!@p2::${value}2')`] = { "@p1": `'${value}'`, "@p2": `'${value}2'` };
            obj[`something(param=value,'!@p1::${value}')`] = { "@p1": `'${value}'` };
            obj[`something(param=value,'!@p1::${value}','!@p2::${value}2')`] = { "@p1": `'${value}'`, "@p2": `'${value}2'` };
            obj[`something(param=value,'!@p1::${value}',param=value)`] = { "@p1": `'${value}'` };
            obj[`something(param=value,'!@p1::${value}',param=value,'!@p2::${value}2')`] = { "@p1": `'${value}'`, "@p2": `'${value}2'` };
            obj[`something(param='!@p1::${value}')`] = { "@p1": `'${value}'` };
            obj[`something(param='!@p1::${value}',param2='!@p2::${value}2')`] = { "@p1": `'${value}'`, "@p2": `'${value}2'` };
            return obj;
        }, {});

        // Test all aliased parameters
        for (const [alias, params] of Object.entries(tests)) {
            const requestUrl = SPQueryable(this.pnp.sp.web, alias).toRequestUrl();
            const searchParams = Object.fromEntries(new URL(requestUrl).searchParams.entries());

            // eslint-disable-next-line guard-for-in
            for (const param in params) {
                expect(searchParams, `Failed to parse "${alias}"`).to.have.property(param);
                expect(searchParams[param], `Failed to parse "${alias}"`).to.equal(params[param]);
            }
        }
    }));

    it("Folders", pnpTest("d4a1c9e2-5f3b-4a7e-8c2d-1e9f3b7c8a1f", function () {

        return expect(this.pnp.sp.web.getFolderByServerRelativePath(`!@p1::/${combine(webRelativeUrl, "AliasTestLib/MyTestFolder")}`)()).to.eventually.be.fulfilled;
    }));

    it("Files", pnpTest("e7c3b9d8-f1a2-4b3e-8c2d-5f3b4a7e1c9f", function () {

        return expect(this.pnp.sp.web.getFileByServerRelativePath(`!@p1::/${combine(webRelativeUrl, "AliasTestLib/text.txt")}`)()).to.eventually.be.fulfilled;
    }));

    it("Sub-parameters", pnpTest("f3b7c8a1-d4a2-5e9f-3b1c-9e2f7c8b4a1d", function () {

        const folder = this.pnp.sp.web.getFolderByServerRelativePath(`!@p1::/${combine(webRelativeUrl, "AliasTestLib/MyTestFolder")}`);
        return expect(folder.files.addUsingPath("!@p2::myfilename.txt", "new file content")).to.eventually.be.fulfilled;
    }));
});
