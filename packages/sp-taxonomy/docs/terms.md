# @pnp/sp-taxonomy/terms

Terms are the individual entries with a term set.

## Load Terms

You can load a collection of terms through a [term set](term-sets.md) or [term store](term-stores.md).

```TypeScript
import {
    taxonomy,
    ITermStore,
    ITerms,
    ILabelMatchInfo,
    ITerm,
    ITermData
} from "@pnp/sp-taxonomy";

const store: ITermStore = await taxonomy.termStores.getByName("Taxonomy_v5o/SbcTE2cegwO2dtAN9l==");

const labelMatchInfo: ILabelMatchInfo = {
    TermLabel: "My Label",
    TrimUnavailable: true,
};

const terms: ITerms = store.getTerms(labelMatchInfo);

// get term instances merged with data
const terms2: (ITermData & ITerm)[] = await store.getTerms(labelMatchInfo).get();

const terms3: ITerms = store.getTermSetById("0ba6845c-1468-4ec5-a5a8-718f1fb05431").terms;

// get terms merged with data from a term set
const terms4: (ITerm & ITermData)[] = store.getTermSetById("0ba6845c-1468-4ec5-a5a8-718f1fb05431").terms.get();
```

## Load Single Term

You can get a single term a variety of ways as shown below. The "best" way will be determined by what information is available to do the lookup but ultimately will result in the same end product.

```TypeScript
import {
    taxonomy,
    ITermStore,
    ITerms,
    ILabelMatchInfo,
    ITerm,
    ITermData
} from "@pnp/sp-taxonomy";

const store: ITermStore = await taxonomy.termStores.getByName("Taxonomy_v5o/SbcTE2cegwO2dtAN9l==");

// get a single term by id
const term: ITerm = store.getTermById("0ba6845c-1468-4ec5-a5a8-718f1fb05431");

// get single get merged with data
const term2: ITerm = store.getTermById("0ba6845c-1468-4ec5-a5a8-718f1fb05431").get();

// use select to choose which fields to return
const term3: ITerm = store.getTermById("0ba6845c-1468-4ec5-a5a8-718f1fb05431").select("Name").get();

// get a term from a term set
const term4: ITerm = store.getTermSetById("0ba6845c-1468-4ec5-a5a8-718f1fb05431").getTermById("0ba6845c-1468-4ec5-a5a8-718f1fb05431");
```

## Term methods and properties

### labels

Accesses the [labels](labels.md) collection for this term

```TypeScript
import { taxonomy, ITermStore, ITerm, ILabels } from "@pnp/sp-taxonomy";

const term: ITerm = <from one of the above methods>;

const labels: ILabels = term.labels;

// labels merged with data
const labelsWithData = term.labels.get();
```

### createLabel

Creates a new label for this Term

```TypeScript
import { taxonomy, ITermStore, ITerm, ILabelData, ILabel } from "@pnp/sp-taxonomy";

const term: ITerm = <from one of the above methods>;

const label: ILabelData & ILabel = term.createLabel("label text", 1031);

// optionally specify this is the default label
const label2: ILabelData & ILabel = term.createLabel("label text", 1031, true);
```

### deprecate

Sets the deprecation flag on a term

```TypeScript
import { ITerm } from "@pnp/sp-taxonomy";

const term: ITerm = <from one of the above methods>;

await term.deprecate(true);
```

### get

Loads the term data

```TypeScript
import { ITerm, ITermData } from "@pnp/sp-taxonomy";

const term: ITerm = <from one of the above methods>;

// load term instance merged with data
const term2: ITerm & ITermData = await term.get();
```

### getDescription

Sets the description

```TypeScript
import { ITerm } from "@pnp/sp-taxonomy";

const term: ITerm = <from one of the above methods>;

// load term instance merged with data
const description = await term.getDescription(1031);
```

### setDescription

Sets the description

```TypeScript
import { ITerm } from "@pnp/sp-taxonomy";

const term: ITerm = <from one of the above methods>;

// load term instance merged with data
await term.setDescription("the description", 1031);
```

### setLocalCustomProperty

Sets a custom property on this term

```TypeScript
import { ITerm } from "@pnp/sp-taxonomy";

const term: ITerm = <from one of the above methods>;

// load term instance merged with data
await term.setLocalCustomProperty("name", "value");
```

### addTerm

_Added in 1.2.8_

Adds a child term to an existing term instance.

```TypeScript
import { ITerm } from "@pnp/sp-taxonomy";

const parentTerm: ITerm = <from one of the above methods>;

await parentTerm.addTerm("child 1", 1033);

await parentTerm.addTerm("child 2", 1033);
```
