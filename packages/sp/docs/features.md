# @pnp/sp/features

Features are used by SharePoint to package a set of functionality and either enable (activate) or disable (deactivate) that functionality based on requirements for a specific site. You can manage feature activation using the library as shown below. Note that the features collection only contains _active_ features.

## List all Features

```TypeScript
import { sp } from "@pnp/sp";

let web = sp.web;

// get all the active features
web.features.get().then(f => {

    console.log(f);
});

// select properties using odata operators
web.features.select("DisplayName", "DefinitionId").get().then(f => {

    console.log(f);
});

// get a particular feature by id
web.features.getById("87294c72-f260-42f3-a41b-981a2ffce37a").select("DisplayName", "DefinitionId").get().then(f => {

    console.log(f);
});

// get features using odata operators
web.features.filter("DisplayName eq 'MDSFeature'").get().then(f => {

    console.log(f);
});
```

## Activate a Feature

To activate a feature you must know the feature id. You can optionally force activation - if you aren't sure don't use force.

```TypeScript
import { sp } from "@pnp/sp";

let web = sp.web;

// activate the minimum download strategy feature
web.features.add("87294c72-f260-42f3-a41b-981a2ffce37a").then(f => {

    console.log(f);
});
```

## Deactivate a Feature

```TypeScript
import { sp } from "@pnp/sp";

let web = sp.web;

web.features.remove("87294c72-f260-42f3-a41b-981a2ffce37a").then(f => {

    console.log(f);
});

// you can also deactivate a feature but going through the collection's remove method is faster
web.features.getById("87294c72-f260-42f3-a41b-981a2ffce37a").deactivate().then(f => {

    console.log(f);
});
```