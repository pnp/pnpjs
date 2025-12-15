import { expect } from "chai";
import { getRandomString } from "@pnp/core";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/views";
import { IList } from "@pnp/sp/lists";
import { pnpTest } from  "../pnp-test.js";

describe("Views", function () {

    let list: IList;

    before(pnpTest("3e0c391f-a7a3-4f5a-b5e7-cd750ed98df9", async function () {

        if (!this.pnp.settings.enableWebTests) {
            this.skip();
        }
        const{ viewTitle } = await this.props({
            viewTitle: `ViewTestList_${getRandomString(4)}`,
        });
        // we need to create a list for manipulating views
        const result = await this.pnp.sp.web.lists.ensure(viewTitle, "Testing Views");

        list = result.list;
    }));

    it("-invoke", pnpTest("65e8060a-861e-43b9-8857-75783c78548d", function () {
        return expect(list.views()).to.eventually.be.fulfilled;
    }));

    it("defaultView", pnpTest("37b4a138-c117-4442-840b-c8ebbf115366", function () {
        return expect(list.defaultView()).to.eventually.be.fulfilled;
    }));

    it("getById", pnpTest("edb7b6b0-9e8f-40f7-805a-3b72d861a1cf", async function () {
        const v: { Id: string } = await list.defaultView.select("Id")();
        return expect(list.views.getById(v.Id)()).to.eventually.be.fulfilled;
    }));

    it("getView", pnpTest("49b59963-5d15-4c07-bd25-27d24fe8ba42", async function () {
        const v: { Id: string } = await list.defaultView.select("Id")();
        const vId = v.Id;
        const lv = await list.getView(vId)();
        return expect(lv.Id).to.equal(vId);
    }));

    it("getByTitle", pnpTest("0bf27858-d61f-4779-9dcf-659f533c945c", async function () {
        const v = await list.views.top(1).select("Title")<{ Title: string }[]>();
        if (v.length > 0) {
            const vTitle = v[0].Title;
            const lv = await list.views.getByTitle(vTitle)();
            return expect(lv.Title).to.eq(vTitle);
        } else {
            return false;
        }
    }));

    it("add", pnpTest("71f70d7a-5872-4e02-9475-dd891f3d24b8", async function () {
        const{ viewTitle } = await this.props({
            viewTitle: `Test-Add-View_${getRandomString(4)}`,
        });
        const av = await list.views.add(viewTitle, false);
        return expect(av.Title).to.eq(viewTitle);
    }));

    it("fields", pnpTest("4293dc54-0904-4d27-989a-83e271fee048", async function () {
        const vf = await list.defaultView.fields();
        return expect(vf).to.have.property("SchemaXml");
    }));

    it("update", pnpTest("90cbf555-868c-46c6-b213-78513efc0852", async function () {
        const{ viewTitle } = await this.props({
            viewTitle: `Update-Test-View_${getRandomString(4)}`,
        });
        const r = await list.views.add(viewTitle);
        await list.views.getById(r.Id).update({
            RowLimit: 20,
        });
        const v = await list.views.getById(r.Id)();
        return expect(v.RowLimit).to.eq(20);
    }));

    it("renderAsHtml", pnpTest("35f0f075-3933-4239-95b1-75c97d1814ab", async function () {
        const vHtml = await list.defaultView.renderAsHtml();
        return expect(vHtml).to.have.length.greaterThan(0);
    }));

    it("setViewXml", pnpTest("3fb14de8-50bd-4df6-a638-f83f520574fd", async function () {
        const{ viewTitle } = await this.props({
            viewTitle: `setViewXml-Test-View_${getRandomString(4)}`,
        });
        const r = await list.views.add(viewTitle);
        const xml = "<View><Query><Where><Eq><FieldRef Name='Title'/><Value Type='Text'>Test</Value></Eq></Where></Query></View>";
        return expect(list.views.getById(r.Id).setViewXml(xml)).to.eventually.be.fulfilled;
    }));

    describe("ViewFields", function () {

        it("getSchemaXml", pnpTest("e19e974e-34a8-4af9-b044-373005bc41f5", async function () {
            const fieldSchema = await list.defaultView.fields.getSchemaXml();
            return expect(fieldSchema).to.have.length.greaterThan(0);
        }));

        it("add", pnpTest("12733ea5-cae9-42a3-ac51-85a795d32b50", async function () {
            const{ viewTitle } = await this.props({
                viewTitle: `add-Test-ViewFields_${getRandomString(4)}`,
            });
            const r = await list.views.add(viewTitle);
            return expect(list.views.getById(r.Id).fields.add("Created")).to.eventually.be.fulfilled;
        }));

        it("move", pnpTest("e3b1f0a7-0e49-4cc4-b21c-fe3f8d01742b", async function () {
            const{ viewTitle } = await this.props({
                viewTitle: `move-Test-ViewFields_${getRandomString(4)}`,
            });
            const r = await list.views.add(viewTitle);
            await list.views.getById(r.Id).fields.add("Modified");
            return expect(list.views.getById(r.Id).fields.move("Modified", 0)).to.eventually.be.fulfilled;
        }));

        it("remove", pnpTest("dab5c18c-9050-4e2f-a49a-4e6dccfc773e", async function () {
            const{ viewTitle } = await this.props({
                viewTitle: `remove-Test-ViewFields_${getRandomString(4)}`,
            });
            const r = await list.views.add(viewTitle);
            await list.views.getById(r.Id).fields.add("Author");
            return expect(list.views.getById(r.Id).fields.remove("Author")).to.eventually.be.fulfilled;
        }));

        it("removeAll", pnpTest("fcc140e0-34e0-4768-8f5a-78760c10c220", async function () {
            const{ viewTitle } = await this.props({
                viewTitle: `removeAll-Test-ViewFields_${getRandomString(4)}`,
            });
            const r = await list.views.add(viewTitle);
            return expect(list.views.getById(r.Id).fields.removeAll()).to.eventually.be.fulfilled;
        }));
    });
});


