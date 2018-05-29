# @pnp/sp-taxonomy/termgroups

Term groups are used as a container for terms within a term store.

## Load a term group

Term groups are loaded from a [term store](term-stores.md)

```TypeScript
import { taxonomy, ITermStore, ITermGroup } from "@pnp/sp-taxonomy";

const store: ITermStore = taxonomy.termStores.getByName("Taxonomy_v5o/SbcTE2cegwO2dtAN9l==");

const group: ITermGroup = store.getTermGroupById("0ba6845c-1468-4ec5-a5a8-718f1fb05431");
```

## Term Group methods and properties

### addContributor

Adds a contributor to the Group

```TypeScript
import { taxonomy, ITermStore, ITermGroup } from "@pnp/sp-taxonomy";

const store: ITermStore = taxonomy.termStores.getByName("Taxonomy_v5o/SbcTE2cegwO2dtAN9l==");

const group: ITermGroup = store.getTermGroupById("0ba6845c-1468-4ec5-a5a8-718f1fb05431");

await group.addContributor("i:0#.f|membership|person@tenant.com");
```

### addGroupManager

Adds a group manager to the Group

```TypeScript
import { taxonomy, ITermStore, ITermGroup } from "@pnp/sp-taxonomy";

const store: ITermStore = taxonomy.termStores.getByName("Taxonomy_v5o/SbcTE2cegwO2dtAN9l==");

const group: ITermGroup = store.getTermGroupById("0ba6845c-1468-4ec5-a5a8-718f1fb05431");

await group.addGroupManager("i:0#.f|membership|person@tenant.com");
```

### createTermSet

Creates a new [term set](term-sets.md)

```TypeScript
import { taxonomy, ITermStore, ITermGroup, ITermSet, ITermSetData } from "@pnp/sp-taxonomy";

const store: ITermStore = taxonomy.termStores.getByName("Taxonomy_v5o/SbcTE2cegwO2dtAN9l==");

const group: ITermGroup = store.getTermGroupById("0ba6845c-1468-4ec5-a5a8-718f1fb05431");

const set: ITermSet & ITermSetData = await group.createTermSet("name", 1031);

// you can optionally supply the term set id, if you do not we create a new id for you
const set2: ITermSet & ITermSetData = await group.createTermSet("name", 1031, "0ba6845c-1468-4ec5-a5a8-718f1fb05431");
```

### get

Gets this term group's data

```TypeScript
import { taxonomy, ITermStore, ITermGroupData, ITermGroup } from "@pnp/sp-taxonomy";

const store: ITermStore = taxonomy.termStores.getByName("Taxonomy_v5o/SbcTE2cegwO2dtAN9l==");

const group: ITermGroup & ITermGroupData = store.getTermGroupById("0ba6845c-1468-4ec5-a5a8-718f1fb05431").get();
```
