import { body } from "@pnp/queryable";
import { Notebook as INotebookType, Onenote as IOnenoteType, OnenoteSection as ISectionType, OnenotePage as IOnenotePageType } from "@microsoft/microsoft-graph-types";
import {
    GraphQueryableCollection,
    _GraphQueryableInstance,
    _GraphQueryableCollection,
    IGraphQueryableCollection,
    graphInvokableFactory,
} from "../graphqueryable.js";
import { defaultPath, getById, IGetById } from "../decorators.js";
import { graphPost } from "../operations.js";

/**
 * Represents a onenote entity
 */
@defaultPath("onenote")
export class _OneNote extends _GraphQueryableInstance<IOnenoteType> {

    public get notebooks(): INotebooks {
        return Notebooks(this);
    }

    public get sections(): ISections {
        return Sections(this);
    }

    public get pages(): IGraphQueryableCollection<IOnenotePageType[]> {
        return GraphQueryableCollection(this, "pages");
    }
}
export interface IOneNote extends _OneNote {}
export const OneNote = graphInvokableFactory<IOneNote>(_OneNote);


/**
 * Describes a notebook instance
 *
 */
export class _Notebook extends _GraphQueryableInstance<INotebookType> {
    public get sections(): ISections {
        return Sections(this);
    }
}
export interface INotebook extends _Notebook {}
export const Notebook = graphInvokableFactory<INotebook>(_Notebook);

/**
 * Describes a collection of Notebook objects
 *
 */
@defaultPath("notebooks")
@getById(Notebook)
export class _Notebooks extends _GraphQueryableCollection<INotebookType[]> {
    /**
     * Create a new notebook as specified in the request body.
     *
     * @param displayName Notebook display name
     */
    public async add(displayName: string): Promise<INotebookAddResult> {

        const data = await graphPost(this, body({ displayName }));

        return {
            data,
            notebook: (<any>this).getById(data.id),
        };
    }
}
export interface INotebooks extends _Notebooks, IGetById<INotebook> {}
export const Notebooks = graphInvokableFactory<INotebooks>(_Notebooks);


/**
 * Describes a sections instance
 */
export class _Section extends _GraphQueryableInstance<ISectionType> { }
export interface ISection extends _Section { }
export const Section = graphInvokableFactory<ISection>(_Section);

/**
 * Describes a collection of Sections objects
 *
 */
@defaultPath("sections")
@getById(Section)
export class _Sections extends _GraphQueryableCollection<ISectionType[]> {
    /**
     * Adds a new section
     *
     * @param displayName New section display name
     */
    public async add(displayName: string): Promise<ISectionAddResult> {

        const data = await graphPost(this, body({ displayName }));

        return {
            data,
            section: (<any>this).getById(data.id),
        };
    }
}
export interface ISections extends _Sections, IGetById<ISection> {}
export const Sections = graphInvokableFactory<ISections>(_Sections);

/**
 * INotebookAddResult
 */
export interface INotebookAddResult {
    data: any;
    notebook: INotebook;
}

/**
 * ISectionAddResult
 */
export interface ISectionAddResult {
    data: any;
    section: ISection;
}
