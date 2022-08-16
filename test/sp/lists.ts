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
import { IList, IRenderListDataParameters, ControlMode, IListEnsureResult, ICamlQuery, IChangeLogItemQuery, RenderListDataOptions } from "@pnp/sp/lists";
import { getRandomString } from "@pnp/core";
import testSPInvokables from "../test-invokable-props.js";
import { Context } from "mocha";

describe("Lists", function () {

    let list;
    before(function () {

        if (!this.pnp.settings.enableWebTests) {
            this.skip();
        }
        list = this.pnp.sp.web.lists.getByTitle("Documents");
    });

    describe("Invokable Properties", testSPInvokables(() => list,
        "effectiveBasePermissions",
        "eventReceivers",
        "relatedFields",
        "informationRightsManagementSettings",
        "getParentInfos"));

    it("getById", async function () {
        const list = await this.pnp.sp.web.lists.getByTitle("Documents").select("ID")<{ Id: string }>();
        const title = await this.pnp.sp.web.lists.getById(list.Id).select("Title")<{ Title: string }>();
        return expect(title).to.have.property("Title");
    });

    it("getByTitle", async function () {
        return expect(this.pnp.sp.web.lists.getByTitle("Documents").select("Title")()).to.eventually.be.fulfilled;
    });

    it("add 1", function () {
        const title = `pnp testing add 1 ${getRandomString(4)}`;
        return expect(this.pnp.sp.web.lists.add(title, title)).to.eventually.be.fulfilled;
    });

    it("add 2", function () {
        const title = `pnp testing add 2 ${getRandomString(4)}`;
        return expect(this.pnp.sp.web.lists.add(title, title, 101, true, <any>{ OnQuickLaunch: true })).to.eventually.be.fulfilled;
    });

    it("ensure", async function () {
        const title = "pnp testing ensure";
        return expect(this.pnp.sp.web.lists.ensure(title)).to.eventually.be.fulfilled;
    });

    it("ensure with too long title", async function () {
        const title = getRandomString(512);
        return expect(this.pnp.sp.web.lists.ensure(title)).to.eventually.be.rejected;
    });

    it("ensure fail update already existing list", async function () {
        const title = "pnp testing ensure fail update already existing list";
        await this.pnp.sp.web.lists.ensure(title);
        return expect(this.pnp.sp.web.lists.ensure(title, title, 100, false, <any>{ RandomPropertyThatDoesntExistOnObject: "RandomValue" })).to.eventually.be.rejected;
    });

    it("ensure with additional settings", async function () {
        const title = "pnp testing ensure with additional settings";
        return expect(this.pnp.sp.web.lists.ensure(title, title, 101, true, <any>{ OnQuickLaunch: true })).to.eventually.be.fulfilled;
    });

    it("ensure existing list with additional settings", async function () {
        const title = "pnp testing ensure existing list with additional settings";
        await this.pnp.sp.web.lists.ensure(title);
        return expect(this.pnp.sp.web.lists.ensure(title, title, 101, true, <any>{ OnQuickLaunch: true })).to.eventually.be.fulfilled;
    });

    it("ensure already existing list", async function () {
        const title = "pnp testing ensure";
        await this.pnp.sp.web.lists.ensure(title);
        return expect(this.pnp.sp.web.lists.ensure(title)).to.eventually.be.fulfilled;
    });

    it("ensureSiteAssetsLibrary", function () {
        return expect(this.pnp.sp.web.lists.ensureSiteAssetsLibrary()).to.eventually.be.fulfilled;
    });

    it("ensureSitePagesLibrary", function () {
        return expect(this.pnp.sp.web.lists.ensureSitePagesLibrary()).to.eventually.be.fulfilled;
    });
});

