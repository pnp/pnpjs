import { BlobParse, InjectHeaders, TextParse, body } from "@pnp/queryable";
import {
    Notebook as INotebookType,
    Onenote as IOnenoteType,
    OnenoteSection as IOnenoteSectionType,
    OnenotePage as IOnenotePageType,
    SectionGroup as ISectionGroupType,
    RecentNotebook as IRecentNotebookType,
    Operation as IOperationType,
    OnenotePatchContentCommand as IOnenotePatchContentCommand,
} from "@microsoft/microsoft-graph-types";
import {
    _GraphInstance,
    _GraphCollection,
    _GraphQueryable,
    graphInvokableFactory,
    GraphQueryable,
    graphPost,
    graphGet,
    graphPatch,
} from "../graphqueryable.js";
import { defaultPath, deleteable, getById, IDeleteable, IGetById } from "../decorators.js";

type Combine<T, U> = T & U;
/**
 * Represents a onenote entity
 */
@defaultPath("onenote")
export class _OneNote extends _GraphInstance<IOnenoteType> {

    public get notebooks(): INotebooks {
        return Notebooks(this);
    }

    public get pages(): IPages {
        return Pages(this);
    }

    public get resources(): IResources {
        return Resources(this);
    }

    public get sections(): Combine<_GraphCollection<IOnenoteSectionType[]>, Omit<ISections, "add">> {
        return Sections(this);
    }

    public get sectionGroups(): Combine<_GraphCollection<ISectionGroupType[]>, Omit<ISectionGroups, "add">> {
        return SectionGroups(this);
    }
}
export interface IOneNote extends _OneNote { }
export const OneNote = graphInvokableFactory<IOneNote>(_OneNote);

/**
 * Describes a notebook instance
 *
 */
export class _Notebook extends _GraphInstance<INotebookType> {
    public get sections(): Combine<_GraphCollection<IOnenoteSectionType[]>, Pick<ISections, "add">> {
        return Sections(this);
    }

    public get sectionGroups(): Combine<_GraphCollection<ISectionGroupType[]>, Pick<ISectionGroups, "add">> {
        return SectionGroups(this);
    }

    /**
     * Copy notebook
     * @param props of type ICopyProps. groupId (id of group to copy to. Use only when copying to M365 group), renameAs name of the copy.
     */
    public async copy(props: ICopyProps): Promise<IOperationType> {
        return graphPost(GraphQueryable(this, "copyNoteBook"), body(props));
    }
}
export interface INotebook extends _Notebook { }
export const Notebook = graphInvokableFactory<INotebook>(_Notebook);

/**
 * Describes a collection of Notebook objects
 *
 */
@defaultPath("notebooks")
@getById(Notebook)
export class _Notebooks extends _GraphCollection<INotebookType[]> {
    /**
     * Create a new notebook as specified in the request body.
     *
     * @param displayName Notebook display name
     */
    public async add(displayName: string): Promise<INotebookType> {
        return graphPost(this, body({ displayName }));
    }

    /**
     * Get a list of recent notebooks for the sign-in user
     * @param includePersonalNotebooks Include notebooks owned by the user. Set to true to include notebooks owned by the user; otherwise, set to false.
     */
    public async recent(includePersonalNotebooks = false): Promise<IRecentNotebookType[]> {
        return graphGet(GraphQueryable(this, `getRecentNotebooks(includePersonalNotebooks=${includePersonalNotebooks})`));
    }
}
export interface INotebooks extends _Notebooks, IGetById<INotebook> { }
export const Notebooks = graphInvokableFactory<INotebooks>(_Notebooks);

/**
 * Describes a OneNote sections instance
 */
export class _Section extends _GraphInstance<IOnenoteSectionType> {

    public get pages(): IPages {
        return Pages(this);
    }

    /**
     * Copy section to notebook
     * @param props of type ICopySectionProps. groupId (id of group to copy to. Use only when copying to M365 group), id of destination  notebook, renameAs name of the copy.
     */
    public async copyToNotebook(props: ICopySectionProps): Promise<IOperationType> {
        return graphPost(GraphQueryable(this, "copyToNoteBook"), body(props));
    }

