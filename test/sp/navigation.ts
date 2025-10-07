import { expect } from "chai";
import "@pnp/sp/navigation";
import "@pnp/sp/webs";
import { INavigationNodes } from "@pnp/sp/navigation";
import { getRandomString } from "@pnp/core";
import { pnpTest } from  "../pnp-test.js";

describe("Navigation Service", function () {

    before(pnpTest("2d5683b6-1f79-485c-a628-db08b460e092", function () {

        if (!this.pnp.settings.enableWebTests) {
            this.skip();
        }
    }));

    it("getMenuState1", pnpTest("7fcd3f6f-ca09-43e7-a3e4-fbf4ad9e1da7", function () {

        return expect(this.pnp.sp.navigation.getMenuState()).to.eventually.be.fulfilled;
    }));

    it("getMenuState2", pnpTest("4f66a549-ecf2-4cb1-9ef6-76f2a66f73b5", async function () {

        const state = await this.pnp.sp.navigation.getMenuState(null, 3);

        // ensure we find a node with a non -1 key
        const node = state.Nodes[state.Nodes.reverse().findIndex(n => parseInt(n.Key, 10) > 0)];

        const state2 = await this.pnp.sp.navigation.getMenuState(node.Key);

        return expect(state2).to.have.property("StartingNodeKey", node.Key);
    }));

    it("getMenuState3", pnpTest("9c74a054-1f4b-4e5a-bf01-96cabef2eb2c", async function () {

        return expect(this.pnp.sp.navigation.getMenuState(null, 3, "CurrentNavSiteMapProviderNoEncode")).to.eventually.be.fulfilled;
    }));


    it("getMenuNodeKey - Sucess 1", pnpTest("e55f42c2-ee48-4719-ace9-75ae11ef6568", async function () {

        const state = await this.pnp.sp.navigation.getMenuState(null, 3);

        const r = await this.pnp.sp.navigation.getMenuNodeKey(state.Nodes[1].SimpleUrl);

        expect(r.toLowerCase()).to.eq(state.Nodes[1].Key.toLowerCase());
    }));

    it("getMenuNodeKey - Sucess 2", pnpTest("aebee048-4394-439e-b4fb-b4f7d6a9afd7", async function () {

        const state = await this.pnp.sp.navigation.getMenuState(null, 3, "CurrentNavSiteMapProviderNoEncode");

        const r = await this.pnp.sp.navigation.getMenuNodeKey(state.Nodes[0].SimpleUrl, "CurrentNavSiteMapProviderNoEncode");

        expect(r.toLowerCase()).to.eq(state.Nodes[0].Key.toLowerCase());
    }));

    it("getMenuNodeKey - Fail", pnpTest("6e7d70d5-7e36-428d-8547-256f0c8b8eab", function () {

        return expect(this.pnp.sp.navigation.getMenuNodeKey("/some/page/not/there.aspx")).to.eventually.be.rejected;
    }));
});

// TODO: Fix const declaration of navs in declare.
describe("navigation", function () {

    let url = "";

    before(pnpTest("d9ad106e-a884-443c-8390-ed6b44dca395", async function () {

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

            it("get navigation", pnpTest("b9acb041-77f5-4427-a291-7fbeb98216da", async function () {

                const data = await nav();

                // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                expect(data).to.not.be.null;
            }));

            it("getById", pnpTest("aecda364-52c3-41f0-9828-297d8a8cccdb", async function () {

                const data = await nav();
                const data1 = await nav.getById(data[0].Id)();
                expect(data1.Id).to.eq(data[0].Id);
            }));

            it("add", pnpTest("6f80503e-ea9e-46a9-86b2-49f99c8dcb33", async function () {

                const { title } = await this.props({
                    title: `Testing - ${getRandomString(4)}`,
                });
                const result = await nav.add(title, url, true);
                const nodeData = await nav.getById(result.Id)();
                expect(nodeData.Title).to.eq(title);
            }));

            it("moveAfter", pnpTest("9da4acec-e033-48d0-94f3-88add0f91ca1", async function () {
                const { rand1, rand2 } = await this.props({
                    rand1: getRandomString(4),
                    rand2: getRandomString(4),
                });
                const node1result = await nav.add(`Testing - ${rand1} (1)`, url, true);
                const node2result = await nav.add(`Testing - ${rand2} (2)`, url, true);

                const node1 = await nav.getById(node1result.Id)();
                const node2 = await nav.getById(node2result.Id)();

                await nav.moveAfter(node1.Id, node2.Id);
            }));

            it("node: delete", pnpTest("70fbb14a-da38-4e5b-b315-0a316dfa5393", async function () {
                const { rand } = await this.props({
                    rand: getRandomString(4),
                });
                const node1result = await nav.add(`Testing - ${rand}`, url, true);
                let nodes = await nav();
                // check we added a node
                expect(nodes.findIndex(n => n.Id === node1result.Id)).to.be.greaterThan(-1);

                await nav.getById(node1result.Id).delete();

                nodes = await nav();
                expect(nodes.findIndex(n => n.Id === node1result.Id)).to.be.eq(-1);
            }));

            it("node: update", pnpTest("c866a688-014f-4bf5-8feb-20a4341fe81c", async function () {
                const { title1, title2 } = await this.props({
                    title1: `Testing - ${getRandomString(4)}`,
                    title2: `Testing - ${getRandomString(4)}`,
                });

                const node1result = await nav.add(title1, url, true);
                let nodes = await nav();
                // check we added a node
                expect(nodes.findIndex(n => n.Title === title1)).to.be.greaterThan(-1);


                await nav.getById(node1result.Id).update({
                    Title: title2,
                });

                nodes = await nav();
                expect(nodes.findIndex(n => n.Title === title2)).to.be.greaterThan(-1);
            }));

            it("node: children", pnpTest("d22dc7cc-aaf7-4de5-aa70-a1af9e75e40d", async function () {
                const { node1, node2, node3 } = await this.props({
                    node1: `Testing - ${getRandomString(4)}`,
                    node2: `Testing - ${getRandomString(4)}`,
                    node3: `Testing - ${getRandomString(4)}`,
                });
                const node1result = await nav.add(node1, url, true);
                const node = nav.getById(node1result.Id);
                await node.children.add(node2, url, true);
                await node.children.add(node3, url, true);

                const children = await node.children();

                expect(children.length).to.eq(2);
            }));
        });
    }));
});
