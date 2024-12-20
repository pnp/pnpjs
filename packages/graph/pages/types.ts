
import { combine } from "@pnp/core";
import { body } from "@pnp/queryable";
import { IDeleteable, IGetById, IUpdateable, defaultPath, deleteable, getById, updateable } from "../decorators.js";
import { graphInvokableFactory, _GraphCollection, _GraphInstance, GraphInit, graphPost } from "../graphqueryable.js";
import { ValidWebpart } from "./webpart-types.js";

/**
 * Page
 */
@deleteable()
@updateable()
export class _Page extends _GraphInstance<IPageInfo> { }
export interface IPage extends _Page, IUpdateable<Partial<IPageInfo>>, IDeleteable { }
export const Page = graphInvokableFactory<IPage>(_Page);

/**
 * Pages
 */
@defaultPath("pages")
@getById(Page)
export class _Pages extends _GraphCollection<IPageInfo[]> {
    public get sitePages(): ISitePages {
        return SitePages(this);
    }
}
export interface IPages extends _Pages, IGetById<IPage> { }
export const Pages = graphInvokableFactory<IPages>(_Pages);

/**
 * Site Page
 */
@deleteable()
@updateable()
export class _SitePage extends _GraphInstance<ISitePageInfo> {

    /**
     * Publishes the page
     * @returns void
     */
    public async publish(): Promise<void> {
        return graphPost(SitePage(this, "publish"));
    }

    /**
     * Gets the webparts in the page
     *
     * @returns array fo webpart information
     */
    public async getWebPartsByPosition(): Promise<any> {
        return SitePage(this, "getWebPartsByPosition")();
    }

    /**
     * Get a listing of all the webparts in this page
     */
    public get webparts(): IWebparts {
        return Webparts(this);
    }

    /**
     * Gets the set of horizontal sections
     */
    public get horizontalSections(): IHorizontalSections {
        return HorizontalSections(this);
    }

    /**
     * Gets the set of vertical section
     */
    public get verticalSection(): IVerticalSection {
        return VerticalSection(this);
    }

    /**
     * Creates a vertical section if none exists, returns the vertical section
     */
    public ensureVerticalSection(): IVerticalSection {

        const y = this.select("verticalSection")();

        console.log(y);


        return null;

    }
}
export interface ISitePage extends _SitePage, IUpdateable<Partial<ISitePageInfo>>, IDeleteable { }
export const SitePage = graphInvokableFactory<ISitePage>(_SitePage);

const SitePageTypeString = "microsoft.graph.sitePage";

/**
 * Site Pages
 */
@defaultPath(SitePageTypeString)
export class _SitePages extends _GraphCollection<ISitePageInfo[]> {

    private _pages: IPages;

    constructor(base: GraphInit, path?: string) {
        super(base, path);
        this._pages = this.getParent<IPages>(Pages, "");
    }

    public getById(this: ISitePages, id: string): ISitePage {
        return SitePage(this._pages, combine(id, SitePageTypeString));
    }

    public async add(pageInfo: Partial<Omit<ISitePageInfo, "@odata.type">>): Promise<ISitePageInfo> {
        return graphPost(this._pages, body({ "@odata.type": SitePageTypeString, ...pageInfo }));
    }
}
export interface ISitePages extends _SitePages { }
export const SitePages = graphInvokableFactory<ISitePages>(_SitePages);

@updateable()
@deleteable()
export class _HorizontalSection extends _GraphInstance<IHorizontalSectionInfo> {

    public get columns(): IHorizontalSectionColumns {
        return HorizontalSectionColumns(this);
    }
}
export interface IHorizontalSection extends _HorizontalSection, IUpdateable, IDeleteable { }
export const HorizontalSection = graphInvokableFactory<IHorizontalSection>(_HorizontalSection);

@defaultPath("canvasLayout/horizontalSections")
export class _HorizontalSections extends _GraphCollection<IHorizontalSectionInfo[]> {

    public async add(props: Partial<IHorizontalSectionInfo>): Promise<IHorizontalSectionInfo> {
        return graphPost(this, body(props));
    }

