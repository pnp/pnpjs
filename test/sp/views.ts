import { expect } from "chai";
import { getRandomString } from "@pnp/common";
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/views";
import { testSettings } from "../main";
import { IList } from "@pnp/sp/lists";

describe("Views", () => {

    let list: IList;

    if (testSettings.enableWebTests) {

        before(async function () {
            this.timeout(0);

            // we need to create a list for manipulating views
            const result = await sp.web.lists.ensure(`ViewTestList_${getRandomString(4)}`, "Testing Views");

            list = result.list;
        });

        it("invoke", function () {
            return expect(list.views()).to.eventually.be.fulfilled;
        });

        it("defaultView", function () {
            return expect(list.defaultView()).to.eventually.be.fulfilled;
        });

        it("getById", async function () {
            const v: { Id: string } = await list.defaultView.select("Id")();
            return expect(list.views.getById(v.Id)()).to.eventually.be.fulfilled;
        });

        it("list.getView", async function () {
            const v: { Id: string } = await list.defaultView.select("Id")();
            return expect(list.getView(v.Id)()).to.eventually.be.fulfilled;
        });

        it("getByTitle", async function () {
            const v: { Title: string }[] = await list.views.top(1).select("Title")();
            return expect(list.views.getByTitle(v[0].Title)()).to.eventually.be.fulfilled;
        });

        it("add", function () {
            return expect(list.views.add(`Test-Add-View_${getRandomString(4)}`, false)).to.eventually.be.fulfilled;
        });

        it("fields", function () {
            return expect(list.defaultView.fields()).to.eventually.be.fulfilled;
        });

        it("update", async function () {
            this.timeout(0);
            const r = await list.views.add(`Update-Test-View_${getRandomString(4)}`);
            await r.view.update({
                RowLimit: 20,
            });
            const v = await list.views.getById(r.data.Id)();
            return expect(v.RowLimit).to.eq(20);
        });

        it("renderAsHtml", function () {
            return expect(list.defaultView.renderAsHtml()).to.eventually.be.fulfilled;
        });

        it("setViewXml", async function () {
            this.timeout(0);
            const r = await list.views.add(`setViewXml-Test-View_${getRandomString(4)}`);
            const xml = "<View><Query><Where><Eq><FieldRef Name=\'Title\'/><Value Type=\'Text\'>Test</Value></Eq></Where></Query></View>";
            return expect(r.view.setViewXml(xml)).to.eventually.be.fulfilled;
        });

        describe("ViewFields", function () {

            it("getSchemaXml", function () {
                return expect(list.defaultView.fields.getSchemaXml()).to.eventually.be.fulfilled;
            });

            it("add", async function () {
                this.timeout(0);
                const r = await list.views.add(`add-Test-ViewFields_${getRandomString(4)}`);
                return expect(r.view.fields.add("Created")).to.eventually.be.fulfilled;
            });

            it("move", async function () {
                this.timeout(0);
                const r = await list.views.add(`move-Test-ViewFields_${getRandomString(4)}`);
                await r.view.fields.add("Modified");
                return expect(r.view.fields.move("Modified", 0)).to.eventually.be.fulfilled;
            });

            it("remove", async function () {
                this.timeout(0);
                const r = await list.views.add(`remove-Test-ViewFields_${getRandomString(4)}`);
                await r.view.fields.add("Author");
                return expect(r.view.fields.remove("Author")).to.eventually.be.fulfilled;
            });

            it("removeAll", async function () {
                this.timeout(0);
                const r = await list.views.add(`removeAll-Test-ViewFields_${getRandomString(4)}`);
                return expect(r.view.fields.removeAll()).to.eventually.be.fulfilled;
            });
        });
    }
});


