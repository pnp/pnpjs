# @pnp/sp-taxonomy/termstores

Term stores contain term groups, term sets, and terms. This article describes how to work find, load, and use a term store to access the terms inside.

## List term stores

You can access a list of all term stores via the _termstores_ property of the Taxonomy class.

```TypeScript
// get a list of term stores and return all properties
const stores = await taxonomy.termStores.get();

// you can also select the fields to return for the term stores using the select operator.
const stores2 = await taxonomy.termStores.select("Name").get();
```

## Load a term store

To load a specific term store you can use the _getByName_ or _getById_ methods. Using the _get_ method executes the request to the server.

```TypeScript
const store = await taxonomy.termStores.getByName("Taxonomy_v5o/SbcTE2cegwO2dtAN9l==").get();

const store2 = await taxonomy.termStores.getById("f6112509-fba7-4544-b2ed-ce6c9396b646").get();

// you can use select as well with either method to choose the fields to return
const store3 = await taxonomy.termStores.getById("f6112509-fba7-4544-b2ed-ce6c9396b646").select("Name").get();
```

For term stores and all other objects data is returned as a merger of the data and a new instance of the representative class. Allowing you to immediately begin acting on the object. IF you do not need the data, skip the get call until you do.

```TypeScript
// no data loaded yet, store is an instance of TermStore class
const store: ITermStore = taxonomy.termStores.getByName("Taxonomy_v5o/SbcTE2cegwO2dtAN9l==");

// I can call subsequent methods on the same object and will now have an object with data
// I could have called get above as well - this is just an example
const store2: ITermStore & ITermStoreData = await store.get();

// log the Name property
console.log(store2.Name);

// call another TermStore method on the same object
await store2.addLanguage(1031);
```

## Term store methods and properties

### get

Loads the data for this term store

```TypeScript
import { taxonomy, ITermStore } from "@pnp/sp-taxonomy";

const store: ITermStore = await taxonomy.termStores.getByName("Taxonomy_v5o/SbcTE2cegwO2dtAN9l==").get();
```

### getTermSetsByName

Gets the collection of term sets with a matching name

```TypeScript
import { taxonomy, ITermSets } from "@pnp/sp-taxonomy";

const sets: ITermSets = taxonomy.termStores.getByName("Taxonomy_v5o/SbcTE2cegwO2dtAN9l==").getTermSetsByName("My Set", 1033);
```

### getTermSetById

Gets the [term set](term-sets.md) with a matching id

```TypeScript
import { taxonomy, ITermStore, ITermSet } from "@pnp/sp-taxonomy";

// note that you can also use instances if you wanted to conduct multiple operations on a single store
const store: ITermStore = taxonomy.termStores.getByName("Taxonomy_v5o/SbcTE2cegwO2dtAN9l==");
const set: ITermSet = store.getTermSetById("0ba6845c-1468-4ec5-a5a8-718f1fb05431");
// we will handle normalizing guids for you as well :)
const set2: ITermSet = store.getTermSetById("{a63aefc9-359d-42b7-a0d2-cb1809acd260}");
```

### getTermById

Gets a [term](terms.md) by id

```TypeScript
import { taxonomy, ITermStore, ITerm, ITermData } from "@pnp/sp-taxonomy";

const store: ITermStore = taxonomy.termStores.getByName("Taxonomy_v5o/SbcTE2cegwO2dtAN9l==");

const term: ITerm = store.getTermById("0ba6845c-1468-4ec5-a5a8-718f1fb05431");
const termWithData: ITerm & ITermData = await term.get();
```

### getTermsById

_Added in 1.2.6_

```TypeScript
import { taxonomy, ITermStore, ITerms, ITermData } from "@pnp/sp-taxonomy";

const store: ITermStore = taxonomy.termStores.getByName("Taxonomy_v5o/SbcTE2cegwO2dtAN9l==");

const terms: ITerms = store.getTermsById("0ba6845c-1468-4ec5-a5a8-718f1fb05431", "0ba6845c-1468-4ec5-a5a8-718f1fb05432");
const termWithData: (ITerm & ITermData)[] = await term.get();
```

### getTermGroupById

Gets a [term group](term-groups.md) by id

```TypeScript
import { taxonomy, ITermStore, ITermGroup } from "@pnp/sp-taxonomy";

const store: ITermStore = taxonomy.termStores.getByName("Taxonomy_v5o/SbcTE2cegwO2dtAN9l==");

const group: ITermGroup = store.getTermGroupById("0ba6845c-1468-4ec5-a5a8-718f1fb05431");
```

### getTerms

Gets [terms](terms.md) that match the provided criteria. Please see [this article](https://msdn.microsoft.com/en-us/library/hh626704%28v=office.12%29.aspx) for details on valid querys.

```TypeScript
import { taxonomy, ITermStore, ILabelMatchInfo, ITerm, ITermData } from "@pnp/sp-taxonomy";

const store: ITermStore = taxonomy.termStores.getByName("Taxonomy_v5o/SbcTE2cegwO2dtAN9l==");

const terms: ITerms = store.getTerms({
                                TermLabel: "test label",
                                TrimUnavailable: true,
                            });

// load the data based on the above query
const termsWithData: (ITerm & ITermData)[] = terms.get();

// select works here too :)
const termsWithData2: (ITerm & ITermData)[] = terms.select("Name").get();
```

### addLanguage

Adds a language to the term store by LCID

```TypeScript
import { taxonomy, ITermStore } from "@pnp/sp-taxonomy";

const store: ITermStore = taxonomy.termStores.getByName("Taxonomy_v5o/SbcTE2cegwO2dtAN9l==");

await store.addLanguage(1031);
```

### addGroup

Adds a [term group](term-groups.md) to the term store

```TypeScript
import { taxonomy, ITermStore } from "@pnp/sp-taxonomy";

const store: ITermStore = taxonomy.termStores.getByName("Taxonomy_v5o/SbcTE2cegwO2dtAN9l==");

const group: ITermGroup & ITermGroupData = await store.addGroup("My Group Name");

// you can optionally specify the guid of the group, if you don't we just create a new guid for you
const groups: ITermGroup & ITermGroupData = await store.addGroup("My Group Name", "0ba6845c-1468-4ec5-a5a8-718f1fb05431");
```

### commitAll

Commits all updates to the database that have occurred since the last commit or rollback.

```TypeScript
import { taxonomy, ITermStore } from "@pnp/sp-taxonomy";

const store: ITermStore = taxonomy.termStores.getByName("Taxonomy_v5o/SbcTE2cegwO2dtAN9l==");

await store.commitAll();
```

### deleteLanguage

Delete a working language from the TermStore

```TypeScript
import { taxonomy, ITermStore } from "@pnp/sp-taxonomy";

const store: ITermStore = taxonomy.termStores.getByName("Taxonomy_v5o/SbcTE2cegwO2dtAN9l==");

await store.deleteLanguage(1031);
```

### rollbackAll

Discards all updates that have occurred since the last commit or rollback. It is unlikely you will need to call this method through this library due to how things are structured.

```TypeScript
import { taxonomy, ITermStore } from "@pnp/sp-taxonomy";

const store: ITermStore = taxonomy.termStores.getByName("Taxonomy_v5o/SbcTE2cegwO2dtAN9l==");

await store.rollbackAll();
```

