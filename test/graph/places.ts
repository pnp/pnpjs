import { expect } from "chai";
import { pnpTest } from "../pnp-test.js";
import "@pnp/graph/places";
import { getRandomString } from "@pnp/core";

describe("Places", function () {

    before(async function () {

        if (!this.pnp.settings.enableWebTests) {
            this.skip();
        }
    });

    it("get rooms", pnpTest("7b9a74f6-22f3-4859-bae2-ddb3cba99324", async function () {
        const rooms = await this.pnp.graph.places.rooms();
        return expect(rooms).to.be.an("array");
    }));

    it("get roomlists", pnpTest("25f24e27-420f-4641-b69d-962597528fdd", async function () {
        const roomLists = await this.pnp.graph.places.roomLists();
        return expect(roomLists).to.be.an("array");
    }));

    it("get room in roomlist", pnpTest("476b8d49-69b5-42e0-857d-f75eb03191ca", async function () {
        const roomLists = await this.pnp.graph.places.roomLists();
        if(roomLists.length > 0){
            const rooms = await this.pnp.graph.places.roomLists.getById(roomLists[0].id).rooms();
            return expect(rooms).to.be.an("array");
        }
        this.skip();
    }));

    it("get place - getById()", pnpTest("b4307200-c208-4246-a571-4ebe06c54f70", async function () {
        const rooms = await this.pnp.graph.places.rooms();
        if(rooms.length > 0){
            const room = await this.pnp.graph.places.getById(rooms[0].id)();
            return expect(room).to.haveOwnProperty("id");
        }
        this.skip();
    }));

    it.skip("update place", pnpTest("7c3f4418-f1b7-46bf-8944-ee7c7cf896ff", async function () {
        const rooms = await this.pnp.graph.places.rooms();
        const randomName = `Conf Room_${getRandomString(4)}`;
        if(rooms.length > 0){
            const room = await this.pnp.graph.places.getById(rooms[0].id)();
            const update = await this.pnp.graph.places.getById(room.id).update(
                {
                    "@odata.type": "microsoft.graph.room",
                    "nickname": randomName,
                    "building": "1",
                    "label": "100",
                    "capacity": 50,
                    "isWheelChairAccessible": false,
                });
            return expect(update.nickname).to.be(randomName);
        }
        this.skip();
    }));
});