    public getById(id: string | number): IHorizontalSection {
        const section = HorizontalSection(this);
        return section.concat(`('${id}')`);
    }
}
export interface IHorizontalSections extends _HorizontalSections, IGetById<IHorizontalSection, string | number> { }
export const HorizontalSections = graphInvokableFactory<IHorizontalSections>(_HorizontalSections);

export class _HorizontalSectionColumn extends _GraphInstance<IHorizontalSectionColumnInfo> {

    public get webparts(): IWebparts {
        return Webparts(this);
    }
}
export interface IHorizontalSectionColumn extends _HorizontalSectionColumn { }
export const HorizontalSectionColumn = graphInvokableFactory<IHorizontalSectionColumn>(_HorizontalSectionColumn);

@defaultPath("columns")
export class _HorizontalSectionColumns extends _GraphCollection<IHorizontalSectionColumnInfo[]> {

    public getById(id: string | number): IHorizontalSectionColumn {
        const column = HorizontalSectionColumn(this);
        return column.concat(`('${id}')`);
    }
}
export interface IHorizontalSectionColumns extends _HorizontalSectionColumns, IGetById<IHorizontalSectionColumn, string | number> { }
export const HorizontalSectionColumns = graphInvokableFactory<IHorizontalSectionColumns>(_HorizontalSectionColumns);

@updateable()
@deleteable()
@defaultPath("canvasLayout/verticalSection")
export class _VerticalSection extends _GraphInstance<IVerticalSectionInfo> {
    /**
     * Get a listing of all the webparts in this vertical section
     */
    public get webparts(): IWebparts {
        return Webparts(this);
    }
}
export interface IVerticalSection extends _VerticalSection, IUpdateable, IDeleteable { }
export const VerticalSection = graphInvokableFactory<IVerticalSection>(_VerticalSection);

export class _Webpart extends _GraphInstance<ValidWebpart> { }
export interface IWebpart extends _Webpart { }
export const Webpart = graphInvokableFactory<IWebpart>(_Webpart);

@defaultPath("webparts")
export class _Webparts extends _GraphCollection<ValidWebpart[]> {

    /**
     * Gets the webpart information by id from the page's collection
     * @param id string id of the webpart
     * @returns The IWebpart instance
     */
    public getById(id: string): IWebpart {

        const url = this.toUrl();
        const base = url.slice(0, url.indexOf(SitePageTypeString) + SitePageTypeString.length);
        return Webpart([this, base], `webparts/${id}`);
    }
}
export interface IWebparts extends _Webparts, IGetById<IWebpart> { }
export const Webparts = graphInvokableFactory<IWebparts>(_Webparts);


/**
 * Contains info representing a vertical section
 */
export interface IVerticalSectionInfo {
    emphasis: "none" | "netural" | "soft" | "strong" | "unknownFutureValue";
    id: string;
}

/**
 * Contains info representing a horizontal section
 */
export interface IHorizontalSectionInfo {
    emphasis: "none" | "netural" | "soft" | "strong" | "unknownFutureValue";
    id: string;
    layout: "none" | "oneColumn" | "twoColumns" | "threeColumns" | "oneThirdLeftColumn" | "oneThirdRightColumn" | "fullWidth" | "unknownFutureValue";
    columns: IHorizontalSectionColumnInfo[];
}

/**
 * Contains info representing a horizontal section column
 */
export interface IHorizontalSectionColumnInfo {
    id: string;
    width: string;
    webparts: any[];
}

/**
 * Contains info representing a path user
 */
export interface IPageUserInfo {
    displayName: string;
    email?: string;
}

export interface ISitePageInfo extends IPageInfo { }

export interface IPageInfo {
    "@odata.type"?: string;
    "@odata.etag"?: string;
    contentType: {
        id: string;
        name: string;
    };
    createdDateTime: string;
    eTag: string;
    id: string;
    createdBy: { user: IPageUserInfo };
    lastModifiedBy: { user: IPageUserInfo };
    lastModifiedDateTime: string;
    name: string;
    pageLayout: string;
    parentReference: { siteId: string };
    promotionKind: string;
    publishingState: { level: string; versionId: string };
    reactions: any;
    showComments: boolean;
    showRecommendedPages: boolean;
    title: string;
    webUrl: string;
}
