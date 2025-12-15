import { expect } from "chai";
import "@pnp/sp/lists/web";
import "@pnp/sp/items/list";
import "@pnp/sp/batching";
import "@pnp/sp/filter-builder";
import "@pnp/sp/fields/list";
import { IList } from "@pnp/sp/lists";

describe("Filter Builder", function () {
    let list: IList = null;
    const listTitle = "FilterBuilderTestList";
    const testData = {
        item1: { Title: "TestItem_Alpha", Status: "Active", Priority: 1, TestDate: new Date("2023-01-15"), IsPending: true },
        item2: { Title: "TestItem_Beta", Status: "Inactive", Priority: 5, TestDate: new Date("2023-06-20"), IsPending: false },
        item3: { Title: "TestItem_Gamma", Status: "Active", Priority: 10, TestDate: new Date("2024-01-10"), IsPending: true },
        item4: { Title: "SearchItem_Delta", Status: "Pending", Priority: 3, TestDate: new Date("2023-03-25"), IsPending: false },
        item5: { Title: "SearchItem_Epsilon", Status: "Active", Priority: 7, TestDate: new Date("2024-06-30"), IsPending: true },
    };

    before(async function () {

        if (!this.pnp.settings.enableWebTests) {
            this.skip();
        }

        // Create list and add test data
        const ler = await this.pnp.sp.web.lists.ensure(listTitle, "Used to test filter builder operations", 100, false, {
            AllowContentTypes: false,
        });
        list = ler.list;

        if (ler.created) {

            await list.fields.addNumber("Priority", { MinimumValue: 0, MaximumValue: 100 });
            await list.fields.addText("Status", { MaxLength: 50 });
            await list.fields.addDateTime("TestDate", { DisplayFormat: 1, Group: "Test Fields" });
            await list.fields.addBoolean("IsPending", { Group: "Test Fields" });

            // add a few items to get started
            const [spBatch, execute] = this.pnp.sp.batched();
            spBatch.web.lists.getByTitle(listTitle).items.add(testData.item1);
            spBatch.web.lists.getByTitle(listTitle).items.add(testData.item2);
            spBatch.web.lists.getByTitle(listTitle).items.add(testData.item3);
            spBatch.web.lists.getByTitle(listTitle).items.add(testData.item4);
            spBatch.web.lists.getByTitle(listTitle).items.add(testData.item5);
            await execute();
        }
    });

    after(async function () {
        // cleanup list
        if (list != null) {
            // await list.delete();
        }
    });

    describe("String Filters", function () {

        it("str().eq() - should filter items by exact title match", async function () {
            const items = await list.items.where(item =>
                item.text("Title").eq("TestItem_Alpha")
            )();

            expect(items.length).to.eq(1);
            return expect(items[0].Title).to.eq("TestItem_Alpha");
        });

        it("str().ne() - should filter items excluding a title", async function () {
            const items = await list.items.where(item =>
                item.text("Title").ne("TestItem_Alpha")
            )();

            expect(items.length).to.be.gte(4);
            return expect(items.every(i => i.Title !== "TestItem_Alpha")).to.be.true;
        });

        it("str().startsWith() - should filter items by title prefix", async function () {
            const items = await list.items.where(item =>
                item.text("Title").startsWith("TestItem")
            )();

            expect(items.length).to.be.gte(3);
            return expect(items.every(i => i.Title.startsWith("TestItem"))).to.be.true;
        });

        it("str().startsWith() - should filter items by different prefix", async function () {
            const items = await list.items.where(item =>
                item.text("Title").startsWith("SearchItem")
            )();

            expect(items.length).to.be.gte(2);
            return expect(items.every(i => i.Title.startsWith("SearchItem"))).to.be.true;
        });

        it("str().substringOf() - should filter items containing substring", async function () {
            const items = await list.items.where(item =>
                item.text("Title").substringOf("Alpha")
            )();

            expect(items.length).to.be.gte(1);
            return expect(items.every(i => i.Title.includes("Alpha"))).to.be.true;
        });
    });

    describe("Number Filters", function () {

        it("num().eq() - should filter items by exact number match", async function () {
            const items = await list.items.where(item =>
                item.number("Priority").eq(5)
            )();

            expect(items.length).to.be.gte(1);
            return expect(items.every(i => i.Priority === 5)).to.be.true;
        });

        it("num().ne() - should filter items excluding a number", async function () {
            const items = await list.items.where(item =>
                item.number("Priority").ne(1)
            )();

            expect(items.length).to.be.gte(4);
            return expect(items.every(i => i.Priority !== 1)).to.be.true;
        });

        it("num().gt() - should filter items greater than value", async function () {
            const items = await list.items.where(item =>
                item.number("Priority").gt(5)
            )();

            expect(items.length).to.be.gte(2);
            return expect(items.every(i => i.Priority > 5)).to.be.true;
        });

        it("num().lt() - should filter items less than value", async function () {
            const items = await list.items.where(item =>
                item.number("Priority").lt(5)
            )();

            expect(items.length).to.be.gte(2);
            return expect(items.every(i => i.Priority < 5)).to.be.true;
        });

        it("num().ge() - should filter items greater than or equal to value", async function () {
            const items = await list.items.where(item =>
                item.number("Priority").ge(5)
            )();

            expect(items.length).to.be.gte(3);
            return expect(items.every(i => i.Priority >= 5)).to.be.true;
        });

        it("num().le() - should filter items less than or equal to value", async function () {
            const items = await list.items.where(item =>
                item.number("Priority").le(5)
            )();

            expect(items.length).to.be.gte(3);
            return expect(items.every(i => i.Priority <= 5)).to.be.true;
        });
    });

    describe("Date Filters", function () {

        it("date().gt() - should filter items with TestDate after date", async function () {
            const cutoffDate = new Date("2023-06-01");
            const items = await list.items.where(item =>
                item.date("TestDate").gt(cutoffDate)
            )();

            expect(items.length).to.be.gte(2);
            return expect(items.every(i => new Date(i.TestDate) > cutoffDate)).to.be.true;
        });

        it("date().lt() - should filter items TestDate before date", async function () {
            const cutoffDate = new Date("2024-01-01");
            const items = await list.items.where(item =>
                item.date("TestDate").lt(cutoffDate)
            )();

            expect(items.length).to.be.gte(3);
            return expect(items.every(i => new Date(i.TestDate) < cutoffDate)).to.be.true;
        });

        it("date().ge() - should filter items TestDate on or after date", async function () {
            const cutoffDate = new Date("2023-03-25");
            const items = await list.items.where(item =>
                item.date("TestDate").ge(cutoffDate)
            )();

            expect(items.length).to.be.gte(4);
            return expect(items.every(i => new Date(i.TestDate) >= cutoffDate)).to.be.true;
        });

        it("date().le() - should filter items TestDate on or before date", async function () {
            const cutoffDate = new Date("2023-06-20");
            const items = await list.items.where(item =>
                item.date("TestDate").le(cutoffDate)
            )();

            expect(items.length).to.be.gte(3);
            return expect(items.every(i => new Date(i.TestDate) <= cutoffDate)).to.be.true;
        });

        it("date().eq() - should filter items TestDate on exact date", async function () {
            const exactDate = new Date("2023-01-15");
            const items = await list.items.where(item =>
                item.date("TestDate").eq(exactDate)
            )();

            return expect(items).to.be.an("array");
        });

        it("date().ne() - should filter items not TestDate on date", async function () {
            const excludeDate = new Date("2023-01-15");
            const items = await list.items.where(item =>
                item.date("TestDate").ne(excludeDate)
            )();

            expect(items).to.be.an("array");
            return expect(items.length).to.be.gte(0);
        });
    });

    describe("Combined Filters with AND", function () {

        it("str().and.text() - should combine two string filters", async function () {

            const items = await list.items.where(item =>
                item.text("Status").eq("Active").and.text("Title").startsWith("TestItem")
            )();


            expect(items.length).to.be.gte(2);
            return expect(items.every(i => i.Status === "Active" && i.Title.startsWith("TestItem"))).to.be.true;
        });

        it("num().and.text() - should combine number and string filters", async function () {
            const items = await list.items.where(item =>
                item.number("Priority").gt(5).and.text("Status").eq("Active")
            )();

            expect(items.length).to.be.gte(1);
            return expect(items.every(i => i.Priority > 5 && i.Status === "Active")).to.be.true;
        });

        it("str().and.number() - should combine string and number filters", async function () {
            const items = await list.items.where(item =>
                item.text("Status").eq("Active").and.number("Priority").le(5)
            )();

            expect(items.length).to.be.gte(1);
            return expect(items.every(i => i.Status === "Active" && i.Priority <= 5)).to.be.true;
        });

        it("date().and.text() - should combine date and string filters", async function () {
            const cutoffDate = new Date("2023-01-01");
            const items = await list.items.where(item =>
                item.date("TestDate").gt(cutoffDate).and.text("Status").eq("Active")
            )();

            expect(items.length).to.be.gte(2);
            return expect(items.every(i => new Date(i.TestDate) > cutoffDate && i.Status === "Active")).to.be.true;
        });

        it("date().and.number() - should combine date and number filters", async function () {
            const cutoffDate = new Date("2023-06-01");
            const items = await list.items.where(item =>
                item.date("TestDate").gt(cutoffDate).and.number("Priority").ge(5)
            )();

            expect(items.length).to.be.gte(2);
            return expect(items.every(i => new Date(i.TestDate) > cutoffDate && i.Priority >= 5)).to.be.true;
        });

        it("triple AND chain - should combine three filters", async function () {
            const cutoffDate = new Date("2023-01-01");
            const items = await list.items.where(item =>
                item.text("Status").eq("Active")
                    .and.number("Priority").gt(1)
                    .and.date("TestDate").gt(cutoffDate)
            )();

            expect(items.length).to.be.gte(1);
            return expect(items.every(i =>
                i.Status === "Active" &&
                i.Priority > 1 &&
                new Date(i.TestDate) > cutoffDate
            )).to.be.true;
        });
    });

    describe("Combined Filters with OR", function () {

        it("str().or.text() - should combine two string filters with OR", async function () {
            const items = await list.items.where(item =>
                item.text("Status").eq("Active").or.text("Status").eq("Pending")
            )();

            expect(items.length).to.be.gte(4);
            return expect(items.every(i => i.Status === "Active" || i.Status === "Pending")).to.be.true;
        });

        it("num().or.number() - should combine two number filters with OR", async function () {
            const items = await list.items.where(item =>
                item.number("Priority").eq(1).or.number("Priority").eq(10)
            )();

            expect(items.length).to.be.gte(2);
            return expect(items.every(i => i.Priority === 1 || i.Priority === 10)).to.be.true;
        });

        it("str().or.number() - should combine string and number filters with OR", async function () {
            const items = await list.items.where(item =>
                item.text("Status").eq("Inactive").or.number("Priority").gt(8)
            )();

            expect(items.length).to.be.gte(2);
            return expect(items.every(i => i.Status === "Inactive" || i.Priority > 8)).to.be.true;
        });

        it("date().or.text() - should combine date and string filters with OR", async function () {
            const cutoffDate = new Date("2024-06-01");
            const items = await list.items.where(item =>
                item.date("TestDate").gt(cutoffDate).or.text("Status").eq("Inactive")
            )();

            expect(items.length).to.be.gte(2);
            return expect(items.every(i => new Date(i.TestDate) > cutoffDate || i.Status === "Inactive")).to.be.true;
        });
    });

    describe("Grouped Filters (Parentheses)", function () {

        it("str().and(grouped OR) - should handle grouped OR within AND", async function () {
            const items = await list.items.where(item =>
                item.text("Title").startsWith("TestItem").and(builder =>
                    builder.text("Status").eq("Active").or.text("Status").eq("Inactive")
                )
            )();

            expect(items.length).to.be.gte(2);
            return expect(items.every(i =>
                i.Title.startsWith("TestItem") && (i.Status === "Active" || i.Status === "Inactive")
            )).to.be.true;
        });

        it("num().and(grouped filters) - should handle complex grouped conditions", async function () {
            const items = await list.items.where(item =>
                item.number("Priority").gt(1).and(builder =>
                    builder.text("Status").eq("Active").or.text("Title").startsWith("SearchItem")
                )
            )();

            expect(items.length).to.be.gte(3);
            return expect(items.every(i =>
                i.Priority > 1 && (i.Status === "Active" || i.Title.startsWith("SearchItem"))
            )).to.be.true;
        });

        it("(grouped filters).or.text() - should handle grouped filters before OR", async function () {
            const items = await list.items.where(item =>
                (item.text("Status").eq("Active").and.number("Priority").lt(5))
                    .or.text("Status").eq("Pending")
            )();

            return expect(items.length).to.be.gte(2);
        });

        it("nested groups - should handle multiple levels of grouping", async function () {
            const cutoffDate = new Date("2023-06-01");
            const items = await list.items.where(item =>
                item.text("Title").startsWith("TestItem").and(builder =>
                    builder.text("Status").eq("Active").and(innerBuilder =>
                        innerBuilder.number("Priority").gt(1).or.date("TestDate").gt(cutoffDate)
                    )
                )
            )();

            // Complex nested logic - mainly testing that it executes without error
            return expect(items).to.be.an("array");
        });
    });

    describe("multiple odata operations", function () {

        it("should work with select() and top()", async function () {
            const items = await list.items
                .where(item => item.text("Status").eq("Active"))
                .select("Title", "Status")
                .top(2)();

            expect(items.length).to.be.lte(2);
            expect(items[0]).to.have.property("Title");
            expect(items[0]).to.not.have.property("Priority");
            return expect(items.every(i => i.Status === "Active")).to.be.true;
        });

        it("should work with orderBy()", async function () {
            const items = await list.items
                .where(item => item.text("Status").eq("Active"))
                .orderBy("Priority", false)
                .select("Title", "Priority")();

            expect(items.length).to.be.gte(1);
            // Verify items are in descending order
            for (let i = 0; i < items.length - 1; i++) {
                expect(items[i].Priority).to.be.gte(items[i + 1].Priority);
            }
        });

        it("should return empty array when no items match", async function () {
            const items = await list.items.where(item =>
                item.text("Status").eq("NonExistentStatus")
            )();

            expect(items).to.be.an("array");
            return expect(items.length).to.eq(0);
        });
    });

    describe("Boolean Filters", function () {

        it("bool().eq(true) - should filter items where IsPending is true", async function () {
            const items = await list.items.where(item =>
                item.bool("IsPending").eq(true)
            )();

            return expect(items.every(i => i.IsPending === true)).to.be.true;
        });

        it("bool().eq(false) - should filter items where IsPending is false", async function () {
            const items = await list.items.where(item =>
                item.bool("IsPending").eq(false)
            )();

            return expect(items.every(i => i.IsPending === false)).to.be.true;
        });
    });
});
