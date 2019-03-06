import { List } from "./lists";
import { TemplateFileType, FileAddResult, File } from "./files";
import { Item, ItemUpdateResult } from "./items";
import { TypedHash, extend, combine, getGUID, getAttrValueFromString, jsS, hOP, objectDefinedNotNull } from "@pnp/common";
import { SharePointQueryable } from "./sharepointqueryable";
import { metadata } from "./utils/metadata";

/**
 * Page promotion state
 */
export const enum PromotedState {
    /**
     * Regular client side page
     */
    NotPromoted = 0,
    /**
     * Page that will be promoted as news article after publishing
     */
    PromoteOnPublish = 1,
    /**
     * Page that is promoted as news article
     */
    Promoted = 2,
}

/**
 * Type describing the available page layout types for client side "modern" pages
 */
export type ClientSidePageLayoutType = "Article" | "Home";

/**
 * Column size factor. Max value is 12 (= one column), other options are 8,6,4 or 0
 */
export type CanvasColumnFactor = 0 | 2 | 4 | 6 | 8 | 12;

/**
 * Gets the next order value 1 based for the provided collection
 * 
 * @param collection Collection of orderable things
 */
function getNextOrder(collection: { order: number }[]): number {

    if (collection.length < 1) {
        return 1;
    }

    return Math.max.apply(null, collection.map(i => i.order)) + 1;
}

/**
 * Normalizes the order value for all the sections, columns, and controls to be 1 based and stepped (1, 2, 3...)
 * 
 * @param collection The collection to normalize
 */
function reindex(collection: { order: number, columns?: { order: number }[], controls?: { order: number }[] }[]): void {

    for (let i = 0; i < collection.length; i++) {
        collection[i].order = i + 1;
        if (hOP(collection[i], "columns")) {
            reindex(collection[i].columns);
        } else if (hOP(collection[i], "controls")) {
            reindex(collection[i].controls);
        }
    }
}

/**
 * Represents the data and methods associated with client side "modern" pages
 */
export class ClientSidePage extends File {

    private _id: number | null;
    private _pageJson: IPageData;
    private _pageSettings: IClientSidePageSettingsSlice;

    /**
     * Creates a new instance of the ClientSidePage class
     *
     * @param baseUrl The url or SharePointQueryable which forms the parent of this web collection
     * @param commentsDisabled Indicates if comments are disabled, not valid until load is called
     */
    constructor(file: File, public commentsDisabled = false, public sections: CanvasSection[] = []) {
        super(file);
        this._id = null;
    }

    /**
     * Creates a new blank page within the supplied library
     * 
     * @param library The library in which to create the page
     * @param pageName Filename of the page, such as "page.aspx"
     * @param title The display title of the page
     * @param pageLayoutType Layout type of the page to use
     */
    public static create(library: List, pageName: string, title: string, pageLayoutType: ClientSidePageLayoutType = "Article"): Promise<ClientSidePage> {

        // see if file exists, if not create it
        return library.rootFolder.files.select("Name").filter(`Name eq '${pageName}'`).get().then((fs: any[]) => {

            if (fs.length > 0) {
                throw Error(`A file with the name '${pageName}' already exists in the library '${library.toUrl()}'.`);
            }

            // get our server relative path
            return library.rootFolder.select("ServerRelativePath").get().then(path => {

                const pageServerRelPath = combine("/", path.ServerRelativePath.DecodedUrl, pageName);

                // add the template file
                return library.rootFolder.files.addTemplateFile(pageServerRelPath, TemplateFileType.ClientSidePage).then((far: FileAddResult) => {

                    // get the item associated with the file
                    return far.file.getItem().then((i: Item) => {

                        // update the item to have the correct values to create the client side page
                        return i.update({
                            BannerImageUrl: {
                                Url: "/_layouts/15/images/sitepagethumbnail.png",
                            },
                            ClientSideApplicationId: "b6917cb1-93a0-4b97-a84d-7cf49975d4ec",
                            ContentTypeId: "0x0101009D1CB255DA76424F860D91F20E6C4118",
                            PageLayoutType: pageLayoutType,
                            PromotedState: PromotedState.NotPromoted,
                            Title: title,
                        }).then((iar: ItemUpdateResult) => ClientSidePage.fromFile(iar.item.file));
                    });
                });
            });
        });
    }

