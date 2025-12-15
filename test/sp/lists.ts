import { expect } from "chai";
import "@pnp/sp/lists";
import "@pnp/sp/content-types/list";
import "@pnp/sp/views/list";
import "@pnp/sp/folders/list";
import "@pnp/sp/fields/list";
import "@pnp/sp/forms/list";
import "@pnp/sp/items/list";
import "@pnp/sp/subscriptions/list";
import "@pnp/sp/user-custom-actions/list";
import "@pnp/sp/batching";
import { IList, IRenderListDataParameters, ControlMode, ICamlQuery, IChangeLogItemQuery, RenderListDataOptions } from "@pnp/sp/lists";
import { getRandomString } from "@pnp/core";
import testSPInvokables from "../test-invokable-props.js";
import { Context } from "mocha";
import { pnpTest } from  "../pnp-test.js";

describe("Lists", function () {

    let list;
    before(pnpTest("00d7b78d-f467-46e7-89e0-fb70b507d6d2", async function () {

        if (!this.pnp.settings.enableWebTests) {
            this.skip();
        }
        list = this.pnp.sp.web.lists.getByTitle("Documents");
    }));

    describe("Invokable Properties", testSPInvokables(() => list,
        "effectiveBasePermissions",
        "eventReceivers",
        "relatedFields",
        "informationRightsManagementSettings",
        "getParentInfos"));

    it("getById", pnpTest("52a39444-5b4a-4bd2-85d4-959fe064f17d", async function () {
        const list = await this.pnp.sp.web.lists.getByTitle("Documents").select("ID")<{ Id: string }>();
        const title = await this.pnp.sp.web.lists.getById(list.Id).select("Title")<{ Title: string }>();
        return expect(title).to.have.property("Title");
    }));

    it("getByTitle", pnpTest("18a3f5a1-dfae-41ea-98e2-e7059210205d", async function () {
        return expect(this.pnp.sp.web.lists.getByTitle("Documents").select("Title")()).to.eventually.be.fulfilled;
    }));

    it("add 1", pnpTest("b3b1ddf5-acd4-40db-99d9-8c5cbe2868ff", async function () {
        const { title } = await this.props({
            title: `pnp testing add 1 ${getRandomString(4)}`,
        });
        return expect(this.pnp.sp.web.lists.add(title, title)).to.eventually.be.fulfilled;
    }));

    it("add 2", pnpTest("bee3197f-123c-4203-aa1f-570dcaf1e119", async function () {
        const { title } = await this.props({
            title: `pnp testing add 2 ${getRandomString(4)}`,
        });
        return expect(this.pnp.sp.web.lists.add(title, title, 101, true, <any>{ OnQuickLaunch: true })).to.eventually.be.fulfilled;
    }));

    it("ensure", pnpTest("6246fab2-dd70-4e06-a4e7-c5944713f90d", async function () {
        const title = "pnp testing ensure";
        return expect(this.pnp.sp.web.lists.ensure(title)).to.eventually.be.fulfilled;
    }));

    it("ensure with too long title", pnpTest("c877a68b-1515-484b-8a47-e0fc3f846842", async function () {
        const { title } = await this.props({
            title: `${getRandomString(512)} - pnp testing ensure with too long title`,
        });
        return expect(this.pnp.sp.web.lists.ensure(title)).to.eventually.be.rejected;
    }));

    it("ensure fail update already existing list", pnpTest("ac3fcf23-1453-4996-bf2a-6c50c819b686", async function () {
        const title = "pnp testing ensure fail update already existing list";
        await this.pnp.sp.web.lists.ensure(title);
        return expect(this.pnp.sp.web.lists.ensure(title, title, 100, false, <any>{ RandomPropertyThatDoesntExistOnObject: "RandomValue" })).to.eventually.be.rejected;
    }));

    it("ensure with additional settings", pnpTest("fb90168a-f97f-4f5f-9d2b-901292b51f16", async function () {
        const title = "pnp testing ensure with additional settings";
        return expect(this.pnp.sp.web.lists.ensure(title, title, 101, true, <any>{ OnQuickLaunch: true })).to.eventually.be.fulfilled;
    }));

    it("ensure existing list with additional settings", pnpTest("e6cfcde4-c4af-401b-b388-a37b852c241b", async function () {
        const title = "pnp testing ensure existing list with additional settings";
        await this.pnp.sp.web.lists.ensure(title);
        return expect(this.pnp.sp.web.lists.ensure(title, title, 101, true, <any>{ OnQuickLaunch: true })).to.eventually.be.fulfilled;
    }));

    it("ensure already existing list", pnpTest("742b24a3-4f2a-440c-82a6-251d70b560b8", async function () {
        const title = "pnp testing ensure";
        await this.pnp.sp.web.lists.ensure(title);
        return expect(this.pnp.sp.web.lists.ensure(title)).to.eventually.be.fulfilled;
    }));

    it("ensureSiteAssetsLibrary", pnpTest("412bc7ab-d85c-4ccb-849f-75ab8c97cce0", function () {
        return expect(this.pnp.sp.web.lists.ensureSiteAssetsLibrary()).to.eventually.be.fulfilled;
    }));

    it("ensureSitePagesLibrary", pnpTest("98c09ca8-deb4-4e61-a2a6-ca4f0264e5f1", function () {
        return expect(this.pnp.sp.web.lists.ensureSitePagesLibrary()).to.eventually.be.fulfilled;
    }));
});

