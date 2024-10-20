import { expect } from "chai";
import { getRandomString, stringIsNullOrEmpty } from "@pnp/core";
import { pnpTest } from "../pnp-test.js";
import "@pnp/graph/groups";
import "@pnp/graph/sites";
import "@pnp/graph/users";
import "@pnp/graph/onenote";
import "@pnp/graph/files";
import getValidUser from "./utilities/getValidUser.js";

describe("OneNote", function () {
    let notebookId: string;
    let testUserName: string;

    before(async function () {

        if (!this.pnp.settings.enableWebTests || stringIsNullOrEmpty(this.pnp.settings.testUser)) {
            this.skip();
        }

        const userInfo = await getValidUser.call(this);
        testUserName = userInfo.userPrincipalName;
        const notebook = await this.pnp.graph.users.getById(testUserName).onenote.notebooks.add(getRandomString(10));
        if(notebook != null){
            notebookId = notebook.id;
        }
        if (stringIsNullOrEmpty(notebookId)) {
            this.skip();
        }
    });

    after(async function  () {
        if (!stringIsNullOrEmpty(notebookId)) {
            try {
                const notebookFolder = await this.pnp.graph.users.getById(testUserName).drive.getItemByPath("notebooks").children();
                if(notebookFolder.length > 0){
                    // Delete all notebooks
                    for(let i=0; i<notebookFolder.length; i++){
                        await this.pnp.graph.users.getById(testUserName).drive.getItemById(notebookFolder[i].id).delete();
                    }
                }
            } catch (err) {
                console.error(`Cannot clean up test property: ${notebookId}`);
            }
        }
        return;
    });

    it("List notebooks", pnpTest("9d0fe4b3-dc62-4699-be83-cc6f72daa62", async function () {
        const oneNoteNoteBooks = await this.pnp.graph.users.getById(testUserName).onenote.notebooks();
        return expect(oneNoteNoteBooks).to.be.an("array");
    }));

    it.skip("List recent notebooks", pnpTest("769fbaf2-d92b-47aa-a2f5-6fccfc569b4d", async function () {
        const oneNoteNoteBooks = await this.pnp.graph.users.getById(testUserName).onenote.notebooks.recent();
        return expect(oneNoteNoteBooks).to.be.an("array");
    }));

    it("Notebooks getById()", pnpTest("9e75f0cf-9940-4988-b05f-2aff019e8296", async function () {
        const notebookById = await this.pnp.graph.users.getById(testUserName).onenote.notebooks.getById(notebookId)();
        return expect(notebookById.id).is.not.null;
    }));

    it("Add notebook", pnpTest("81c342d9-d943-4a18-a8c3-828ef090d447", async function () {
        const oneNodeNotebooksAdd = await this.pnp.graph.users.getById(testUserName).onenote.notebooks.add(getRandomString(10));
        return expect(oneNodeNotebooksAdd.id).is.not.null;
    }));

    it("List sections", pnpTest("ca8871f8-c90e-48e4-8909-39f42884ea2c", async function () {
        const sections = await this.pnp.graph.users.getById(testUserName).onenote.sections();
        return expect(sections).to.be.an("array");
    }));

    // TODO: Seeing if there's something we can do but throwing 500 errors
    it.skip("Notebook copy", pnpTest("aa57039b-4c75-437d-92ae-bb2a06c7b802", async function () {
        const notebooks = await this.pnp.graph.users.getById(testUserName).onenote.notebooks();
        if (notebooks.length > 0) {
            const copy = await this.pnp.graph.users.getById(testUserName).onenote.notebooks.getById(notebooks[0].id).copy({ renameAs: getRandomString(10) });
            return expect(copy.id).is.not.null;
        }
        this.skip();
    }));

    // TODO: Seeing if there's something we can do but throwing 500 errors
    it.skip("Section copyToNotebook()", pnpTest("b5cc2f9b-0a19-4d42-a041-1a68a2cfd915", async function () {
        const section = await this.pnp.graph.users.getById(testUserName).onenote.notebooks.getById(notebookId).sections.add(getRandomString(10));
        if (section) {
            const copy = await this.pnp.graph.users.getById(testUserName).onenote.sections.getById(section.id).copyToNotebook({ id: notebookId, renameAs: getRandomString(10) });
            return expect(copy.id).is.not.null;
        }
        this.skip();
    }));

    // TODO: Seeing if there's something we can do but throwing 500 errors
    it.skip("Section copyToSectionGroup()", pnpTest("b48e5d00-7806-4bde-96fe-1650dea1e1e4", async function () {
        const section = await this.pnp.graph.users.getById(testUserName).onenote.notebooks.getById(notebookId).sections.add(getRandomString(10));
        const group = await this.pnp.graph.users.getById(testUserName).onenote.notebooks.getById(notebookId).sectionGroups.add(getRandomString(10));
        if (section.id && group.id) {
            const copy = await this.pnp.graph.users.getById(testUserName).onenote.sections.getById(section.id).copyToSectionGroup({ id: group.id, renameAs: getRandomString(5) });
            return expect(copy.id).is.not.null;
        }
        this.skip();
    }));

    // doesn't work well with large onenotes.
    it.skip("List pages", pnpTest("77d47760-0371-4045-898d-6a95d8e42cca", async function () {
        const pages = await this.pnp.graph.users.getById(testUserName).onenote.pages();
        return expect(pages).to.be.an("array");
    }));

    // doesn't work well with large onenotes.
    it.skip("Pages getById()", pnpTest("fcd78bde-69a0-4331-8aa4-389bba222963", async function () {
        const pages = await this.pnp.graph.users.getById(testUserName).onenote.pages();
        if (pages.length > 0) {
            const page = await this.pnp.graph.users.getById(testUserName).onenote.pages.getById(pages[0].id)();
            return expect(page.id).is.not.null;
        }
        this.skip();
    }));

    it("Pages copyToSection", pnpTest("e8c21973-8d90-4bc4-947f-ef39198832dd", async function () {
        const section = await this.pnp.graph.users.getById(testUserName).onenote.notebooks.getById(notebookId).sections.add(getRandomString(10));
        const pages = await this.pnp.graph.users.getById(testUserName).onenote.sections.getById(section.id).pages();
        if (section.id && pages.length > 0) {
            const pageCopy = await this.pnp.graph.users.getById(testUserName).onenote.sections.getById(section.id).pages.getById(pages[0].id).copyToSection({ id: section.id });
            return expect(pageCopy).to.be.fulfilled;
        }

        this.skip();
    }));

    it("Add page", pnpTest("60a4fd91-3f6b-4f6f-a5bb-e11f57186eaf", async function () {
        const section = await this.pnp.graph.users.getById(testUserName).onenote.notebooks.getById(notebookId).sections.add(getRandomString(10));
        if (section.id) {
            const pageData = `<!DOCTYPE html>
                <html>
                <head>
                    <title>A page with <i>rendered</i> images and an <b>attached</b> file</title>
                    <meta name="created" content="2015-07-22T09:00:00-08:00" />
                </head>
                <body>
                    <p>Here's an image from an online source:</p>
                    <img src="https://..." alt="an image on the page" width="500" />
                    <p>Here's an image uploaded as binary data:</p>
                    <img src="name:imageBlock1" alt="an image on the page" width="300" />
                    <p>Here's a file attachment:</p>
                    <object data-attachment="FileName.pdf" data="name:fileBlock1" type="application/pdf" />
                </body>
                </html>`;
            const page = await this.pnp.graph.users.getById(testUserName).onenote.pages.add(pageData);
            return expect(page.id).is.not.null;
        }
        this.skip();
    }));

    it("Sections list pages", pnpTest("5f44bc04-6119-432e-ac92-602085c4dc91", async function () {
        const section = await this.pnp.graph.users.getById(testUserName).onenote.notebooks.getById(notebookId).sections.add(getRandomString(10));
        if (section.id) {
            const pages = await this.pnp.graph.users.getById(testUserName).onenote.sections.getById(section.id).pages();
            return expect(pages).to.be.an("array");
        }
        this.skip();
    }));


    it("Sections add page", pnpTest("48744c5a-999a-40fb-9ab8-9d06e0b544a2", async function () {
        const section = await this.pnp.graph.users.getById(testUserName).onenote.notebooks.getById(notebookId).sections.add(getRandomString(10));
        if (section.id) {
            const pageData = `<!DOCTYPE html>
                <html>
                <head>
                    <title>A page with <i>rendered</i> images and an <b>attached</b> file</title>
                    <meta name="created" content="2015-07-22T09:00:00-08:00" />
                </head>
                <body>
                    <p>Here's an image from an online source:</p>
                    <img src="https://..." alt="an image on the page" width="500" />
                    <p>Here's an image uploaded as binary data:</p>
                    <img src="name:imageBlock1" alt="an image on the page" width="300" />
                    <p>Here's a file attachment:</p>
                    <object data-attachment="FileName.pdf" data="name:fileBlock1" type="application/pdf" />
                </body>
                </html>`;
            const page = await this.pnp.graph.users.getById(testUserName).onenote.sections.getById(section.id).pages.add(pageData);
            return expect(page.id).is.not.null;
        }
        this.skip();
    }));

    it("List section groups", pnpTest("df461253-a206-4ebf-b993-5b7a76d2ee5b", async function () {
        const sectionGroups = await this.pnp.graph.users.getById(testUserName).onenote.sectionGroups();
        return expect(sectionGroups).to.be.an("array");
    }));

    it("SectionGroups getById()", pnpTest("4dd65bad-d8db-4b05-984a-ec06cd650c62", async function () {
        const sectionGroups = await this.pnp.graph.users.getById(testUserName).onenote.sectionGroups();
        if (sectionGroups.length > 0) {
            const section = await this.pnp.graph.users.getById(testUserName).onenote.sectionGroups.getById(sectionGroups[0].id)();
            return expect(section.id).is.not.null;
        }
        this.skip();
    }));

    it("List section groups sections", pnpTest("ef961253-a206-4ebf-b993-5a1a76d2ff5b", async function () {
        const sectionGroups = await this.pnp.graph.users.getById(testUserName).onenote.sectionGroups();
        if (sectionGroups.length > 0) {
            const sections = await this.pnp.graph.users.getById(testUserName).onenote.sectionGroups.getById(sectionGroups[0].id).sections();
            return expect(sections).to.be.an("array");
        }
        this.skip();
    }));

    // TODO: Seeing if there's something we can do but throwing 500 errors
    it.skip("Create section in section group", pnpTest("4959895e-404f-4068-bf5f-85b0d2db9bcf", async function () {
        const sectionGroups = await this.pnp.graph.users.getById(testUserName).onenote.sectionGroups();
        if (sectionGroups.length > 0) {
            const section = await this.pnp.graph.users.getById(testUserName).onenote.sectionGroups.getById(sectionGroups[0].id).sections.add(getRandomString(10));
            return expect(section.id).is.not.null;
        }
        this.skip();
    }));

    describe("Notebook", function () {
        it("List sections", pnpTest("b746d08e-f07d-4df2-82a3-7e1c7522bef8", async function () {
            const sections = await this.pnp.graph.users.getById(testUserName).onenote.notebooks.getById(notebookId).sections();
            return expect(sections).to.be.an("array");
        }));

        it("Add section", pnpTest("1298ee0d-0566-4144-ab56-d8e3c89654c7", async function () {
            const section = await this.pnp.graph.users.getById(testUserName).onenote.notebooks.getById(notebookId).sections.add(getRandomString(10));
            return expect(section.id).is.not.null;
        }));

        it("List section groups", pnpTest("66f3aeaa-e9d2-4b26-8894-6ed226e1f180", async function () {
            const sectionGroups = await this.pnp.graph.users.getById(testUserName).onenote.notebooks.getById(notebookId).sectionGroups();
            return expect(sectionGroups).to.be.an("array");
        }));

        it("Add section group", pnpTest("cb1d6d80-d5dc-4879-ac5a-288a5f0249ba", async function () {
            const sectionGroup = await this.pnp.graph.users.getById(testUserName).onenote.notebooks.getById(notebookId).sectionGroups.add(getRandomString(10));
            return expect(sectionGroup.id).is.not.null;
        }));
    });
});
