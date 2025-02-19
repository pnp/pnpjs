# @pnp/graph/workbooks

Provides the ability to interact with Excel workbooks hosted in a Drive.

More information can be found on the official Graph documentation:

- [Workbooks and charts](https://learn.microsoft.com/en-us/graph/api/resources/excel)

## Opening a workbook
To open an Excel workbook, create an [IDriveItem](./files.md) pointing to an .xlsx file with `DriveItem.getItemByID`. Then, use `getWorkbookSession(persistChanges)` to open the workbook.

Use the persistChanges parameter to set whether you want your changes to be saved back to the file.

```Typescript
import { PreferAsync } from "@pnp/graph/behaviors/prefer-async.js";
import "@pnp/graph/files/index.js";
import "@pnp/graph/workbooks/index.js";

const drive = graph.me.drive();

const { id: fileId } = await drive
    .getItemByPath('path/to/MyWorkbook.xlsx')
    .select('id')();

const workbook = await drive.getItemById(fileId)
    .using(PreferAsync())
    .getWorkbookSession(false);

// Do stuff...

await workbook.closeSession();
```
**KNOWN BUG**: You MUST open the workbook on a DriveItem that was located by ID. Calling `getWorkbookSession` on a DriveItem located by path will fail with "AccessDenied: Could not obtain a WAC access token."

Using `PreferAsync()` is not required. However, some of the workbook endpoints support the [long-running operation pattern](https://learn.microsoft.com/en-us/graph/workbook-best-practice?tabs=http#work-with-apis-that-take-a-long-time-to-complete), so using the PreferAsync behaviour may make your life easier.

## Working with named tables
### Reading values
```Typescript
const table = workbook.tables.getByName("MyTable1");

// Column names
const { values: columnNames } = await table.headerRowRange.select("values")();

// All data rows and columns
const { values: tableRows } = await table.dataBodyRange.select("values")();

// All rows from the first column (including the header)
const firstColumn = table.columns.getItemAt(0);
const { values: rowsFromCol } = await firstColumn.select("values")();

// Rows 20-30 of the column named "SomeColumn"
const { values: twenties } = await testTable.columns.getByName("SomeColumn")
                                .getRange().cell(19, 0).rowsBelow(10)
                                .select("values")();

// For a large table, use paging to iterate over the rows
const allRows = [];
for await (let page of allPages(testTable.rows, 100)) {
    console.info(`Got first page: ${page.values}`)
    allRows.push(...page);
}
```
See below for a an example implementation of `allPages()`.

#### Async iterate over all pages
**KNOWN BUG**: Graph workbook endpoints don't currently return the required
OData properties to work with PnPJS' existing async iterator.

In the meantime, one way to iterate over a whole collection is to simply
keep requesting pages until there is no more data:
```Typescript
export default function allPages<T>(query: IGraphCollection<T>, pageSize: number) {
    return {
        [Symbol.asyncIterator](): AsyncIterator<T> {
            let skipOffset = 0;
            return {
                async next() {
                    const response: any = await query.top(pageSize).skip(skipOffset)();
                    if (typeof response.length === 'number' && response.length > 0) {
                        skipOffset += response.length;
                        return { done: false, value: response }
                    } else {
                        return { done: true, value: [] }
                    }
                }
            }
        }
    }
}
```
### Writing values
```Typescript
// Appending a row
const newRow = await table.rows.add({ values: ["a", "b", "c"].map(cell => [cell]) });

// Deleting a row
await table.rows.getItemAt(5).delete();

// Create a new column with no data
const newEmptyCol = await table.columns.add({ name: "EmptyColumn" });

```
**KNOWN BUG**: If you try to delete a row from a table with a filter currently active, the operation will fail with 409 Conflict and a message stating the operation "won't work" because it would move cells in your table. Possible workarounds are to remove the filter first or use convertToRange to change the table back into a range of regular cells.
### Updating table properties
[General properties](https://learn.microsoft.com/en-us/graph/api/resources/workbooktable?view=graph-rest-1.0#properties) can be updated like so:
```Typescript
await table.update({ showBandedRows: true });
```
[Sorting](https://learn.microsoft.com/en-us/graph/api/resources/workbooktablesort?view=graph-rest-1.0) and [filtering](https://learn.microsoft.com/en-us/graph/api/resources/workbookfilter?view=graph-rest-1.0) settings have their own endpoints:
```Typescript
// Filter the table to show rows where "MyColumn" is greater than 10
const myColumn = table.columns.getByName("MyColumn");
await myColumn.filter.apply({
        criteria: {
            criterion1: '>10',
            filterOn: 'Custom',
            // 'filterOn' is not documented but must be set, otherwise
            // the operation fails with 500. 
            // There may be supported values other than 'Custom', but
            // they are not in the Graph API documentation.
        }
    });

// Sort the table based on the column at index 0 in ascending order
await table.sort.apply([{ key: 0, ascending: true }]);
```
## Working with ranges
### Getting a range
```Typescript
// Create a range using Excel A1 coordinates
const sheet = workbook.worksheets.getByID("Sheet1");
const range = sheet.getRange("A1:C3");

// Get the full "used range" of the worksheet
const usedRange = sheet.getUsedRange();
const usedAddress = (await usedRange()).address // = e.g. "B2:L21"

// Named objects (like tables) have an underlying range, too
const tableRange = table.getRange();
```
### Modifying values
```Typescript
// A single cell in a range
const sheetRange = sheet.getRange();
const cell = sheetRange.cell(0, 1);
await cell.update({ values: [["Hello, world!"]] });

// Multiple cells in a range
const values = [
    ["a", "b", "c"],
    [1, 2, 3],
    [1, 2, "=SUM(A3:B3)"]
];
await sheet.getRange("A1:C3").update({ values });
```
### Sorting and formatting
```Typescript
// Sort a range in descending order based on its first column
const sort: WorkbookSortField = {
    key: 0, sortOn: "Value",
    dataOption: "TextAsNumber",
    ascending: false
};

await range.sort.apply({
    fields: [ sort ], hasHeaders: false,
});

// Get and set a fill on a range
const oldFill = await range.format.fill();
await range.format.fill.update({ color: "#FF0000" });

// Add a purple dashed line to the top border of a range
await range.format.borders.getBySideIndex("EdgeTop").update({
    color: "#8C34EB",
    style: "Dash",
    weight: "Medium"
});
```
## Full example: Creating a table from data
```Typescript
const sheet = workbook.worksheets.getById(TEST_SHEET_NAME);

// Add data to the worksheet
const addr = "A1:C4";
const data = [
    ["Name", "Age", "Department"],
    ["Alice", 30, "Engineering"],
    ["Bob", 25, "HR"],
    ["Charlie", 35, "Finance"]
];

const range = sheet.getRange(addr);
await range.update({ values: data });

// Convert the range into a named table
const tableInfo = await sheet.tables.add(addr, true);
const table = workbook.tables.getById(tableInfo.id!);

// Rename the table and enable banded rows
await table.update({
    name: "Staff_list",
    showBandedRows: true
});

// Autofit column width
await table.getRange().format.autofitColumns();

// Sort the table in ascending order on the "Age" column
await table.sort.apply([{ key: 1, ascending: true }]);
```
Output:

![Table example output](../img/Basic_table_example.png)