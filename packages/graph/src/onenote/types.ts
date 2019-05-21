import { IInvokable, body } from "@pnp/odata";
import { Notebook as INotebookType, Onenote as IOnenoteType, OnenoteSection as ISectionType, OnenotePage as IOnenotePageType } from "@microsoft/microsoft-graph-types";
import {
    GraphQueryableCollection,
    _GraphQueryableInstance,
    _GraphQueryableCollection,
    IGraphQueryableCollection,
    IGraphQueryableInstance,
    graphInvokableFactory,
} from "../graphqueryable";
import { defaultPath, getById, IGetById } from "../decorators";
import { graphPost } from "../operations";

/**
 * Represents a onenote entity
 */
@defaultPath("onenote")
export class _OneNote extends _GraphQueryableInstance<IOnenoteType> implements IOneNote {

    public get notebooks(): INotebooks {
        return Notebooks(this);
    }

    public get sections(): ISections {
        return Sections(this);
    }

    public get pages(): IGraphQueryableCollection<IOnenotePageType[]> {
        return <any>GraphQueryableCollection(this, "pages");
    }
}
export interface IOneNote extends IInvokable, IGraphQueryableInstance<IOnenoteType> {
    readonly notebooks: INotebooks;
    readonly sections: ISections;
    readonly pages: IGraphQueryableCollection<IOnenotePageType[]>;
}
export interface _OneNote extends IInvokable { }
export const OneNote = graphInvokableFactory<IOneNote>(_OneNote);


/**
 * Describes a notebook instance
 *
 */
export class _Notebook extends _GraphQueryableInstance<INotebookType> implements INotebook {
    public get sections(): ISections {
        return Sections(this);
    }
}
export interface INotebook extends IInvokable, IGraphQueryableInstance<INotebookType> {
    readonly sections: ISections;
}
export interface _Notebook extends IInvokable { }
export const Notebook = graphInvokableFactory<INotebook>(_Notebook);

/**
 * Describes a collection of Notebook objects
 *
 */
@defaultPath("notebooks")
@getById(Notebook)
export class _Notebooks extends _GraphQueryableCollection<INotebookType[]> implements INotebooks {
    /**
     * Create a new notebook as specified in the request body.
     * 
     * @param displayName Notebook display name
     */
    public async add(displayName: string): Promise<INotebookAddResult> {

        const data = await graphPost(this, body({ displayName }));

        return {
            data,
            notebook: this.getById(data.id),
        };
    }
}
export interface INotebooks extends IInvokable, IGetById<INotebook>, IGraphQueryableCollection<ISectionType[]> {
    add(displayName: string): Promise<INotebookAddResult>;
}
export interface _Notebooks extends IInvokable, IGetById<INotebook> { }
export const Notebooks = graphInvokableFactory<INotebooks>(_Notebooks);


/**
 * Describes a sections instance
 */
export class _Section extends _GraphQueryableInstance<ISectionType> implements ISection { }
export interface ISection extends IInvokable, IGraphQueryableInstance<ISectionType> { }
export interface _Section extends IInvokable { }
export const Section = graphInvokableFactory<ISection>(_Section);

/**
 * Describes a collection of Sections objects
 *
 */
@defaultPath("sections")
@getById(Section)
export class _Sections extends _GraphQueryableCollection<ISectionType[]> implements ISections {
    /**
     * Adds a new section
     * 
     * @param displayName New section display name
     */
    public async add(displayName: string): Promise<ISectionAddResult> {

        const data = await graphPost(this, body({ displayName }));

        return {
            data,
            section: this.getById(data.id),
        };
    }
}
export interface ISections extends IInvokable, IGetById<ISection>, IGraphQueryableCollection<ISectionType[]> {
    add(displayName: string): Promise<ISectionAddResult>;
}
export interface _Sections extends IInvokable, IGetById<ISection> { }
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