describe("List", function () {

    let list: IList;

    before(function () {

        if (!this.pnp.settings.enableWebTests) {
            this.skip();
        }
    });

    beforeEach(async function () {
        list = await this.pnp.sp.web.lists.getByTitle("Documents");
    });

    it("effectiveBasePermissions", async function () {
        const listEnsure: IListEnsureResult = await this.pnp.sp.web.lists.ensure("pnp testing effectiveBasePermissions");
        return expect(listEnsure.list.effectiveBasePermissions()).to.eventually.be.fulfilled;
    });

    it("eventReceivers", async function () {
        const listEnsure: IListEnsureResult = await this.pnp.sp.web.lists.ensure("pnp testing eventReceivers");
        return expect(listEnsure.list.eventReceivers()).to.eventually.be.fulfilled;
    });

    it("relatedFields", async function () {
        const listEnsure: IListEnsureResult = await this.pnp.sp.web.lists.ensure("pnp testing relatedFields");
        return expect(listEnsure.list.relatedFields()).to.eventually.be.fulfilled;
    });

    it("informationRightsManagementSettings", async function () {
        const listEnsure: IListEnsureResult = await this.pnp.sp.web.lists.ensure("pnp testing informationRightsManagementSettings");
        return expect(listEnsure.list.informationRightsManagementSettings()).to.eventually.be.fulfilled;
    });

    it("update", async function () {
        const listEnsure: IListEnsureResult = await this.pnp.sp.web.lists.ensure("pnp testing update");
        const newTitle = "New title after update";
        return expect(listEnsure.list.update({ Title: newTitle })).to.eventually.be.fulfilled;
    });

    it("getChanges", async function () {
        const listEnsure: IListEnsureResult = await this.pnp.sp.web.lists.ensure("pnp testing getChanges");
        return expect(listEnsure.list.getChanges({
            Add: true,
            DeleteObject: true,
            Restore: true,
        })).to.eventually.be.fulfilled;
    });

    it("getItemsByCAMLQuery", async function () {
        const listEnsure: IListEnsureResult = await this.pnp.sp.web.lists.ensure("pnp testing getItemsByCAMLQuery");
        const caml: ICamlQuery = {
            ViewXml: "<View><ViewFields><FieldRef Name='Title' /><FieldRef Name='RoleAssignments' /></ViewFields><RowLimit>5</RowLimit></View>",
        };
        return expect(listEnsure.list.getItemsByCAMLQuery(caml, "RoleAssignments")).to.eventually.be.fulfilled;
    });

    it("getListItemChangesSinceToken", async function () {
        const listEnsure: IListEnsureResult = await this.pnp.sp.web.lists.ensure("pnp testing getListItemChangesSinceToken");
        const query: IChangeLogItemQuery = {
            Contains: "<Contains><FieldRef Name=\"Title\"/><Value Type=\"Text\">Testing</Value></Contains>",
            // eslint-disable-next-line max-len
            QueryOptions: "<QueryOptions><IncludeMandatoryColumns>FALSE</IncludeMandatoryColumns><DateInUtc>False</DateInUtc><IncludePermissions>TRUE</IncludePermissions><IncludeAttachmentUrls>FALSE</IncludeAttachmentUrls><Folder>Shared Documents/Test1</Folder></QueryOptions>",
        };
        return expect(listEnsure.list.getListItemChangesSinceToken(query)).to.eventually.be.fulfilled;
    });

    it("recycle", async function () {
        const listEnsure: IListEnsureResult = await this.pnp.sp.web.lists.ensure("pnp testing recycle");
        const recycleResponse = await listEnsure.list.recycle();
        if (typeof recycleResponse !== "string") {
            throw Error("Expected a string returned from recycle.");
        }
        return expect(listEnsure.list.select("Title")()).to.eventually.be.rejected;
    });

    it("renderListData", async function () {
        const listEnsure: IListEnsureResult = await this.pnp.sp.web.lists.ensure("pnp testing renderListData");
        await listEnsure.list.items.add({
            Title: "Item 1",
        });
        await listEnsure.list.items.add({
            Title: "Item 2",
        });
        await listEnsure.list.items.add({
            Title: "Item 3",
        });

        return expect(listEnsure.list.renderListData("<View><RowLimit>5</RowLimit></View>")).to.eventually.have.property("Row").that.is.not.empty;
    });

    const setupRenderListDataAsStream = async function (this: Context): Promise<IList> {

        const listEnsure: IListEnsureResult = await this.pnp.sp.web.lists.ensure("pnp testing renderListDataAsStream");

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

    it("renderListDataAsStream", async function () {

        const rList = await setupRenderListDataAsStream.call(this);

        const renderListDataParams: IRenderListDataParameters = {
            ViewXml: "<View><RowLimit>5</RowLimit></View>",
        };

        return expect(rList.renderListDataAsStream(renderListDataParams)).to.eventually.have.property("Row").that.is.not.empty;
    });

    it("renderListDataAsStream - advanced options", async function () {

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
    });

    it("renderListDataAsStream - no override params", async function () {

        const rList = await setupRenderListDataAsStream.call(this);

        const renderListDataParams: IRenderListDataParameters = {
            AddRequiredFields: true,
            ViewXml: "<View><RowLimit>5</RowLimit></View>",
        };

        return expect(rList.renderListDataAsStream(renderListDataParams)).to.eventually.be.fulfilled;
    });

    it("renderListDataAsStream - query params", async function () {

        const rList = await setupRenderListDataAsStream.call(this);

        const renderListDataParams: IRenderListDataParameters = {
            AddRequiredFields: false,
            ViewXml: "<View><RowLimit>5</RowLimit></View>",
        };

        const r = await rList.renderListDataAsStream(renderListDataParams, {}, new Map([["FilterField1", "Title"], ["FilterValue1", "Item 2"]]));

        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        expect(r).to.not.be.null;
        expect(r.Row.length).to.eq(1);
    });

    it("renderListFormData", async function () {

        const listEnsure: IListEnsureResult = await this.pnp.sp.web.lists.ensure("pnp testing renderListFormData");

        await listEnsure.list.items.add({
            Title: "Item 1",
        });

        return expect(listEnsure.list.renderListFormData(1, "editform", ControlMode.Edit)).to.be.eventually.fulfilled;
    });

    it("reserveListItemId", function () {
        return expect(list.reserveListItemId()).to.eventually.be.fulfilled;
    });

    it("contentTypes", function () {
        return expect(list.contentTypes()).to.eventually.be.fulfilled;
    });

    it("fields", function () {
        return expect(list.fields()).to.eventually.be.fulfilled;
    });

    it("rootFolder", function () {
        return expect(list.rootFolder()).to.eventually.be.fulfilled;
    });

    it("items", function () {
        return expect(list.items()).to.eventually.be.fulfilled;
    });

    it("views", async function () {
        const defaultView = await list.defaultView();
        expect(list.getView(defaultView.Id));
        return expect(list.views()).to.eventually.be.fulfilled;
    });

    it("subscriptions", function () {
        return expect(list.subscriptions()).to.eventually.be.fulfilled;
    });

    it("userCustomActions", function () {
        return expect(list.userCustomActions()).to.eventually.be.fulfilled;
    });

    it("delete", async function () {
        const result = await this.pnp.sp.web.lists.add("pnp testing delete");
        return expect(result.list.delete()).to.eventually.be.fulfilled;
    });
});
