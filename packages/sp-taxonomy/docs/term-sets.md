# @pnp/sp-taxonomy/termsets

Term sets contain terms within the taxonomy heirarchy.

## Load a term set

You load a term set directly from a term store.

```TypeScript
import { taxonomy, ITermStore, ITermSet } from "@pnp/sp-taxonomy";

const store: ITermStore = taxonomy.termStores.getByName("Taxonomy_v5o/SbcTE2cegwO2dtAN9l==");

const set: ITermSet = store.getTermSetById("0ba6845c-1468-4ec5-a5a8-718f1fb05431");
```

Or you can load a term set from a collection - though if you know the id it is more efficient to get the term set directly.

```TypeScript
import { taxonomy, ITermStore, ITermSet } from "@pnp/sp-taxonomy";

const store: ITermStore = taxonomy.termStores.getByName("Taxonomy_v5o/SbcTE2cegwO2dtAN9l==");

const set = store.getTermSetsByName("my set", 1031).getById("0ba6845c-1468-4ec5-a5a8-718f1fb05431");

const setWithData = store.getTermSetsByName("my set", 1031).getByName("my set").get();
```


## Term set methods and properties

### addStakeholder

Adds a stakeholder to the TermSet

```TypeScript
import { taxonomy, ITermStore, ITermSet } from "@pnp/sp-taxonomy";

const store: ITermStore = taxonomy.termStores.getByName("Taxonomy_v5o/SbcTE2cegwO2dtAN9l==");

const set: ITermSet = store.getTermSetById("0ba6845c-1468-4ec5-a5a8-718f1fb05431");

await set.addStakeholder("i:0#.f|membership|person@tenant.com");
```

### deleteStakeholder

Deletes a stakeholder to the TermSet

```TypeScript
import { taxonomy, ITermStore, ITermSet } from "@pnp/sp-taxonomy";

const store: ITermStore = taxonomy.termStores.getByName("Taxonomy_v5o/SbcTE2cegwO2dtAN9l==");

const set: ITermSet = store.getTermSetById("0ba6845c-1468-4ec5-a5a8-718f1fb05431");

await set.deleteStakeholder("i:0#.f|membership|person@tenant.com");
```

### get

Gets the data for this TermSet

```TypeScript
import { taxonomy, ITermStore, ITermSet, ITermSetData } from "@pnp/sp-taxonomy";

const store: ITermStore = taxonomy.termStores.getByName("Taxonomy_v5o/SbcTE2cegwO2dtAN9l==");

const set: ITermSet = store.getTermSetById("0ba6845c-1468-4ec5-a5a8-718f1fb05431");

const setWithData: ITermSet & ITermSetData = await set.get();
```

### terms

Provides access to the [terms](terms.md) collection for this termset

```TypeScript
import { taxonomy, ITermStore, ITermSet, ITerms, ITermData, ITerm } from "@pnp/sp-taxonomy";

const store: ITermStore = taxonomy.termStores.getByName("Taxonomy_v5o/SbcTE2cegwO2dtAN9l==");

const set: ITermSet = store.getTermSetById("0ba6845c-1468-4ec5-a5a8-718f1fb05431");

const terms: ITerms = set.terms;

// load the data into the terms instances
const termsWithData: (ITermData & ITerm)[] = set.terms.get();
```

### getTermById

Gets a term by id from this set

```TypeScript
import { taxonomy, ITermStore, ITermSet, ITermData, ITerm } from "@pnp/sp-taxonomy";

const store: ITermStore = taxonomy.termStores.getByName("Taxonomy_v5o/SbcTE2cegwO2dtAN9l==");

const set: ITermSet = store.getTermSetById("0ba6845c-1468-4ec5-a5a8-718f1fb05431");

const term: ITerm = set.getTermById("0ba6845c-1468-4ec5-a5a8-718f1fb05431");

// load the data into the term instances
const termWithData: ITermData & ITerm = term.get();
```

### addTerm

Adds a term to a term set

```TypeScript
import { taxonomy, ITermStore, ITermSet, ITermData, ITerm } from "@pnp/sp-taxonomy";

const store: ITermStore = taxonomy.termStores.getByName("Taxonomy_v5o/SbcTE2cegwO2dtAN9l==");

const set: ITermSet = store.getTermSetById("0ba6845c-1468-4ec5-a5a8-718f1fb05431");

const term: ITerm & ITermData = await set.addTerm("name", 1031, true);

// you can optionally set the id when you create the term
const term2: ITerm & ITermData = await set.addTerm("name", 1031, true, "0ba6845c-1468-4ec5-a5a8-718f1fb05431");
```
