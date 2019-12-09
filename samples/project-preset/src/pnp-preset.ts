// **************************************************************
// By creating this file we can abstract all our custom sharepoint logic into extension methods
// kept here, and invoked cleanly within our components. This has the advantage of only needing
// to import the functionality once within your project while still maintaining the smaller
// package size enabled by selective imports. We can also add methods using extensions to any
// of the instance factories allowing us to reuse our code within our project easily - and if done
// within a custom bundle across multiple projects.
// **************************************************************


// we import the extendFactory function for use below
import { extendFactory } from "@pnp/odata";

// we grab the SPRest object so we can export an sp const from this "preset"
import { SPRest } from "@pnp/sp";

// we import all the ambient features we need in our project in one place
// no need to do them in every file where we want to use them (one place to update)
import "@pnp/sp/webs";
import "@pnp/sp/items";
import "@pnp/sp/lists";
import "@pnp/sp/sites";
import "@pnp/sp/fields";
import { Web, IWeb } from "@pnp/sp/webs";
import { UrlFieldFormatType } from "@pnp/sp/fields";

// for extensions to correctly appear in intellisense we need to extend the interface
// to do this we extend the modules and need to append the /types to the normal import path
// this has to do with where the file we are extending is located
declare module "@pnp/sp/webs/types" {
    /**
     * Returns the instance wrapped by the invokable proxy
     */
    interface IWeb {
        ensureSpecialList: (this: IWeb, title: string, description?: string) => Promise<void>;
    }
}


// we can also add an extension here that will be applied within our entire project
// for more info checkout the article on extensions: ./docs/odata/extensions.md
extendFactory(Web, {

    ensureSpecialList: async function (this: IWeb, title: string, description: string = "An example"): Promise<void> {

        // just an example but we want a way to ensure any web we are working with has a list with a certain shape
        const r = await this.lists.ensure(title, description, 101);

        if (r.created) {
            const batch = this.createBatch();
            r.list.fields.inBatch(batch).addText("TextField");
            r.list.fields.inBatch(batch).addUrl("UrlField", UrlFieldFormatType.Hyperlink);
            await batch.execute();
        }
    },
});

// we can export things we might need
export { IWeb, Web } from "@pnp/sp/webs";
export { UrlFieldFormatType, IFieldAddResult, IField, ChoiceFieldFormatType } from "@pnp/sp/fields";

// this creates an sp const with all of the functionality we imported
// attached for easy import in the rest of your project
export const sp = new SPRest();
