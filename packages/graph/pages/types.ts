
import { combine } from "@pnp/core";
import { IDeleteable, IGetById, IUpdateable, defaultPath, deleteable, getById, updateable } from "../decorators.js";
import { graphInvokableFactory, _GraphCollection, _GraphInstance, GraphInit, graphPost } from "../graphqueryable.js";
import { body } from "@pnp/queryable";

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
     * Gets the set of horizontal sections
     */
    public get horizontalSections(): IHorizontalSections {
        return HorizontalSections(this);
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

export class _HorizontalSection extends _GraphInstance<IHorizontalSectionInfo> {}
export interface IHorizontalSection extends _HorizontalSection { }
export const HorizontalSection = graphInvokableFactory<IHorizontalSection>(_HorizontalSection);

@getById(HorizontalSection)
@defaultPath("canvasLayout/horizontalSections")
export class _HorizontalSections extends _GraphCollection<IHorizontalSectionInfo[]> {

    public async add(props: Partial<IHorizontalSectionInfo>): Promise<IHorizontalSectionInfo> {
        return graphPost(this, body(props));
    }
}
export interface IHorizontalSections extends _HorizontalSections, IGetById<IHorizontalSection, number> { }
export const HorizontalSections = graphInvokableFactory<IHorizontalSections>(_HorizontalSections);







export interface IHorizontalSectionInfo {
    emphasis: "none" | "netural" | "soft" | "strong" | "unknownFutureValue";
    id: string;
    layout: "none" | "oneColumn" | "twoColumns" | "threeColumns" | "oneThirdLeftColumn" | "oneThirdRightColumn" | "fullWidth" | "unknownFutureValue";
    columns: IHorizontalSectionColumnInfo[];
}

export interface IHorizontalSectionColumnInfo {
    id: string;
    width: string;
    webparts: any[];
}


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