    /**
     * Creates a new ClientSidePage instance from the provided html content string
     * 
     * @param html HTML markup representing the page
     */
    public static fromFile(file: File): Promise<ClientSidePage> {
        const page = new ClientSidePage(file);
        return page.load().then(_ => page);
    }

    /**
     * Converts a json object to an escaped string appropriate for use in attributes when storing client-side controls
     * 
     * @param json The json object to encode into a string
     */
    public static jsonToEscapedString(json: any): string {

        return jsS(json)
            .replace(/"/g, "&quot;")
            .replace(/:/g, "&#58;")
            .replace(/{/g, "&#123;")
            .replace(/}/g, "&#125;")
            .replace(/\[/g, "\[")
            .replace(/\]/g, "\]")
            .replace(/\*/g, "\*")
            .replace(/\$/g, "\$")
            .replace(/\./g, "\.");
    }

    /**
     * Converts an escaped string from a client-side control attribute to a json object
     * 
     * @param escapedString 
     */
    public static escapedStringToJson<T = any>(escapedString: string, noParse = false): T {
        const unespace = (escaped: string): string => {
            const mapDict = [
                [/&quot;/g, "\""], [/&#58;/g, ":"], [/&#123;/g, "{"], [/&#125;/g, "}"],
                [/\\\\/g, "\\"], [/\\\?/g, "?"], [/\\\./g, "."], [/\\\[/g, "["], [/\\\]/g, "]"],
                [/\\\(/g, "("], [/\\\)/g, ")"], [/\\\|/g, "|"], [/\\\+/g, "+"], [/\\\*/g, "*"],
                [/\\\$/g, "$"],
            ];
            return mapDict.reduce((r, m) => r.replace(m[0], m[1] as string), escaped);
        };

        const v = objectDefinedNotNull(escapedString) ? unespace(escapedString) : null;
        if (noParse) {
            return <any>v;
        } else {
            return JSON.parse(v);
        }
    }

    /**
     * Add a section to this page
     */
    public addSection(): CanvasSection {
        const section = new CanvasSection(this, getNextOrder(this.sections));
        this.sections.push(section);
        return section;
    }

    public fromJSON(pageData: IPageData): this {
        this._pageJson = pageData;

        const canvasControls: IClientSideControlBaseData[] = JSON.parse(pageData.CanvasContent1);

        if (canvasControls && canvasControls.length) {

            for (let i = 0; i < canvasControls.length; i++) {

                // if no control type is present this is a column which we give type 0 to let us process it
                const controlType = hOP(canvasControls[i], "controlType") ? canvasControls[i].controlType : 0;

                switch (controlType) {

                    case 0:
                        // empty canvas column or page settings
                        if (hOP(canvasControls[i], "pageSettingsSlice")) {
                            this._pageSettings = <IClientSidePageSettingsSlice>canvasControls[i];
                        } else {
                            // we have an empty column
                            this.mergeColumnToTree(new CanvasColumn(<IClientSidePageColumnData>canvasControls[i]));
                        }
                        break;
                    case 3:
                        const part = new ClientSideWebpart(<IClientSideWebPartData>canvasControls[i]);
                        this.mergePartToTree(part, part.data.position);
                        break;
                    case 4:
                        const text = new ClientSideText(<IClientSideTextData>canvasControls[i]);
                        this.mergePartToTree(text, text.data.position);
                        break;
                }
            }
        }

        return this;
    }

    /**
     * Loads this page's content from the server
     */
    public async load(): Promise<ClientSidePage> {

        // load item id, then load page data from new pages api
        return this.getItem<{ Id: number, CommentsDisabled: boolean }>("Id", "CommentsDisabled").then(item => {
            return (new SharePointQueryable(`_api/sitepages/pages(${item.Id})`)).get<IPageData>().then(pageData => {
                this.commentsDisabled = item.CommentsDisabled;
                this._id = item.Id;
                return this.fromJSON(pageData);
            });
        });
    }

    /**
     * Persists the content changes (sections, columns, and controls) [does not work with batching]
     * 
     * @param publish If true the page is published, if false the changes are persisted to SharePoint but not published
     */
    public save(publish = true): Promise<boolean> {

        if (this._id === null) {
            throw Error("The id for this page is null. If you want to create a new page, please use ClientSidePage.Create");
        }

        let promise = Promise.resolve<any>({});
        let existingJson = this._pageJson;

        // we try and check out the page for the user
        if (!this._pageJson.IsPageCheckedOutToCurrentUser) {
            promise = promise.then(_ => (this.getPoster(`_api/sitepages/pages(${this._id})/checkoutpage`)).postCore<IPageData>().then(d => {
                existingJson = d;
            }));
        }

        promise = promise.then(_ => (this.getPoster(`_api/sitepages/pages(${this._id})/savepage`)).postCore<boolean>({
            body: jsS(Object.assign(metadata("SP.Publishing.SitePage"), {
                AuthorByline: existingJson.AuthorByline,
                BannerImageUrl: existingJson.BannerImageUrl,
                CanvasContent1: this.getCancasContent1(),
                LayoutWebpartsContent: existingJson.LayoutWebpartsContent,
                TopicHeader: existingJson.TopicHeader,
            })),
        }));

        if (publish) {
            promise = promise.then(_ => (this.getPoster(`_api/sitepages/pages(${this._id})/publish`)).postCore<boolean>());
        }

        return promise;
    }

    /**
     * Enables comments on this page
     */
    public enableComments(): Promise<ItemUpdateResult> {
        return this.setCommentsOn(true).then(r => {
            this.commentsDisabled = false;
            return r;
        });
    }

    /**
     * Disables comments on this page
     */
    public disableComments(): Promise<ItemUpdateResult> {
        return this.setCommentsOn(false).then(r => {
            this.commentsDisabled = true;
            return r;
        });
    }

    /**
     * Finds a control by the specified instance id
     *
     * @param id Instance id of the control to find
     */
    public findControlById<T extends ColumnControl<any> = ColumnControl<any>>(id: string): T {
        return this.findControl((c) => c.id === id);
    }

    /**
     * Finds a control within this page's control tree using the supplied predicate
     *
     * @param predicate Takes a control and returns true or false, if true that control is returned by findControl
     */
    public findControl<T extends ColumnControl<any> = ColumnControl<any>>(predicate: (c: ColumnControl<any>) => boolean): T {
        // check all sections
        for (let i = 0; i < this.sections.length; i++) {
            // check all columns
            for (let j = 0; j < this.sections[i].columns.length; j++) {
                // check all controls
                for (let k = 0; k < this.sections[i].columns[j].controls.length; k++) {
                    // check to see if the predicate likes this control
                    if (predicate(this.sections[i].columns[j].controls[k])) {
                        return <T>this.sections[i].columns[j].controls[k];
                    }
                }
            }
        }

        // we found nothing so give nothing back
        return null;
    }

    /**
     * Like the modern site page
     */
    public like(): Promise<void> {
        return this.getItem().then(i => {
            return i.like();
        });
    }

    /**
     * Unlike the modern site page
     */
    public unlike(): Promise<void> {
        return this.getItem().then(i => {
            return i.unlike();
        });
    }

    /**
     * Get the liked by information for a modern site page     
     */
    public getLikedByInformation(): Promise<void> {
        return this.getItem().then(i => {
            return i.getLikedByInformation();
        });
    }

    protected getCancasContent1(): string {

        // reindex things
        reindex(this.sections);

        // rollup the control changes
        const canvasData: any[] = [];

        this.sections.forEach(section => {
            section.columns.forEach(column => {
                if (column.controls.length < 1) {
                    canvasData.push({
                        displayMode: column.data.displayMode,
                        emphasis: column.data.emphasis,
                        position: column.data.position,
                    });
                } else {
                    column.controls.forEach(control => canvasData.push(control.data));
                }
            });
        });

        return JSON.stringify(canvasData);
    }

    private getPoster(url: string): ClientSidePage {
        return new ClientSidePage(new File(url));
    }

    /**
     * Sets the comments flag for a page
     * 
     * @param on If true comments are enabled, false they are disabled
     */
    private setCommentsOn(on: boolean): Promise<ItemUpdateResult> {
        return this.getItem().then(i => {
            const updater = new Item(i, `SetCommentsDisabled(${!on})`);
            return updater.update({});
        });
    }

    /**
     * Merges the control into the tree of sections and columns for this page
     * 
     * @param control The control to merge
     */
    private mergePartToTree(control: any, positionData: IClientSideControlPositionData): void {

        let section: CanvasSection = null;
        let column: CanvasColumn = null;
        let sectionFactor: CanvasColumnFactor = 12;
        let sectionIndex = 0;
        let zoneIndex = 0;

        // handle case where we don't have position data (shouldn't happen?)
        if (positionData) {
            if (hOP(positionData, "zoneIndex")) {
                zoneIndex = positionData.zoneIndex;
            }
            if (hOP(positionData, "sectionIndex")) {
                sectionIndex = positionData.sectionIndex;
            }
            if (hOP(positionData, "sectionFactor")) {
                sectionFactor = positionData.sectionFactor;
            }
        }

        const sections = this.sections.filter(s => s.order === zoneIndex);
        if (sections.length < 1) {
            section = new CanvasSection(this, zoneIndex);
            this.sections.push(section);
        } else {
            section = sections[0];
        }

        const columns = section.columns.filter(c => c.order === sectionIndex);
        if (columns.length < 1) {
            // create empty column
            column = new CanvasColumn({
                controlType: 0,
                displayMode: 2,
                emphasis: {},
                position: {
                    layoutIndex: 1,
                    sectionFactor: sectionFactor,
                    sectionIndex: sectionIndex,
                    zoneIndex: zoneIndex,
                },
            });
            section.columns.push(column);
        } else {
            column = columns[0];
        }

        control.column = column;
        column.addControl(control);
    }

    /**
     * Merges the supplied column into the tree
     * 
     * @param column Column to merge
     * @param position The position data for the column
     */
    private mergeColumnToTree(column: CanvasColumn): void {

        const order = hOP(column.data, "position") && hOP(column.data.position, "zoneIndex") ? column.data.position.zoneIndex : 0;
        let section: CanvasSection = null;
        const sections = this.sections.filter(s => s.order === order);

        if (sections.length < 1) {
            section = new CanvasSection(this, order);
            this.sections.push(section);
        } else {
            section = sections[0];
        }

        column.section = section;
        section.columns.push(column);
    }
}

export abstract class CanvasControl<PayloadType extends ICanvasControlBaseData> {

    constructor(protected json: PayloadType) { }

    public get id(): string {
        return this.json.id;
    }

    public get data(): PayloadType {
        return this.json;
    }

    protected setData(data: PayloadType) {
        this.json = data;
    }
}

export class CanvasSection {

    /**
     * Used to track this object inside the collection at runtime
     */
    private _memId: string;

    constructor(public page: ClientSidePage, public order: number, public columns: CanvasColumn[] = []) {
        this._memId = getGUID();
    }

    /**
     * Default column (this.columns[0]) for this section
     */
    public get defaultColumn(): CanvasColumn {

        if (this.columns.length < 1) {
            this.addColumn(12);
        }

        return this.columns[0];
    }

    /**
     * Adds a new column to this section
     */
    public addColumn(factor: CanvasColumnFactor): CanvasColumn {
        const column = new CanvasColumn();
        column.order = getNextOrder(this.columns);
        column.factor = factor;
        this.columns.push(column);
        return column;
    }

    /**
     * Adds a control to the default column for this section
     *
     * @param control Control to add to the default column
     */
    public addControl(control: ColumnControl<any>): this {
        this.defaultColumn.addControl(control);
        return this;
    }

    /**
     * Removes this section and all contained columns and controls from the collection
     */
    public remove(): void {
        this.page.sections = this.page.sections.filter(section => section._memId !== this._memId);
        // TODO::
        // reindex(this.page.sections);
    }
}

export class CanvasColumn {

    public static Default: IClientSidePageColumnData = {
        controlType: 0,
        displayMode: 2,
        emphasis: {},
        position: {
            layoutIndex: 1,
            sectionFactor: 12,
            sectionIndex: 1,
            zoneIndex: 1,
        },
    };

    private _section: CanvasSection | null;

    constructor(protected json: IClientSidePageColumnData = CanvasColumn.Default, public controls: ColumnControl<any>[] = []) {
        this._section = null;
    }

    public get data(): IClientSidePageColumnData {
        return this.json;
    }

    public get section(): CanvasSection {
        return this._section;
    }

    public set section(section: CanvasSection) {
        this._section = section;
    }

    public get order(): number {
        return this.data.position.sectionIndex;
    }

    public set order(value: number) {
        this.data.position.sectionIndex = value;
    }

    public get factor(): CanvasColumnFactor {
        return this.data.position.sectionFactor;
    }

    public set factor(value: CanvasColumnFactor) {
        this.data.position.sectionFactor = value;
    }

    public addControl(control: ColumnControl<any>): this {
        control.column = this;
        this.controls.push(control);
        return this;
    }

    public getControl<T extends ColumnControl<any>>(index: number): T {
        return <T>this.controls[index];
    }

    // add to section
    // remove
    // setFactor
    // reorder is done with array methods and reindex on save
}

export abstract class ColumnControl<T extends ICanvasControlBaseData> extends CanvasControl<T> {

    private _column: CanvasColumn | null;

    protected abstract onColumnChange(col: CanvasColumn): void;

    public abstract get order(): number;
    public abstract set order(value: number);

    public get column(): CanvasColumn | null {
        return this._column;
    }

    public set column(value: CanvasColumn) {
        this._column = value;
        this.onColumnChange(this._column);
    }
}

export class ClientSideText extends ColumnControl<IClientSideTextData> {

    public static fromText(text: string) {

        const o = new ClientSideText({
            addedFromPersistedData: false,
            anchorComponentId: "",
            controlType: 4,
            displayMode: 2,
            editorType: "CKEditor",
            emphasis: {},
            id: "",
            innerHTML: "",
            position: {
                controlIndex: 1,
                layoutIndex: 1,
                sectionFactor: 12,
                sectionIndex: 1,
                zoneIndex: 1,
            },
        });

        o.text = text;
        return o;
    }

    public get text(): string {
        return this.data.innerHTML;
    }

    public set text(value: string) {
        if (!value.startsWith("<p>")) {
            value = `<p>${value}</p>`;
        }
        this.data.innerHTML = value;
    }

    public get order(): number {
        return this.data.position.controlIndex;
    }

    public set order(value: number) {
        this.data.position.controlIndex = value;
    }

    protected onColumnChange(col: CanvasColumn): void {
        this.data.position.sectionFactor = col.factor;
        this.data.position.controlIndex = getNextOrder(col.controls);
        this.data.position.zoneIndex = col.data.position.zoneIndex;
        this.data.position.sectionIndex = col.data.position.sectionIndex;
    }

    // add to column
    // remove
    // reorder is done with array methods and reindex on save
}

export class ClientSideWebpart extends ColumnControl<IClientSideWebPartData> {

    public static Default: IClientSideWebPartData = {
        addedFromPersistedData: false,
        controlType: 3,
        displayMode: 2,
        emphasis: {},
        id: null,
        position: {
            controlIndex: 1,
            sectionFactor: 12,
            sectionIndex: 1,
            zoneIndex: 1,
        },
        reservedHeight: 500,
        reservedWidth: 500,
        webPartData: null,
        webPartId: null,
    };

    constructor(json: IClientSideWebPartData = ClientSideWebpart.Default) {
        super(json);
    }

    public static fromComponentDef(definition: ClientSidePageComponent): ClientSideWebpart {
        const part = new ClientSideWebpart();
        part.import(definition);
        return part;
    }

    public get title(): string {
        return this.data.webPartData.title;
    }

    public set title(value: string) {
        this.data.webPartData.title = value;
    }

    public get description(): string {
        return this.data.webPartData.description;
    }

    public set description(value: string) {
        this.data.webPartData.description = value;
    }

    public get order(): number {
        return this.data.position.controlIndex;
    }

    public set order(value: number) {
        this.data.position.controlIndex = value;
    }

    public get height(): number {
        return this.data.reservedHeight;
    }

    public set height(value: number) {
        this.data.reservedHeight = value;
    }

    public get width(): number {
        return this.data.reservedWidth;
    }

    public set width(value: number) {
        this.data.reservedWidth = value;
    }

    public get dataVersion(): string {
        return this.data.webPartData.dataVersion;
    }

    public set dataVersion(value: string) {
        this.data.webPartData.dataVersion = value;
    }

    public setProperties<T = any>(properties: T): this {
        this.data.webPartData.properties = extend(this.data.webPartData.properties, properties);
        return this;
    }

    public getProperties<T = any>(): T {
        return <T>this.data.webPartData.properties;
    }

    protected onColumnChange(col: CanvasColumn): void {
        this.data.position.sectionFactor = col.factor;
        this.data.position.controlIndex = getNextOrder(col.controls);
        this.data.position.zoneIndex = col.data.position.zoneIndex;
        this.data.position.sectionIndex = col.data.position.sectionIndex;
    }

    protected import(component: ClientSidePageComponent): void {

        const id = getGUID();
        const componendId = component.Id.replace(/^\{|\}$/g, "").toLowerCase();
        const manifest: IClientSidePageComponentManifest = JSON.parse(component.Manifest);
        const preconfiguredEntries = manifest.preconfiguredEntries[0];

        this.setData(Object.assign({}, this.data, <IClientSideWebPartData>{
            id,
            webPartData: {
                dataVersion: "1.0",
                description: preconfiguredEntries.description.default,
                id: componendId,
                instanceId: id,
                properties: preconfiguredEntries.properties,
                title: preconfiguredEntries.title.default,
            },
            webPartId: componendId,
        }));
    }
}

export interface IPageData {
    "odata.metadata": string;
    "odata.type": "SP.Publishing.SitePage";
    "odata.id": string;
    "odata.editLink": string;
    "AbsoluteUrl": string;
    "AuthorByline": string | null;
    "BannerImageUrl": string;
    "ContentTypeId": null | string;
    "Description": string;
    "DoesUserHaveEditPermission": boolean;
    "FileName": string;
    "FirstPublished": string;
    "Id": number;
    "IsPageCheckedOutToCurrentUser": boolean;
    "IsWebWelcomePage": boolean;
    "Modified": string;
    "PageLayoutType": ClientSidePageLayoutType;
    "Path": {
        "DecodedUrl": string;
    };
    "PromotedState": number;
    "Title": string;
    "TopicHeader": null | string;
    "UniqueId": string;
    "Url": string;
    "Version": string;
    "VersionInfo": {
        "LastVersionCreated": string;
        "LastVersionCreatedBy": string;
    };
    "AlternativeUrlMap": string;
    "CanvasContent1": string;
    "LayoutWebpartsContent": string;
}

/**
 * Client side webpart object (retrieved via the _api/web/GetClientSideWebParts REST call)
 */
export interface ClientSidePageComponent {
    /**
     * Component type for client side webpart object
     */
    ComponentType: number;
    /**
     * Id for client side webpart object
     */
    Id: string;
    /**
     * Manifest for client side webpart object
     */
    Manifest: string;
    /**
     * Manifest type for client side webpart object
     */
    ManifestType: number;
    /**
     * Name for client side webpart object
     */
    Name: string;
    /**
     * Status for client side webpart object
     */
    Status: number;
}

interface IClientSidePageComponentManifest {
    alias: string;
    componentType: "WebPart" | "" | null;
    disabledOnClassicSharepoint: boolean;
    hiddenFromToolbox: boolean;
    id: string;
    imageLinkPropertyNames: any;
    isInternal: boolean;
    linkPropertyNames: boolean;
    loaderConfig: any;
    manifestVersion: number;
    preconfiguredEntries: {
        description: { default: string };
        group: { default: string };
        groupId: string;
        iconImageUrl: string;
        officeFabricIconFontName: string;
        properties: TypedHash<any>;
        title: { default: string };

    }[];
    preloadComponents: any | null;
    requiredCapabilities: any | null;
    searchablePropertyNames: any | null;
    supportsFullBleed: boolean;
    version: string;
}

export interface IClientSideControlBaseData {
    controlType: number;
    emphasis: IClientControlEmphasis;
    displayMode: number;
}

export interface ICanvasControlBaseData extends IClientSideControlBaseData {
    id: string;
}

export interface IClientSidePageSettingsSlice extends IClientSideControlBaseData {
    pageSettingsSlice: {
        "isDefaultDescription": boolean;
        "isDefaultThumbnail": boolean;
    };
}

export interface IClientSidePageColumnData extends IClientSideControlBaseData {
    controlType: 0;
    position: {
        zoneIndex: number;
        sectionIndex: number;
        sectionFactor: CanvasColumnFactor;
        layoutIndex: number;
    };
}

interface IClientSideControlPositionData {
    zoneIndex: number;
    sectionIndex: number;
    controlIndex: number;
    sectionFactor?: CanvasColumnFactor;
}

export interface IClientSideTextData extends ICanvasControlBaseData {
    controlType: 4;
    position: {
        zoneIndex: number;
        sectionIndex: number;
        controlIndex: number;
        sectionFactor?: CanvasColumnFactor;
        layoutIndex: number;
    };
    anchorComponentId: string;
    editorType: "CKEditor";
    addedFromPersistedData: boolean;
    innerHTML: string;
}

export interface IClientSideWebPartData<PropertiesType = any> extends ICanvasControlBaseData {
    controlType: 3;
    position: {
        zoneIndex: number;
        sectionIndex: number;
        controlIndex: number;
        sectionFactor?: CanvasColumnFactor;
    };
    webPartId: string;
    reservedHeight: number;
    reservedWidth: number;
    addedFromPersistedData: boolean;
    webPartData: {
        id: string;
        instanceId: string;
        title: string;
        description: string;
        serverProcessedContent?: {
            "htmlStrings": TypedHash<string>;
            "searchablePlainTexts": TypedHash<string>;
            "imageSources": TypedHash<string>;
            "links": TypedHash<string>;
        };
        dataVersion: string;
        properties: PropertiesType;
    };
}

export interface IClientControlEmphasis {
    zoneEmphasis?: number;
}

export module ClientSideWebpartPropertyTypes {

    /**
     * Propereties for Embed (component id: 490d7c76-1824-45b2-9de3-676421c997fa)
     */
    export interface Embed {
        embedCode: string;
        cachedEmbedCode?: string;
        shouldScaleWidth?: boolean;
        tempState?: any;
    }

    /**
     * Properties for Bing Map (component id: e377ea37-9047-43b9-8cdb-a761be2f8e09)
     */
    export interface BingMap {
        center: {
            altitude?: number;
            altitudeReference?: number;
            latitude: number;
            longitude: number;
        };
        mapType: "aerial" | "birdseye" | "road" | "streetside";
        maxNumberOfPushPins?: number;
        pushPins?: {
            location: {
                latitude: number;
                longitude: number;
                altitude?: number;
                altitudeReference?: number;
            };
            address?: string;
            defaultAddress?: string;
            defaultTitle?: string;
            title?: string;
        }[];
        shouldShowPushPinTitle?: boolean;
        zoomLevel?: number;
    }
}
