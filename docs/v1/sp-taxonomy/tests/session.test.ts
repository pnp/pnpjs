import { expect } from "chai";
import { taxonomy } from "../";
import { testSettings } from "../../../test/main";

describe("Taxonomy", () => {

    if (testSettings.enableWebTests) {

        let defaultTermStoreName: string | null = null;
        let defaultTermStoreId: string | null = null;

        before((done) => {

            // we are going to grab the default term store id and name for use later in loading things

            taxonomy.getDefaultSiteCollectionTermStore().select("Name", "Id").get().then(ts => {

                defaultTermStoreId = ts.Id;
                defaultTermStoreName = ts.Name;
                done();
            });
        });

        describe("session", () => {

            it("Should getDefaultKeywordTermStore", () => {

                return expect(taxonomy.getDefaultKeywordTermStore().get()).to.eventually.be.fulfilled;
            });

            it("Should getDefaultSiteCollectionTermStore", () => {

                return expect(taxonomy.getDefaultSiteCollectionTermStore().get()).to.eventually.be.fulfilled;
            });
        });

        describe("termstores", () => {

            it("Should load termstores data", () => {

                const tests = [
                    expect(taxonomy.termStores.get()).to.eventually.be.fulfilled,
                    expect(taxonomy.termStores.select("Name", "Id").get()).to.eventually.be.fulfilled.and.be.an.instanceOf(Array),
                ];

                return Promise.all(tests);
            });

            it("Should load a term store by id", () => {

                return expect(taxonomy.termStores.getById(defaultTermStoreId).get()).to.eventually.be.fulfilled;
            });

            it("Should load a term store by name", () => {

                return expect(taxonomy.termStores.getByName(defaultTermStoreName).get()).to.eventually.be.fulfilled;
            });
        });
    }
});