describe("List", function () {

    let list: IList;

    before(pnpTest("5d6e5ce5-6557-4833-8282-5109fd6a351a", async function () {

        if (!this.pnp.settings.enableWebTests) {
            this.skip();
        }
    }));

    beforeEach(pnpTest("60d7158d-a2c0-42af-b92b-124391319f17",async function () {
        list = await this.pnp.sp.web.lists.getByTitle("Documents");
    }));

    it("effectiveBasePermissions", pnpTest("3341f46f-4f3e-4937-bb69-9c9531d82c21", async function () {
        const listEnsure = await this.pnp.sp.web.lists.ensure("pnp testing effectiveBasePermissions");
        const list = listEnsure.list;
        return expect(list.effectiveBasePermissions()).to.eventually.be.fulfilled;
    }));

    it("eventReceivers", pnpTest("02e14466-a308-4943-8ae3-49d49ddddd9d", async function () {
        const listEnsure = await this.pnp.sp.web.lists.ensure("pnp testing eventReceivers");
        const list = listEnsure.list;
        return expect(list.eventReceivers()).to.eventually.be.fulfilled;
    }));

    it("relatedFields", pnpTest("5de0e793-566f-4fe6-8754-671f3d690d44", async function () {
        const listEnsure = await this.pnp.sp.web.lists.ensure("pnp testing relatedFields");
        const list = listEnsure.list;
        return expect(list.relatedFields()).to.eventually.be.fulfilled;
    }));

    it("informationRightsManagementSettings", pnpTest("87fce268-2ad7-48a1-8495-de692cd674d2", async function () {
        const listEnsure = await this.pnp.sp.web.lists.ensure("pnp testing informationRightsManagementSettings");
        const list = listEnsure.list;
        return expect(list.informationRightsManagementSettings()).to.eventually.be.fulfilled;
    }));

    it("update", pnpTest("8f5e2561-947d-41ad-b81f-44f144394a65", async function () {
        const listEnsure = await this.pnp.sp.web.lists.ensure("pnp testing update");
        const list = listEnsure.list;
        const newTitle = "New title after update";
        return expect(list.update({ Title: newTitle })).to.eventually.be.fulfilled;
    }));

    it("getChanges", pnpTest("e47ad4d2-0558-48ea-9dfe-96c1d2f89e93", async function () {
        const listEnsure = await this.pnp.sp.web.lists.ensure("pnp testing getChanges");
        const list = listEnsure.list;
        return expect(list.getChanges({
            Add: true,
            DeleteObject: true,
            Restore: true,
        })).to.eventually.be.fulfilled;
    }));

    it("getItemsByCAMLQuery", pnpTest("13849b5c-0c1a-4c29-92be-6dceeaaa4904", async function () {
        const listEnsure = await this.pnp.sp.web.lists.ensure("pnp testing getItemsByCAMLQuery");
        const list = listEnsure.list;
        const caml: ICamlQuery = {
            ViewXml: "<View><ViewFields><FieldRef Name='Title' /><FieldRef Name='RoleAssignments' /></ViewFields><RowLimit>5</RowLimit></View>",
        };
        return expect(list.getItemsByCAMLQuery(caml, "RoleAssignments")).to.eventually.be.fulfilled;
    }));

    it("getListItemChangesSinceToken", pnpTest("30d77830-e535-41e5-8aca-8d4c40185764", async function () {
        const listEnsure = await this.pnp.sp.web.lists.ensure("pnp testing getListItemChangesSinceToken");
        const list = listEnsure.list;
        const query: IChangeLogItemQuery = {
            Contains: "<Contains><FieldRef Name=\"Title\"/><Value Type=\"Text\">Testing</Value></Contains>",
            // eslint-disable-next-line max-len
            QueryOptions: "<QueryOptions><IncludeMandatoryColumns>FALSE</IncludeMandatoryColumns><DateInUtc>False</DateInUtc><IncludePermissions>TRUE</IncludePermissions><IncludeAttachmentUrls>FALSE</IncludeAttachmentUrls><Folder>Shared Documents/Test1</Folder></QueryOptions>",
        };
        return expect(list.getListItemChangesSinceToken(query)).to.eventually.be.fulfilled;
    }));

    it("recycle", pnpTest("f1b52bb7-8d77-4ff8-b164-e45a582b4403", async function () {
        const listEnsure = await this.pnp.sp.web.lists.ensure("pnp testing recycle");
        const list = listEnsure.list;
        const recycleResponse = await list.recycle();
        if (typeof recycleResponse !== "string") {
            throw Error("Expected a string returned from recycle.");
        }
        return expect(list.select("Title")()).to.eventually.be.rejected;
    }));

    it("renderListData", pnpTest("946b5b62-ae7b-4326-ba5b-986395372718", async function () {
        const listEnsure = await this.pnp.sp.web.lists.ensure("pnp testing renderListData");
        const list = listEnsure.list;
        await list.items.add({
            Title: "Item 1",
        });
        await list.items.add({
            Title: "Item 2",
        });
        await list.items.add({
            Title: "Item 3",
        });

        return expect(list.renderListData("<View><RowLimit>5</RowLimit></View>")).to.eventually.have.property("Row").that.is.not.empty;
    }));

    const setupRenderListDataAsStream = async function (this: Context): Promise<IList> {

        const listEnsure = await this.pnp.sp.web.lists.ensure("pnp testing renderListDataAsStream");

        if (listEnsure.created) {
            await listEnsure.list.items.add({
                Title: "Item 1",
            });
            await listEnsure.list.items.add({
                Title: "Item 2",
            });
            await listEnsure.list.items.add({
                Title: "Item 3",
            });
        }

        return listEnsure.list;
    };

    it("renderListDataAsStream", pnpTest("b71f1c64-9f53-43be-b9c5-ce54fb979908", async function () {

        const rList = await setupRenderListDataAsStream.call(this);

        const renderListDataParams: IRenderListDataParameters = {
            ViewXml: "<View><RowLimit>5</RowLimit></View>",
        };

        return expect(rList.renderListDataAsStream(renderListDataParams)).to.eventually.have.property("Row").that.is.not.empty;
    }));

    it("renderListDataAsStream - advanced options", pnpTest("7ebf0bd1-78b9-4d91-9537-b84ebef8749e", async function () {

        const rList = await setupRenderListDataAsStream.call(this);

        const renderListDataParams: IRenderListDataParameters = {
            AddRequiredFields: true,
            RenderOptions: [
                RenderListDataOptions.ContextInfo,
                RenderListDataOptions.ListSchema,
                RenderListDataOptions.MenuView,
                RenderListDataOptions.FileSystemItemId,
                RenderListDataOptions.QuickLaunch,
                RenderListDataOptions.Spotlight,
                RenderListDataOptions.Visualization,
                RenderListDataOptions.ViewMetadata,
                RenderListDataOptions.DisableAutoHyperlink,
            ],
            ViewXml: "<View><RowLimit>5</RowLimit></View>",
        };

        return expect(rList.renderListDataAsStream(renderListDataParams)).to.eventually.be.fulfilled;
    }));

    it("renderListDataAsStream - no override params", pnpTest("9cd5e2f1-2310-42bf-b0cb-b3a45761e313", async function () {

        const rList = await setupRenderListDataAsStream.call(this);

        const renderListDataParams: IRenderListDataParameters = {
            AddRequiredFields: true,
            ViewXml: "<View><RowLimit>5</RowLimit></View>",
        };

        return expect(rList.renderListDataAsStream(renderListDataParams)).to.eventually.be.fulfilled;
    }));

    it("renderListDataAsStream - query params", pnpTest("a25109f9-defa-4c20-a2ac-45ea2bcbd954", async function () {

        const rList = await setupRenderListDataAsStream.call(this);

        const renderListDataParams: IRenderListDataParameters = {
            AddRequiredFields: false,
            ViewXml: "<View><RowLimit>5</RowLimit></View>",
        };

        const r = await rList.renderListDataAsStream(renderListDataParams, {}, new Map([["FilterField1", "Title"], ["FilterValue1", "Item 2"]]));

        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        expect(r).to.not.be.null;
        expect(r.Row.length).to.eq(1);
    }));

    it("renderListFormData", pnpTest("353f681c-7054-474b-9108-4f24f64a605c", async function () {

        const listEnsure = await this.pnp.sp.web.lists.ensure("pnp testing renderListFormData");
        const list = listEnsure.list;
        await list.items.add({
            Title: "Item 1",
        });

        return expect(list.renderListFormData(1, "editform", ControlMode.Edit)).to.be.eventually.fulfilled;
    }));

    it("reserveListItemId", pnpTest("542fc1b7-cc2e-4bfb-ac2c-32b58fa42a13", function () {
        return expect(list.reserveListItemId()).to.eventually.be.fulfilled;
    }));

    it("contentTypes", pnpTest("b9e03933-dec3-49fb-9582-63c0fe3c9d3b", function () {
        return expect(list.contentTypes()).to.eventually.be.fulfilled;
    }));

    it("fields", pnpTest("9e644ed3-4ad4-42ed-8a2c-36352d8736b4", function () {
        return expect(list.fields()).to.eventually.be.fulfilled;
    }));

    it("rootFolder", pnpTest("49d3d76b-2dfb-4767-8d1c-378945c11673", function () {
        return expect(list.rootFolder()).to.eventually.be.fulfilled;
    }));

    it("items", pnpTest("a9b9b5ed-c110-439a-a0de-92e4e6378407", function () {
        return expect(list.items()).to.eventually.be.fulfilled;
    }));

    it("views", pnpTest("f0e37bd6-9d5d-4ae4-b002-48711877324c", async function () {
        const defaultView = await list.defaultView();
        expect(list.getView(defaultView.Id));
        return expect(list.views()).to.eventually.be.fulfilled;
    }));

    it("subscriptions", pnpTest("c2e106ab-0d1f-42b8-9abe-af303dc2b7ff", function () {
        return expect(list.subscriptions()).to.eventually.be.fulfilled;
    }));

    it("userCustomActions", pnpTest("5f2ac55f-2fe1-4a0b-a68b-fed28a42e3a0", function () {
        return expect(list.userCustomActions()).to.eventually.be.fulfilled;
    }));

    it("delete", pnpTest("85e8fb0d-aa51-440d-8976-81bc6529cb25", async function () {
        const result = await this.pnp.sp.web.lists.add("pnp testing delete");
        const list = this.pnp.sp.web.lists.getById(result.Id);
        return expect(list.delete()).to.eventually.be.fulfilled;
    }));
});
