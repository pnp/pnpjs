import { expect } from "chai";
import { getRandomString, combine, stringIsNullOrEmpty } from "@pnp/core";
import "@pnp/sp/webs";
import "@pnp/sp/site-users";
import "@pnp/sp/clientside-pages";
import "@pnp/sp/comments/clientside-page";
import "@pnp/sp/files";
import { ClientsidePageFromFile, ClientsideText, CreateClientsidePage, ClientsideWebpart, IClientsidePage, PromotedState } from "@pnp/sp/clientside-pages";
import { pnpTest } from "../pnp-test.js";

describe("Clientside Pages", function () {

    let relUrl = "";

    before(pnpTest("a5609892-9914-4f38-a027-43b8f4657c64", function () {

        if (!this.pnp.settings.enableWebTests) {
            this.skip();
        }

        relUrl = "/" + this.pnp.settings.sp.testWebUrl.substring(this.pnp.settings.sp.testWebUrl.indexOf("/sites/"));
    }));

    it("web.addClientSidePage", pnpTest("6568ed4b-49be-4f0c-bfd4-f7bc7553cf90", async function () {

        let pageName = `TestingAdd_${getRandomString(4)}.aspx`;
        let pageUrl = combine(relUrl, "SitePages", pageName);

        ({ pageName, pageUrl } = await this.props({
            pageName,
            pageUrl,
        }));

        await this.pnp.sp.web.addClientsidePage(pageName);
        const page = await this.pnp.sp.web.getFileByServerRelativePath(pageUrl)();
        return expect(page.Name).to.equal(pageName);
    }));

    it("CreateClientSidePage", pnpTest("0ef241e9-18cd-47f3-b67c-bbdf52d627b3", async function () {

        const { pageName } = await this.props({
            pageName: `Testing_${getRandomString(4)}.aspx`,
        });

        return expect(CreateClientsidePage(this.pnp.sp.web, pageName, "title")).to.eventually.be.fulfilled;
    }));

    it("web.addClientSidePage - promoted state 1", pnpTest("4da9ec14-4b01-42de-87f3-cf4ce4c9ac02", async function () {

        const { pageName } = await this.props({
            pageName: `Testing_${getRandomString(4)}.aspx`,
        });

        const p = await this.pnp.sp.web.addClientsidePage(pageName, "A Title", "Article", PromotedState.PromoteOnPublish);
        return expect(p.save(true)).to.eventually.be.fulfilled;
    }));

    it("CreateClientSidePage - promoted state 1", pnpTest("90c449f4-ce63-46d8-81c6-0241d3f250f8", async function () {

        const { pageName } = await this.props({
            pageName: `Testing_${getRandomString(4)}.aspx`,
        });

        const p = await CreateClientsidePage(this.pnp.sp.web, pageName, "title", "Article", PromotedState.PromoteOnPublish);
        return expect(p.save(true)).to.eventually.be.fulfilled;
    }));

    it("CreateClientSidePage - SingleWebPartAppPage", pnpTest("fb024220-e201-4390-ae73-85c0904952e2", async function () {

        const { pageName } = await this.props({
            pageName: `Testing_${getRandomString(4)}.aspx`,
        });

        const promise = CreateClientsidePage(this.pnp.sp.web, pageName, "SingleWebPartAppPage", "SingleWebPartAppPage");
        return expect(promise).to.eventually.be.fulfilled;
    }));

    it("load", pnpTest("e2f8044b-ca7e-4f53-8111-1ba7e21da147", async function () {

        // need to make the path relative
        const rel = this.pnp.settings.sp.testWebUrl.substring(this.pnp.settings.sp.testWebUrl.indexOf("/sites/"));
        let pageName = `Testing_${getRandomString(4)}.aspx`;
        let serverRelativePath = combine("/", rel, "SitePages", pageName);

        ({ pageName, serverRelativePath } = await this.props({
            pageName,
            serverRelativePath,
        }));

        await this.pnp.sp.web.addClientsidePage(pageName);

        const promise = ClientsidePageFromFile(this.pnp.sp.web.getFileByServerRelativePath(serverRelativePath));

        return expect(promise).to.eventually.be.fulfilled;
    }));

    describe("web", async function () {

        let page: IClientsidePage;

        let pageName = `Testing_${getRandomString(4)}.aspx`;

        before(pnpTest("e2d650c4-8f4f-4e97-a218-615686d86af3", async function () {

            ({ pageName } = await this.props({
                pageName,
            }));

            page = await this.pnp.sp.web.addClientsidePage(pageName);
            await page.save();
        }));

        it("can load a page", pnpTest("635f61a7-ba57-46e7-8d01-0a5d09da5fce", async function () {

            const { serverRelativePath } = await this.props({
                serverRelativePath: combine("/", this.pnp.settings.sp.testWebUrl.substring(this.pnp.settings.sp.testWebUrl.indexOf("/sites/")), "SitePages", pageName),
            });

            page = await this.pnp.sp.web.loadClientsidePage(serverRelativePath);

            return expect(page).to.not.be.null.and.not.undefined;
        }));

        it("getClientsideWebParts", pnpTest("e71abe9f-8487-4609-8b7b-347b8baeedf4", async function () {

            const parts = await this.pnp.sp.web.getClientsideWebParts();

            return expect(Array.isArray(parts)).to.be.true;
        }));
    });

    describe("promoteToNews", async function () {

        let page: IClientsidePage;

        let pageName = `Testing_${getRandomString(4)}.aspx`;

        before(pnpTest("7362da9e-b1ec-452e-a62b-427b7db629c5", async function () {

            ({ pageName } = await this.props({
                pageName,
            }));

            page = await this.pnp.sp.web.addClientsidePage(pageName);
            await page.save();
        }));

        it("can promote a page", pnpTest("19e48288-de59-4ddd-8605-98d665666ebe", async function () {

            return expect(page.promoteToNews()).to.eventually.be.fulfilled.and.eq(true);
        }));
    });

    describe("save", function () {

        it("Should update a pages content with a text control", pnpTest("aa9422af-42dd-4602-93e4-405e8752b66c", async function () {

            const { pageName } = await this.props({
                pageName: `Testing_${getRandomString(4)}.aspx`,
            });

            const page = await this.pnp.sp.web.addClientsidePage(pageName);

            page.addSection().addControl(new ClientsideText("This is test text!!!"));

            return expect(page.save()).to.eventually.be.fulfilled;
        }));

        it("Should update a pages content with an embed control", pnpTest("0fb03b75-aee7-48f6-b6ef-d3fbf8ac1002", async function () {

            const { pageName } = await this.props({
                pageName: `Testing_${getRandomString(4)}.aspx`,
            });

            const parts = await this.pnp.sp.web.getClientsideWebParts();

            const page = await this.pnp.sp.web.addClientsidePage(pageName);

            const part = ClientsideWebpart.fromComponentDef(parts.filter(c => c.Id === "490d7c76-1824-45b2-9de3-676421c997fa")[0]);

            part.setProperties<{ embedCode: string }>({
                embedCode: "https://www.youtube.com/watch?v=IWQFZ7Lx-rg",
            });

            page.addSection().addControl(part);

            return expect(page.save()).to.eventually.be.fulfilled;
        }));
    });

    describe("Page comments", function () {

        let page: IClientsidePage;


        before(pnpTest("b80fae1e-a58a-4d6b-98d3-c2d0720ed933", async function () {

            const { pageName } = await this.props({
                pageName: `Testing_${getRandomString(4)}.aspx`,
            });

            page = await this.pnp.sp.web.addClientsidePage(pageName);
        }));

        it("Should disable", pnpTest("c3083030-e388-4c80-ba57-8e19ed7972ff", function () {
            return expect(page.disableComments()).to.eventually.be.fulfilled;
        }));

        it("Should enable", pnpTest("be419790-af16-4e69-9572-2ee8629e7061", function () {
            return expect(page.enableComments()).to.eventually.be.fulfilled;
        }));
    });

    describe("Sections and Columns", function () {

        it("Default section, 2 empty columns", pnpTest("43db593c-1b24-4c71-922c-ff9f9dad63c4", async function () {

            const { pageName } = await this.props({
                pageName: `Testing_${getRandomString(4)}.aspx`,
            });

            const page = await this.pnp.sp.web.addClientsidePage(pageName);

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
        }));

        it("vertical section", pnpTest("0b2ba60a-9548-445d-a152-b1c590743c52", async function () {

            const { pageName } = await this.props({
                pageName: `Testing_${getRandomString(4)}.aspx`,
            });

            let page = await this.pnp.sp.web.addClientsidePage(pageName);

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

            const webData = await this.pnp.sp.web.select("ServerRelativeUrl")();

            // we need a full reload
            page = await this.pnp.sp.web.loadClientsidePage(combine("/", webData.ServerRelativeUrl, (<any>page).json.Path.DecodedUrl));

            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            expect(page.hasVerticalSection).to.be.true;
            expect(page.verticalSection.columns[0].controls.length).to.eq(2);
            const ctrl = <ClientsideText>page.verticalSection.columns[0].controls[1];
            expect(ctrl.text).to.match(/I'm second\./);
        }));

        it("vertical section 2", pnpTest("28650f70-34d3-4ee4-bdd9-3246abc02f8b", async function () {

            const { pageName } = await this.props({
                pageName: `Testing_${getRandomString(4)}.aspx`,
            });

            let page = await this.pnp.sp.web.addClientsidePage(pageName);

            page.addVerticalSection();
            page.verticalSection.addControl(new ClientsideText("Hello."));
            page.verticalSection.addControl(new ClientsideText("I'm second."));

            // save
            await page.save();
            // load to update the data with correct url
            await page.load();

            const webData = await this.pnp.sp.web.select("ServerRelativeUrl")();

            // we need a full reload
            page = await this.pnp.sp.web.loadClientsidePage(combine("/", webData.ServerRelativeUrl, (<any>page).json.Path.DecodedUrl));

            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            expect(page.hasVerticalSection).to.be.true;
            expect(page.verticalSection.columns[0].controls.length).to.eq(2);
            const ctrl = <ClientsideText>page.verticalSection.columns[0].controls[1];
            return expect(ctrl.text).to.match(/I'm second\./);
        }));
    });

    describe("like and unlike", function () {

        let page: IClientsidePage;

        before(pnpTest("27847784-e94e-4ca7-b758-e961c501efd3", async function () {

            const { pageName } = await this.props({
                pageName: `Testing_${getRandomString(4)}.aspx`,
            });

            page = await this.pnp.sp.web.addClientsidePage(pageName);
        }));

        it("like()", pnpTest("9e9d6ac7-6ace-4da6-92f0-bdfbd98a8bce", function () {
            return expect(page.like()).to.eventually.be.fulfilled;
        }));

        it("unlike()", pnpTest("d46ddf48-d7db-491c-bc82-d39160174faf", function () {
            return expect(page.unlike()).to.eventually.be.fulfilled;
        }));

        it("getLikedByInformation", pnpTest("8888a05d-470f-4c78-9edb-53b4fd218716", function () {
            return expect(page.getLikedByInformation()).to.eventually.be.fulfilled;
        }));
    });

    describe("author", function () {

        let page: IClientsidePage;
        let userId: number;
        let userPrincipalName: string;
        let pageUrl: string;

        before(pnpTest("fdaca695-c427-4eaf-9091-7bed1543dad7", async function () {

            if (stringIsNullOrEmpty(this.pnp.settings.testUser)) {
                this.skip();
            }

            const { pageName } = await this.props({
                pageName: `Testing_${getRandomString(4)}.aspx`,
            });

            page = await this.pnp.sp.web.addClientsidePage(pageName);
            await page.save();
            // we need the updated url info from the published page so we re-load things.
            await page.load();

            const serverRelUrl = (await this.pnp.sp.web.select("ServerRelativeUrl")()).ServerRelativeUrl;
            pageUrl = combine("/", serverRelUrl, (<any>page).json.Url);

            const ensureTestUser = await this.pnp.sp.web.ensureUser(this.pnp.settings.testUser);
            userId = ensureTestUser.data.Id;
            userPrincipalName = ensureTestUser.data.Email;
        }));

        it("setAuthorById()", pnpTest("d57adc36-191a-43bc-9992-b6f236ae1db7", async function () {

            await page.setAuthorById(userId);
            await page.save();

            const page2 = await this.pnp.sp.web.loadClientsidePage(pageUrl);
            expect(page2.authorByLine).to.eq(userPrincipalName);
        }));

        it("setAuthorByLoginName()", pnpTest("8eb5897e-8b43-45ba-acbc-468495e189fe", async function () {

            await page.setAuthorByLoginName(this.pnp.settings.testUser);
            await page.save();

            const page2 = await this.pnp.sp.web.loadClientsidePage(pageUrl);

            expect(page2.authorByLine).to.eq(userPrincipalName);
        }));
    });

    describe("description", function () {

        let page: IClientsidePage;
        let pageUrl: string;

        before(pnpTest("b630f9a6-73cb-49ca-a9ca-3b3453683e30", async function () {

            const { pageName } = await this.props({
                pageName: `Testing_${getRandomString(4)}.aspx`,
            });

            page = await this.pnp.sp.web.addClientsidePage(pageName);
            await page.save();
            // we need the updated url info from the published page so we re-load things.
            await page.load();

            const serverRelUrl = (await this.pnp.sp.web.select("ServerRelativeUrl")()).ServerRelativeUrl;
            pageUrl = combine("/", serverRelUrl, (<any>page).json.Url);
        }));

        it("set", pnpTest("d4f67a65-564a-4fe3-908c-124116f76c65", async function () {

            const { description } = await this.props({
                description: `Test Desc ${getRandomString(10)}`,
            });

            page.description = description;
            await page.save();

            const page2 = await this.pnp.sp.web.loadClientsidePage(pageUrl);

            expect(page2.description).to.eq(description);
        }));
    });
});
