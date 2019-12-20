import { expect } from "chai";
import { testSettings } from "../main";
import { getRandomString, combine } from "@pnp/common";
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/clientside-pages";
import "@pnp/sp/comments/clientside-page";
import "@pnp/sp/files";
import { Web } from "@pnp/sp/webs";
import { ClientsidePageFromFile, ClientsideText, CreateClientsidePage, ClientsideWebpart, IClientsidePage } from "@pnp/sp/clientside-pages";


describe("Clientside Pages", () => {

    if (testSettings.enableWebTests) {

        it("web.addClientSidePage", function () {

            return expect(Web(testSettings.sp.webUrl).addClientsidePage(`TestingAdd_${getRandomString(4)}.aspx`)).to.eventually.be.fulfilled;
        });

        it("CreateClientSidePage", function () {

            return expect(CreateClientsidePage(Web(testSettings.sp.webUrl), `TestingAdd_${getRandomString(4)}.aspx`, "title")).to.eventually.be.fulfilled;
        });

        it("CreateClientSidePage - SingleWebPartAppPage", function () {

            const promise = CreateClientsidePage(Web(testSettings.sp.webUrl), `TestingAdd_${getRandomString(4)}.aspx`, "SingleWebPartAppPage", "SingleWebPartAppPage");
            return expect(promise).to.eventually.be.fulfilled;
        });

        it(".load", async function () {

            const pageFileName = `TestingLoad_${getRandomString(4)}.aspx`;

            await Web(testSettings.sp.webUrl).addClientsidePage(pageFileName);

            // need to make the path relative
            const rel = testSettings.sp.webUrl.substr(testSettings.sp.webUrl.indexOf("/sites/"));
            const promise = ClientsidePageFromFile(sp.web.getFileByServerRelativeUrl(combine("/", rel, "SitePages", pageFileName)));
            return expect(promise).to.eventually.be.fulfilled;
        });

        describe("web.loadClientsidePage", async function () {

            let page: IClientsidePage;

            const pageName = `TestingloadClientsidePage_${getRandomString(4)}.aspx`;

            before(async function () {
                this.timeout(0);
                page = await Web(testSettings.sp.webUrl).addClientsidePage(pageName);
                await page.save();
            });

            it("can load a page", async function () {

                const serverRelativePath = combine("/", testSettings.sp.webUrl.substr(testSettings.sp.webUrl.indexOf("/sites/")), "SitePages", pageName);

                page = await sp.web.loadClientsidePage(serverRelativePath);

                return expect(page).to.not.be.null.and.not.undefined;
            });
        });

        describe("promoteToNews", async function () {

            let page: IClientsidePage;

            const pageName = `TestingpromoteToNews_${getRandomString(4)}.aspx`;

            before(async function () {
                this.timeout(0);
                page = await Web(testSettings.sp.webUrl).addClientsidePage(pageName);
                await page.save();
            });

            it("can promote a page", async function () {

                return expect(page.promoteToNews()).to.eventually.be.fulfilled.and.eq(true);
            });
        });

        it("web.getClientsideWebParts", function () {
            return expect(sp.web.getClientsideWebParts()).to.eventually.be.fulfilled;
        });

        describe("save", function () {

            it("Should update a pages content with a text control", () => {
                return Web(testSettings.sp.webUrl).addClientsidePage(`TestingSave_${getRandomString(4)}.aspx`).then(page => {

                    page.addSection().addControl(new ClientsideText("This is test text!!!"));

                    return expect(page.save()).to.eventually.be.fulfilled;
                });
            });

            it("Should update a pages content with an embed control", function () {
                return Web(testSettings.sp.webUrl).getClientsideWebParts().then(parts => {

                    Web(testSettings.sp.webUrl).addClientsidePage(`TestingSave_${getRandomString(4)}.aspx`).then(page => {

                        const part = ClientsideWebpart.fromComponentDef(parts.filter(c => c.Id === "490d7c76-1824-45b2-9de3-676421c997fa")[0]);

                        part.setProperties<{ embedCode: string }>({
                            embedCode: "https://www.youtube.com/watch?v=IWQFZ7Lx-rg",
                        });

                        page.addSection().addControl(part);

                        return expect(page.save()).to.eventually.be.fulfilled;
                    });
                });
            });
        });

        describe("Page comments", function () {

            let page: IClientsidePage;

            before(async function () {
                this.timeout(0);
                page = await Web(testSettings.sp.webUrl).addClientsidePage(`TestingCommentToggle_${getRandomString(4)}.aspx`);
            });

            it("Should disable", function () {
                return expect(page.disableComments()).to.eventually.be.fulfilled;
            });

            it("Should enable", function () {
                return expect(page.enableComments()).to.eventually.be.fulfilled;
            });
        });

        describe("Sections and Columns", function () {

            let page: IClientsidePage;

            this.beforeEach(async function () {
                this.timeout(0);
                page = await Web(testSettings.sp.webUrl).addClientsidePage(`TestingSectionsAndColumns_${getRandomString(4)}.aspx`);
            });

            it("Default section, 2 empty columns", async function () {

                page.sections = [];
                await page.save();

                if (page.sections.length < 1) {
                    page.addSection();
                }

                page.sections[0].addColumn(6);
                page.sections[0].addColumn(6);

                // save
                await page.save();

                // reload
                await page.load();

                expect(page.sections.length === 1);
                expect(page.sections[0].columns.length === 2);
                expect(page.sections[0].columns[0].factor === 6);
                expect(page.sections[0].columns[1].factor === 6);
            });

            it("vertical section", async function () {

                page.sections = [];
                await page.save();

                if (page.sections.length < 1) {
                    page.addSection();
                }

                page.sections[0].addColumn(6);
                page.sections[0].addColumn(6);

                const vertSection = page.addVerticalSection();
                vertSection.addControl(new ClientsideText("Hello."));
                vertSection.addControl(new ClientsideText("I'm second."));

                // save
                await page.save();

                // reload
                await page.load();

                // tslint:disable-next-line:no-unused-expression
                expect(page.hasVerticalSection).to.be.true;
                expect(page.verticalSection.columns[0].controls.length).to.eq(2);
                const ctrl = <ClientsideText>page.verticalSection.columns[0].controls[1];
                expect(ctrl.text).to.match(/I'm second\./);
            });
        });

        describe("like and unlike", function () {

            let page: IClientsidePage;

            before(async function () {
                this.timeout(0);
                page = await Web(testSettings.sp.webUrl).addClientsidePage(`TestingLikeUnlike_${getRandomString(4)}.aspx`);
            });

            it(".like()", function () {
                return expect(page.like()).to.eventually.be.fulfilled;
            });

            it(".unlike()", function () {
                return expect(page.unlike()).to.eventually.be.fulfilled;
            });

            it(".getLikedByInformation", function () {
                return expect(page.getLikedByInformation()).to.eventually.be.fulfilled;
            });
        });
    }
});
