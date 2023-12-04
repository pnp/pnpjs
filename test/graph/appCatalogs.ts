import { expect } from "chai";
import "@pnp/graph/teams";
import "@pnp/graph/appCatalog";
import { pnpTest } from "../pnp-test.js";

describe.only("AppCatalog", function () {

    before(async function () {

        if (!this.pnp.settings.enableWebTests) {
            this.skip();
        }
    });

    it("teamsApps", pnpTest("32d84a70-52cb-47c8-8957-cda902c07d85", async function () {
        const apps = await this.pnp.graph.appCatalog.teamsApps();
        return expect(apps).to.be.an("array") && expect(apps[0]).to.haveOwnProperty("id");
    }));

    it("teamsApps - getById()", pnpTest("17bfb2cd-8fd3-41d3-a387-2fcf410b7100", async function () {
        let passed = false;
        const apps = await this.pnp.graph.appCatalog.teamsApps();
        if (apps.length > 0) {
            const app = await this.pnp.graph.appCatalog.teamsApps.getById(apps[0].id)();
            passed = (app.id === apps[0].id);
        }
        return expect(passed).is.true;
    }));

    it("appDefinitions", pnpTest("63c8ef41-067f-4f58-bd78-9b5d8d60b5b4", async function () {
        const apps = await this.pnp.graph.appCatalog.teamsApps();
        const appDefinitions = await this.pnp.graph.appCatalog.teamsApps.getById(apps[0].id).appDefinitions();
        return expect(appDefinitions).to.be.an("array") && expect(appDefinitions[0]).to.haveOwnProperty("id");
    }));

    it("appDefinitions - getById()", pnpTest("11dce742-2aeb-4b8e-8967-6f73b7fd55d6", async function () {
        let passed = false;
        const apps = await this.pnp.graph.appCatalog.teamsApps();
        const appDefinitions = await this.pnp.graph.appCatalog.teamsApps.getById(apps[0].id).appDefinitions();

        if (apps.length > 0) {
            const def = await this.pnp.graph.appCatalog.teamsApps.getById(apps[0].id).appDefinitions.getById(appDefinitions[0].id)();
            passed = (def.id === appDefinitions[0].id);
        }
        return expect(passed).is.true;
    }));
});