    /**
     * Copy section group
     * @param props of type ICopySectionProps. groupId (id of group to copy to. Use only when copying to M365 group), id of destination  notebook, renameAs name of the copy.
     */
    public async copyToSectionGroup(props: ICopySectionProps): Promise<IOperationType> {
        return graphPost(GraphQueryable(this, "copyToNoteBook"), body(props));
    }
}
export interface ISection extends _Section { }
export const Section = graphInvokableFactory<ISection>(_Section);

/**
 * Describes a collection of onenote sections objects
 *
 */
@defaultPath("sections")
@getById(Section)
export class _Sections extends _GraphCollection<IOnenoteSectionType[]> {
    /**
     * Adds a new section
     *
     * @param displayName New section display name
     */
    public async add(displayName: string): Promise<IOnenoteSectionType> {
        return graphPost(this, body({ displayName }));
    }
}
export interface ISections extends _Sections, IGetById<ISection> { }
export const Sections = graphInvokableFactory<ISections>(_Sections);

/**
 * Describes a root onenote sections group instance
 */
export class _SectionGroup extends _GraphInstance<ISectionGroupType> {
    public get sections(): ISections {
        return Sections(this);
    }
}
export interface ISectionGroup extends _SectionGroup { }
export const SectionGroup = graphInvokableFactory<ISectionGroup>(_SectionGroup);

/**
 * Describes a collection of Sections objects
 *
 */
@defaultPath("sectiongroups")
@getById(SectionGroup)
export class _SectionGroups extends _GraphCollection<ISectionGroupType[]> {
    /**
    * Adds a new section group
    * @param displayName New section group display name
    */
    public async add(displayName: string): Promise<ISectionGroupType> {
        return graphPost(this, body({ displayName }));
    }

    public get sections(): ISections {
        return Sections(this);
    }
}
export interface ISectionGroups extends _SectionGroups, IGetById<ISectionGroup> { }
export const SectionGroups = graphInvokableFactory<ISectionGroups>(_SectionGroups);

/**
 * Describes a page instance
 *
 */
@deleteable()
export class _Page extends _GraphInstance<IOnenotePageType> {
    /**
     * Copy page to section
     * @param props of type ICopyPageProps. groupId (id of group to copy to. Use only when copying to M365 group), id of destination  notebook
     */
    public async copyToSection(props: ICopyPageProps): Promise<IOperationType> {
        return graphPost(GraphQueryable(this, "copyToSection"), body(props));
    }

    /**
     * Gets contents of a page
     *
     * @param includeIDs page html body
     */
    public async content(includeIDs = false): Promise<string> {
        return Page(this, `content?includeIDs=${includeIDs}`).using(TextParse())();
    }

    /**
     * Copy page to section
     * @param props of type IOnenotePatchContentCommand.
     */
    public async update(props: IOnenotePatchContentCommand[]): Promise<void> {
        return graphPatch(GraphQueryable(this, "content"), body(props));
    }
}
export interface IPage extends _Page, IDeleteable { }
export const Page = graphInvokableFactory<IPage>(_Page);

/**
 * Describes a collection of page objects
 *
 */
@defaultPath("pages")
@getById(Page)
export class _Pages extends _GraphCollection<IOnenotePageType[]> {
    /**
     * Create a new page as specified in the request body.
     *
     * @param html page html body
     */
    public async add(html: string): Promise<IOnenotePageType> {
        const q = GraphQueryable(this);
        q.using(InjectHeaders({
            "Content-Type": "text/html",
        }));

        return graphPost(q, { body: html });
    }
}
export interface IPages extends _Pages, IGetById<IPage> { }
export const Pages = graphInvokableFactory<IPages>(_Pages);

/**
 * Describes a resources
 *
 */
@defaultPath("resources")
export class _Resources extends _GraphInstance {
    /**
     * getById returns a Blob. API does not support getting JSON representation.
     * @param id id of the resource in a OneNote page
     * @returns Blob of the resource from a OneNote page
     */
    public getById(id: string): _GraphQueryable {
        return GraphQueryable(this, `${id}/content`).using(BlobParse());
    }
}
export interface IResources extends _Resources { }
export const Resources = graphInvokableFactory<IResources>(_Resources);


export interface ICopyProps {
    groupId?: string;
    renameAs?: string;
}

export interface ICopySectionProps extends ICopyProps {
    id: string;
}

export interface ICopyPageProps {
    groupId?: string;
    id: string;
}
