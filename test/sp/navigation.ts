import { expect } from "chai";
import "@pnp/sp/navigation";
import "@pnp/sp/webs";
import { INavigationNodes } from "@pnp/sp/navigation";
import { getRandomString } from "@pnp/core";

describe("Navigation Service", function () {

    before(function () {

        if (!this.pnp.settings.enableWebTests) {
            this.skip();
        }
    });

    it("getMenuState1", function () {

        return expect(this.pnp.sp.navigation.getMenuState()).to.eventually.be.fulfilled;
    });

    it("getMenuState2", async function () {

        const state = await this.pnp.sp.navigation.getMenuState(null, 3);

        // ensure we find a node with a non -1 key
        const node = state.Nodes[state.Nodes.reverse().findIndex(n => parseInt(n.Key, 10) > 0)];

        const state2 = await this.pnp.sp.navigation.getMenuState(node.Key);

        return expect(state2).to.have.property("StartingNodeKey", node.Key);
    });

    it("getMenuState3", async function () {

        return expect(this.pnp.sp.navigation.getMenuState(null, 3, "CurrentNavSiteMapProviderNoEncode")).to.eventually.be.fulfilled;
    });


    it("getMenuNodeKey - Sucess 1", async function () {

        const state = await this.pnp.sp.navigation.getMenuState(null, 3);

        const r = await this.pnp.sp.navigation.getMenuNodeKey(state.Nodes[1].SimpleUrl);

        expect(r.toLowerCase()).to.eq(state.Nodes[1].Key.toLowerCase());
    });

    it("getMenuNodeKey - Sucess 2", async function () {

        const state = await this.pnp.sp.navigation.getMenuState(null, 3, "CurrentNavSiteMapProviderNoEncode");

        const r = await this.pnp.sp.navigation.getMenuNodeKey(state.Nodes[0].SimpleUrl, "CurrentNavSiteMapProviderNoEncode");

        expect(r.toLowerCase()).to.eq(state.Nodes[0].Key.toLowerCase());
    });

    it("getMenuNodeKey - Fail", function () {

        return expect(this.pnp.sp.navigation.getMenuNodeKey("/some/page/not/there.aspx")).to.eventually.be.rejected;
    });
});

// TODO: Fix const declaration of navs in declare.
describe("navigation", function () {

    let url = "";

    before(async function () {

        if (!this.pnp.settings.enableWebTests) {
            this.skip();
        }

        const navs: INavigationNodes[] = [
            this.pnp.sp.web.navigation.topNavigationBar,
            this.pnp.sp.web.navigation.quicklaunch,
        ];

        const webData = await this.pnp.sp.web.select("ServerRelativeUrl")();
        url = webData.ServerRelativeUrl;

        // ensure we have at least one node in each nav
        navs.forEach(async function (nav) {
            const nodes = await nav();
            if (nodes.length < 1) {
                await nav.add("Testing Node", url, true);
            }
        });

        navs.forEach(function (nav) {

            it("get navigation", async function () {

                const data = await nav();

                // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                expect(data).to.not.be.null;
            });

            it("getById", async function () {

                const data = await nav();
                const data1 = await nav.getById(data[0].Id)();
                expect(data1.Id).to.eq(data[0].Id);
            });

            it("add", async function () {

                const title = `Testing - ${getRandomString(4)}`;
                const result = await nav.add(title, url, true);
                const nodeData = await result.node();
                expect(nodeData.Title).to.eq(title);
            });

            it("moveAfter", async function () {

                const node1result = await nav.add(`Testing - ${getRandomString(4)} (1)`, url, true);
                const node2result = await nav.add(`Testing - ${getRandomString(4)} (2)`, url, true);
                const node1 = await node1result.node();
                const node2 = await node2result.node();

                await nav.moveAfter(node1.Id, node2.Id);
            });

            it("node: delete", async function () {
                const node1result = await nav.add(`Testing - ${getRandomString(4)}`, url, true);
                let nodes = await nav();
                // check we added a node
                expect(nodes.findIndex(n => n.Id === node1result.data.Id)).to.be.greaterThan(-1);

                await nav.getById(node1result.data.Id).delete();

                nodes = await nav();
                expect(nodes.findIndex(n => n.Id === node1result.data.Id)).to.be.eq(-1);
            });

            it("node: update", async function () {
                const title1 = `Testing - ${getRandomString(4)}`;
                const title2 = `Testing - ${getRandomString(4)}`;
                const node1result = await nav.add(title1, url, true);
                let nodes = await nav();
                // check we added a node
                expect(nodes.findIndex(n => n.Title === title1)).to.be.greaterThan(-1);


                await nav.getById(node1result.data.Id).update({
                    Title: title2,
                });

                nodes = await nav();
                expect(nodes.findIndex(n => n.Title === title2)).to.be.greaterThan(-1);
            });

            it("node: children", async function () {

                const node1result = await nav.add(`Testing - ${getRandomString(4)}`, url, true);

                await node1result.node.children.add(`Testing - ${getRandomString(4)}`, url, true);
                await node1result.node.children.add(`Testing - ${getRandomString(4)}`, url, true);

                const children = await node1result.node.children();

                expect(children.length).to.eq(2);
            });
        });
    });
});
