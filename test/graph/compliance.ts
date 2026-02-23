import "@pnp/graph/teams";
import "@pnp/graph/compliance";

describe("Compliance", function () {

    before(async function () {
        // currently not supported for app only. Keeping this test here for a placeholder.
        this.skip();

        if (!this.pnp.settings.enableWebTests) {
            this.skip();
        }
    });
});
