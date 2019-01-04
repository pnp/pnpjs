import { dateAdd } from "@pnp/common";
import { expect } from "chai";
import { ChangedItemType, taxonomy } from "../";
import { testSettings } from "../../../test/main";

describe("TermStore", () => {

    if (testSettings.enableWebTests) {

        let storeId: string | null = null;
        let termSetId: string | null = null;
        let termSetName: string | null = null;
        let termId: string | null = null;

        before((done) => {

            // we load these once for use several times below
            taxonomy.getDefaultSiteCollectionTermStore().get().then(store => {

                storeId = store.Id;

                return store.getSiteCollectionGroup(false).get().then(group => {

                    return group.termSets.select("Id", "Name").get().then(sets => {

                        termSetId = sets[0].Id;
                        termSetName = sets[0].Name;

                        return store.getTermSetById(termSetId).terms.select("Id").get().then(terms => {

                            if (terms.length > 0) {

                                termId = terms[0].Id;
                            }
                        });
                    });
                });
            }).then(done).catch(e => done(e));
        });

        it("Should get changes", () => {

            const p = taxonomy.getDefaultSiteCollectionTermStore().getChanges({
                ItemType: ChangedItemType.Term,
                StartTime: dateAdd(new Date(), "week", -2).toISOString(),
            });

            return expect(p).to.eventually.be.fulfilled;
        });

        it("Should get changes", () => {

            const p = taxonomy.getDefaultSiteCollectionTermStore().getChanges({
                ItemType: ChangedItemType.Term,
                StartTime: dateAdd(new Date(), "week", -2).toISOString(),
            });

            return expect(p).to.eventually.be.fulfilled;
        });

        it("Should get site collection group", () => {

            const p = taxonomy.getDefaultSiteCollectionTermStore().getSiteCollectionGroup(false).get();

            return expect(p).to.eventually.be.fulfilled;
        });

        it("Should get groups", () => {

            const p = taxonomy.getDefaultSiteCollectionTermStore().groups.get();

            return expect(p).to.eventually.be.fulfilled;
        });

        it("Should get a term by id", () => {

            if (termId !== null) {
                return expect(taxonomy.termStores.getById(storeId).getTermById(termId).get()).to.eventually.be.fulfilled;
            }
        });

        it("Should get a term in a termset", () => {

            if (termId !== null) {
                return expect(taxonomy.termStores.getById(storeId).getTermInTermSet(termId, termSetId).get()).to.eventually.be.fulfilled;
            }
        });

        it("Should get a terms using label match info", () => {

            const p = taxonomy.getDefaultSiteCollectionTermStore().getTerms({
                TermLabel: "label",
                TrimUnavailable: true,
            }).get();

            return expect(p).to.eventually.be.fulfilled;
        });

        it("Should get a termset by id", () => {

            const p = taxonomy.getDefaultSiteCollectionTermStore().getTermSetById(termSetId).get();
            return expect(p).to.eventually.be.fulfilled;
        });

        it("Should get a termset by name", () => {

            const p = taxonomy.getDefaultSiteCollectionTermStore().getTermSetsByName(termSetName, 1033).get();
            return expect(p).to.eventually.be.fulfilled;
        });
    }
});
