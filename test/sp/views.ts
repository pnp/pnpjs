import { expect } from "chai";
import { getRandomString } from "@pnp/core";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/views";
import { IList } from "@pnp/sp/lists";

describe("Views", function () {

    let list: IList;

    before(async function () {

        if (!this.pnp.settings.enableWebTests) {
            this.skip();
        }

        // we need to create a list for manipulating views
        const result = await this.pnp.sp.web.lists.ensure(`ViewTestList_${getRandomString(4)}`, "Testing Views");

        list = result.list;
    });

    it("-invoke", function () {
        return expect(list.views()).to.eventually.be.fulfilled;
    });

    it("defaultView", function () {
        return expect(list.defaultView()).to.eventually.be.fulfilled;
    });

    it("getById", async function () {
        const v: { Id: string } = await list.defaultView.select("Id")();
        return expect(list.views.getById(v.Id)()).to.eventually.be.fulfilled;
    });

    it("getView", async function () {
        const v: { Id: string } = await list.defaultView.select("Id")();
        const vId = v.Id;
        const lv = await list.getView(vId)();
        return expect(lv.Id).to.equal(vId);
    });

    it("getByTitle", async function () {
        const v = await list.views.top(1).select("Title")<{ Title: string }[]>();
        if (v.length > 0) {
            const vTitle = v[0].Title;
            const lv = await list.views.getByTitle(vTitle)();
            return expect(lv.Title).to.eq(vTitle);
        } else {
            return false;
        }
    });

    it("add", async function () {
        const viewTitle = `Test-Add-View_${getRandomString(4)}`;
        const av = await list.views.add(viewTitle, false);
        return expect(av.data.Title).to.eq(viewTitle);
    });

    it("fields", async function () {
        const vf = await list.defaultView.fields();
        return expect(vf).to.have.property("SchemaXml");
    });

    it("update", async function () {
        const r = await list.views.add(`Update-Test-View_${getRandomString(4)}`);
        await r.view.update({
            RowLimit: 20,
        });
        const v = await list.views.getById(r.data.Id)();
        return expect(v.RowLimit).to.eq(20);
    });

    it("renderAsHtml", async function () {
        const vHtml = await list.defaultView.renderAsHtml();
        return expect(vHtml).to.have.length.greaterThan(0);
    });

    it("setViewXml", async function () {
        const r = await list.views.add(`setViewXml-Test-View_${getRandomString(4)}`);
        const xml = "<View><Query><Where><Eq><FieldRef Name='Title'/><Value Type='Text'>Test</Value></Eq></Where></Query></View>";
        return expect(r.view.setViewXml(xml)).to.eventually.be.fulfilled;
    });

    describe("ViewFields", function () {

        it("getSchemaXml", async function () {
            const fieldSchema = await list.defaultView.fields.getSchemaXml();
            return expect(fieldSchema).to.have.length.greaterThan(0);
        });

        it("add", async function () {
            const r = await list.views.add(`add-Test-ViewFields_${getRandomString(4)}`);
            return expect(r.view.fields.add("Created")).to.eventually.be.fulfilled;
        });

        it("move", async function () {
            const r = await list.views.add(`move-Test-ViewFields_${getRandomString(4)}`);
            await r.view.fields.add("Modified");
            return expect(r.view.fields.move("Modified", 0)).to.eventually.be.fulfilled;
        });

        it("remove", async function () {
            const r = await list.views.add(`remove-Test-ViewFields_${getRandomString(4)}`);
            await r.view.fields.add("Author");
            return expect(r.view.fields.remove("Author")).to.eventually.be.fulfilled;
        });

        it("removeAll", async function () {
            const r = await list.views.add(`removeAll-Test-ViewFields_${getRandomString(4)}`);
            return expect(r.view.fields.removeAll()).to.eventually.be.fulfilled;
        });
    });
});


