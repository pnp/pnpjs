# @pnp/sp-taxonomy/labels

## Load labels

You can load labels by accessing the labels property of a [term](terms.md).

```TypeScript
import { ILabel, ILabelData, ITerm } from "@pnp/sp-taxonomy";

const term: ITerm = <see terms article for loading term>

// load the terms merged with data
const labelsWithData: (ILabel & ILabelData)[] = await term.labels.get();


// get a label by value
const label: ILabel = term.labels.getByValue("term value");

// get a label merged with data
const label2: ILabel & ILabelData = term.labels.getByValue("term value").get();
```

## Label Properties and Methods

### setAsDefaultForLanguage

Sets this labels as the default for the language

```TypeScript
import { ILabel, ILabelData, ITerm } from "@pnp/sp-taxonomy";

const term: ITerm = <see terms article for loading term>

// get a label by value
await term.labels.getByValue("term value").setAsDefaultForLanguage();
```

### delete

Deletes this label

```TypeScript
import { ILabel, ILabelData, ITerm } from "@pnp/sp-taxonomy";

const term: ITerm = <see terms article for loading term>

// get a label by value
await term.labels.getByValue("term value").delete();
```
