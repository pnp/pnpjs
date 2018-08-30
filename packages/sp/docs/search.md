# @pnp/sp/search

Using search you can access content throughout your organization in a secure and consistent manner. The library provides support for searching and search suggest - as well as some interfaces and helper classes to make building your queries and processing responses easier.

# Search

Search is accessed directly from the root sp object and can take either a string representing the query text, a plain object matching the SearchQuery interface, or a SearchQueryBuilder instance. The first two are shown below.

```TypeScript
import { sp, SearchQuery, SearchResults } from "@pnp/sp";

// text search using SharePoint default values for other parameters
sp.search("test").then((r: SearchResults) => {

    console.log(r.ElapsedTime);
    console.log(r.RowCount);
    console.log(r.PrimarySearchResults);
});

// define a search query object matching the SearchQuery interface
sp.search(<SearchQuery>{
    Querytext: "test",
    RowLimit: 10,
    EnableInterleaving: true,
}).then((r: SearchResults) => {

    console.log(r.ElapsedTime);
    console.log(r.RowCount);
    console.log(r.PrimarySearchResults);
});
```

## Search Result Caching

_Added in 1.1.5_

As of version 1.1.5 you can also use the searchWithCaching method to enable cache support for your search results this option works with any of the options for providing a query, just replace "search" with "searchWithCaching" in your method chain and gain all the benefits of caching. The second parameter is optional and allows you to specify the cache options

```TypeScript
import { sp, SearchQuery, SearchResults, SearchQueryBuilder } from "@pnp/sp";

sp.searchWithCaching(<SearchQuery>{
    Querytext: "test",
    RowLimit: 10,
    EnableInterleaving: true,
}).then((r: SearchResults) => {

    console.log(r.ElapsedTime);
    console.log(r.RowCount);
    console.log(r.PrimarySearchResults);
});


const builder = SearchQueryBuilder().text("test").rowLimit(3);

// supply a search query builder and caching options
sp.searchWithCaching(builder, { key: "mykey", expiration: dateAdd(new Date(), "month", 1) }).then(r2 => {

    console.log(r2.TotalRows);
});
```


## Paging with SearchResults.getPage

Paging is controlled by a start row and page size parameter. You can specify both arguments in your initial query however you can use the getPage method to jump to any page. The second parameter page size is optional and will use the previous RowLimit or default to 10.

```TypeScript
import { sp, SearchQueryBuilder, SearchResults } from "@pnp/sp";

// this will hold our current results
let currentResults: SearchResults = null;
let page = 1;

// triggered on page load through some means
function onStart() {

    // construct our query that will be throughout the paging process, likely from user input
    const q = SearchQueryBuilder.create("test").rowLimit(5);
    sp.search(q).then((r: SearchResults) => {

        currentResults = r; // update the current results
        page = 1; // reset if needed
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
import { SearchQueryBuilder } from "@pnp/sp";

// basic usage
let q = SearchQueryBuilder().text("test").rowLimit(4).enablePhonetic;

sp.search(q).then(h => { /* ... */ });

// provide a default query text in the create()
let q2 = SearchQueryBuilder("text").rowLimit(4).enablePhonetic;

sp.search(q2).then(h => { /* ... */ });

// provide query text and a template

// shared settings across queries
const appSearchSettings: SearchQuery = {
    EnablePhonetic: true,
    HiddenConstraints: "reports"
};

let q3 = SearchQueryBuilder("test", appSearchSettings).enableQueryRules;
let q4 = SearchQueryBuilder("financial data", appSearchSettings).enableSorting.enableStemming;
sp.search(q3).then(h => { /* ... */ });
sp.search(q4).then(h => { /* ... */ });
```

# Search Suggest

Search suggest works in much the same way as search, except against the suggest end point. It takes a string or a plain object that matches SearchSuggestQuery.

```TypeScript
import { sp, SearchSuggestQuery, SearchSuggestResult } from "@pnp/sp";

sp.searchSuggest("test").then((r: SearchSuggestResult) => {

    console.log(r);
});

sp.searchSuggest(<SearchSuggestQuery>{
    querytext: "test",
    count: 5,
}).then((r: SearchSuggestResult) => {

    console.log(r);
});
```
