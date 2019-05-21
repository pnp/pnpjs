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
export class _OneNote extends _GraphQueryableInstance<IOnenoteType> implements _IOneNote {

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
export interface _IOneNote {
    readonly notebooks: INotebooks;
    readonly sections: ISections;
    readonly pages: IGraphQueryableCollection<IOnenotePageType[]>;
}
export interface IOneNote extends _IOneNote, IInvokable, IGraphQueryableInstance<IOnenoteType> {}
export const OneNote = graphInvokableFactory<IOneNote>(_OneNote);


/**
 * Describes a notebook instance
 *
 */
export class _Notebook extends _GraphQueryableInstance<INotebookType> implements _INotebook {
    public get sections(): ISections {
        return Sections(this);
    }
}
export interface _INotebook {
    readonly sections: ISections;
}
export interface INotebook extends _INotebook, IInvokable, IGraphQueryableInstance<INotebookType> {}
export const Notebook = graphInvokableFactory<INotebook>(_Notebook);

/**
 * Describes a collection of Notebook objects
 *
 */
@defaultPath("notebooks")
@getById(Notebook)
export class _Notebooks extends _GraphQueryableCollection<INotebookType[]> implements _INotebooks {
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
export interface _INotebooks {
    add(displayName: string): Promise<INotebookAddResult>;
}
export interface INotebooks extends _INotebooks, IInvokable, IGetById<INotebook>, IGraphQueryableCollection<ISectionType[]> {}
export const Notebooks = graphInvokableFactory<INotebooks>(_Notebooks);


/**
 * Describes a sections instance
 */
export class _Section extends _GraphQueryableInstance<ISectionType> implements _ISection { }
export interface _ISection { }
export interface ISection extends _ISection, IInvokable, IGraphQueryableInstance<ISectionType> { }
export const Section = graphInvokableFactory<ISection>(_Section);

/**
 * Describes a collection of Sections objects
 *
 */
@defaultPath("sections")
@getById(Section)
export class _Sections extends _GraphQueryableCollection<ISectionType[]> implements _ISections {
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
export interface _ISections {
    add(displayName: string): Promise<ISectionAddResult>;
}
export interface ISections extends IInvokable, IGetById<ISection>, IGraphQueryableCollection<ISectionType[]> {}
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
