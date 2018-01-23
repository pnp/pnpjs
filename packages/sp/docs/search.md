# @pnp/sp/search

Using search you can access content throughout your organization in a secure and consistent manner. The library provides support for searching and search suggest - as well as some interfaces and helper classes to make building your queries and processing responses easier.

# Search

Search is accessed directly from the root sp object and can take either a string representing the query text, a plain object matching the SearchQuery interface, or a SearchQueryBuilder instance. The first two are shown below.

```TypeScript
import pnp, { SearchQuery, SearchResults } from "@pnp/sp";

// text search using SharePoint default values for other parameters
pnp.sp.search("test").then((r: SearchResults) => {

    console.log(r.ElapsedTime);
    console.log(r.RowCount);
    console.log(r.PrimarySearchResults);
});

// define a search query object matching the SearchQuery interface
pnp.sp.search(<SearchQuery>{
    Querytext: "test",
    RowLimit: 10,
    EnableInterleaving: true,
}).then((r: SearchResults) => {

    console.log(r.ElapsedTime);
    console.log(r.RowCount);
    console.log(r.PrimarySearchResults);
});
```

## Paging with SearchResults.getPage

Paging is controlled by a start row and page size parameter. You can specify both arguments in your initial query however you can use the getPage method to jump to any page. The second parameter page size is optional and will use the previous RowLimit or default to 10.

```TypeScript
import pnp, { SearchQueryBuilder, SearchResults } from "@pnp/sp";

// this will hold our current results
let currentResults: SearchResults = null;
let page = 0;

// triggered on page load through some means
function onStart() {

    // construct our query that will be throughout the paging process, likely from user input
    const q = SearchQueryBuilder.create("test").rowLimit(5);
    pnp.sp.search(q).then((r: SearchResults) => {

        currentResults = r; // update the current results
        page = 0; // reset if needed
        // update UI with data...
    });
}

// triggered by an event
function next() {
    currentResults.getPage(++page).then((r: SearchResults) => {

        currentResults = r; // update the current results
        // update UI with data...
    });
}

// triggered by an event
function prev() {
    currentResults.getPage(--page).then((r: SearchResults) => {

        currentResults = r; // update the current results
        // update UI with data...
    });
}
```

## SearchQueryBuilder

The SearchQueryBuilder allows you to build your queries in a fluent manner. It also accepts constructor arguments for query text and a base query plain object, should you have a shared configuration for queries in an application you can define them once. The methods and properties match those on the SearchQuery interface. Boolean properties add the flag to the query while methods require that you supply one or more arguments. Also arguments supplied later in the chain will overwrite previous values.

```TypeScript
// basic usage
let q = SearchQueryBuilder.create().text("test").rowLimit(4).enablePhonetic;

pnp.sp.search(q).then(h => { /* ... */ });

// provide a default query text in the create()
let q2 = SearchQueryBuilder.create("text").rowLimit(4).enablePhonetic;

pnp.sp.search(q2).then(h => { /* ... */ });

// provide query text and a template

// shared settings across queries
const appSearchSettings: SearchQuery = {
    EnablePhonetic: true,
    HiddenConstraints: "reports"
};

let q3 = SearchQueryBuilder.create("test", appSearchSettings).enableQueryRules;
let q4 = SearchQueryBuilder.create("financial data", appSearchSettings).enableSorting.enableStemming;
pnp.sp.search(q3).then(h => { /* ... */ });
pnp.sp.search(q4).then(h => { /* ... */ });
```

# Search Suggest

Search suggest works in much the same way as search, except against the suggest end point. It takes a string or a plain object that matches SearchSuggestQuery.

```TypeScript
import pnp, { SearchSuggestQuery, SearchSuggestResult } from "@pnp/sp";

pnp.sp.searchSuggest("test").then((r: SearchSuggestResult) => {

    console.log(r);
});

pnp.sp.searchSuggest(<SearchSuggestQuery>{
    querytext: "test",
    count: 5,
}).then((r: SearchSuggestResult) => {

    console.log(r);
});
```
