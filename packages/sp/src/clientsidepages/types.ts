import "../folders/list";
import "../files/folder";
import "../files/item";
import { IList } from "../lists/types";
import { TemplateFileType, _File, IFile } from "../files/types";
import { Item, IItemUpdateResult } from "../items/types";
import { getBoundedDivMarkup, getNextOrder, reindex, jsonToEscapedString, escapedStringToJson } from "./funcs";
import { TypedHash, extend, combine, getGUID, getAttrValueFromString, hOP } from "@pnp/common";
import { IGetable, invokableFactory } from "@pnp/odata";

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
export type CanvasColumnFactorType = 0 | 2 | 4 | 6 | 8 | 12;

/**
 * Represents the data and methods associated with client side "modern" pages
 */
export class _ClientSidePage extends _File implements IClientSidePage {

    /**
     * Creates a new instance of the ClientSidePage class
     *
     * @param baseUrl The url or SharePointQueryable which forms the parent of this web collection
     * @param commentsDisabled Indicates if comments are disabled, not valid until load is called
     */
    constructor(file: _File, public sections: CanvasSection[] = [], public commentsDisabled = false) {
        super(file);
    }

    /**
     * Add a section to this page
     */
    public addSection(): CanvasSection {
        const section = new CanvasSection(this, getNextOrder(this.sections));
        this.sections.push(section);
        return section;
    }

    /**
     * Converts this page's content to html markup
     */
    public toHtml(): string {

        // trigger reindex of the entire tree
        reindex(this.sections);

        const html: string[] = [];

        html.push("<div>");

        for (let i = 0; i < this.sections.length; i++) {
            html.push(this.sections[i].toHtml());
        }

        html.push("</div>");

        return html.join("");
    }

    /**
     * Loads this page instance's content from the supplied html
     * 
     * @param html html string representing the page's content
     */
    public fromHtml(html: string): this {

        // reset sections
        this.sections = [];

        // gather our controls from the supplied html
        getBoundedDivMarkup(html, /<div\b[^>]*data-sp-canvascontrol[^>]*?>/i, markup => {

            // get the control type
            const ct = /controlType&quot;&#58;(\d*?),/i.exec(markup);

            // if no control type is present this is a column which we give type 0 to let us process it
            const controlType = ct == null || ct.length < 2 ? 0 : parseInt(ct[1], 10);

            let control: CanvasControl = null;

            switch (controlType) {
                case 0:
                    // empty canvas column
                    control = new CanvasColumn(null, 0);
                    control.fromHtml(markup);
                    this.mergeColumnToTree(<CanvasColumn>control);
                    break;
                case 3:
                    // client side webpart
                    control = new ClientSideWebpart("");
                    control.fromHtml(markup);
                    this.mergePartToTree(<ClientSidePart>control);
                    break;
                case 4:
                    // client side text
                    control = new ClientSideText();
                    control.fromHtml(markup);
                    this.mergePartToTree(<ClientSidePart>control);
                    break;
            }
        });

        // refresh all the orders within the tree
        reindex(this.sections);

        return this;
    }

    /**
     * Loads this page's content from the server
     */
    public async load(): Promise<void> {
        const item = await this.getItem<{ CanvasContent1: string; CommentsDisabled: boolean; }>("CanvasContent1", "CommentsDisabled");
        this.fromHtml(item.CanvasContent1);
        this.commentsDisabled = item.CommentsDisabled;
    }

    /**
     * Persists the content changes (sections, columns, and controls)
     */
    public save(): Promise<IItemUpdateResult> {
        return this.updateProperties({ CanvasContent1: this.toHtml() });
    }

    /**
     * Enables comments on this page
     */
    public async enableComments(): Promise<IItemUpdateResult> {
        const r = await this.setCommentsOn(true);
        this.commentsDisabled = false;
        return r;
    }

    /**
     * Disables comments on this page
     */
    public async disableComments(): Promise<IItemUpdateResult> {
        const r = await this.setCommentsOn(false);
        this.commentsDisabled = true;
        return r;
    }

    /**
     * Finds a control by the specified instance id
     * 
     * @param id Instance id of the control to find
     */
    public findControlById<T extends ClientSidePart = ClientSidePart>(id: string): T {
        return this.findControl((c) => c.id === id);
    }

    /**
     * Finds a control within this page's control tree using the supplied predicate
     * 
     * @param predicate Takes a control and returns true or false, if true that control is returned by findControl
     */
    public findControl<T extends ClientSidePart = ClientSidePart>(predicate: (c: ClientSidePart) => boolean): T {
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
    public async like(): Promise<void> {
        const i = await this.getItem();
        return i.like();
    }

    /**
     * Unlike the modern site page
     */
    public async unlike(): Promise<void> {
        const i = await this.getItem();
        return i.unlike();
    }

    /**
     * Get the liked by information for a modern site page     
     */
    public getLikedByInformation(): Promise<void> {
        return this.getItem().then(i => {
            return i.getLikedByInformation();
        });
    }

    /**
     * Sets the comments flag for a page
     * 
     * @param on If true comments are enabled, false they are disabled
     */
    private async setCommentsOn(on: boolean): Promise<IItemUpdateResult> {
        const i = await this.getItem();
        return Item(i, `SetCommentsDisabled(${!on})`).update({});
    }

    /**
     * Merges the control into the tree of sections and columns for this page
     * 
     * @param control The control to merge
     */
    private mergePartToTree(control: ClientSidePart): void {

        let section: CanvasSection = null;
        let column: CanvasColumn = null;
        let sectionFactor: CanvasColumnFactorType = 12;
        let sectionIndex = 0;
        let zoneIndex = 0;

        // handle case where we don't have position data
        if (hOP(control.controlData, "position")) {
            if (hOP(control.controlData.position, "zoneIndex")) {
                zoneIndex = control.controlData.position.zoneIndex;
            }
            if (hOP(control.controlData.position, "sectionIndex")) {
                sectionIndex = control.controlData.position.sectionIndex;
            }
            if (hOP(control.controlData.position, "sectionFactor")) {
                sectionFactor = control.controlData.position.sectionFactor;
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
            column = new CanvasColumn(section, sectionIndex, sectionFactor);
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

        const order = hOP(column.controlData, "position") && hOP(column.controlData.position, "zoneIndex") ? column.controlData.position.zoneIndex : 0;
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

    /**
     * Updates the properties of the underlying ListItem associated with this ClientSidePage
     * 
     * @param properties Set of properties to update
     * @param eTag Value used in the IF-Match header, by default "*"
     */
    private async updateProperties(properties: TypedHash<any>, eTag = "*"): Promise<IItemUpdateResult> {
        const i = await this.getItem();
        return await i.update(properties, eTag);
    }
}

export interface IClientSidePage extends IGetable, IFile {

    sections: CanvasSection[];

    commentsDisabled: boolean;

    /**
     * Add a section to this page
     */
    addSection(): CanvasSection;

    /**
     * Converts this page's content to html markup
     */
    toHtml(): string;

    /**
     * Loads this page instance's content from the supplied html
     * 
     * @param html html string representing the page's content
     */
    fromHtml(html: string): this;

    /**
     * Loads this page's content from the server
     */
    load(): Promise<void>;

    /**
     * Persists the content changes (sections, columns, and controls)
     */
    save(): Promise<IItemUpdateResult>;

    /**
     * Enables comments on this page
     */
    enableComments(): Promise<IItemUpdateResult>;

    /**
     * Disables comments on this page
     */
    disableComments(): Promise<IItemUpdateResult>;

    /**
     * Finds a control by the specified instance id
     * 
     * @param id Instance id of the control to find
     */
    findControlById<T extends ClientSidePart = ClientSidePart>(id: string): T;

    /**
     * Finds a control within this page's control tree using the supplied predicate
     * 
     * @param predicate Takes a control and returns true or false, if true that control is returned by findControl
     */
    findControl<T extends ClientSidePart = ClientSidePart>(predicate: (c: ClientSidePart) => boolean): T;

    /**
     * Like the modern site page
     */
    like(): Promise<void>;

    /**
     * Unlike the modern site page
     */
    unlike(): Promise<void>;

    /**
     * Get the liked by information for a modern site page     
     */
    getLikedByInformation(): Promise<void>;
}

export interface _ClientSidePage extends IGetable { }
export const ClientSidePage: (file: IFile, sections?: CanvasSection[], commentsDisabled?: boolean) => IClientSidePage = invokableFactory<IClientSidePage>(_ClientSidePage);

/**
 * Creates a new blank page within the supplied library
 * 
 * @param library The library in which to create the page
 * @param pageName Filename of the page, such as "page.aspx"
 * @param title The display title of the page
 * @param pageLayoutType Layout type of the page to use
 */
export const CreateClientSidePage = async function (library: IList, pageName: string, title: string, pageLayoutType?: ClientSidePageLayoutType): Promise<IClientSidePage> {

    // see if file exists, if not create it
    const fs = await library.rootFolder.files.select("Name").filter(`Name eq '${pageName}'`).top(1)<any[]>();
    if (fs.length > 0) {
        throw Error(`A file with the name '${pageName}' already exists in the library '${library.toUrl()}'.`);
    }
    const path = await library.rootFolder.select("ServerRelativePath")();
    const pageServerRelPath = combine("/", path.ServerRelativePath.DecodedUrl, pageName);
    const far = await library.rootFolder.files.addTemplateFile(pageServerRelPath, TemplateFileType.ClientSidePage);
    const i = await far.file.getItem();
    const iar = await i.update({
        BannerImageUrl: {
            Url: "/_layouts/15/images/sitepagethumbnail.png",
        },
        CanvasContent1: "",
        ClientSideApplicationId: "b6917cb1-93a0-4b97-a84d-7cf49975d4ec",
        ContentTypeId: "0x0101009D1CB255DA76424F860D91F20E6C4118",
        PageLayoutType: pageLayoutType,
        PromotedState: PromotedState.NotPromoted,
        Title: title,
    });
    return ClientSidePage((<_File>iar.item.file), (<any>iar.item).CommentsDisabled);
};

export const LoadClientSidePage = async function (file: IFile): Promise<IClientSidePage> {
    const page = ClientSidePage(file);
    await page.load();
    return page;
};

export class CanvasSection {

    /**
     * Used to track this object inside the collection at runtime
     */
    private _memId: string;

    constructor(public page: IClientSidePage, public order: number, public columns: CanvasColumn[] = []) {
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
    public addColumn(factor: CanvasColumnFactorType): CanvasColumn {

        const column = new CanvasColumn(this, getNextOrder(this.columns), factor);
        this.columns.push(column);
        return column;
    }

    /**
     * Adds a control to the default column for this section
     * 
     * @param control Control to add to the default column
     */
    public addControl(control: ClientSidePart): this {
        this.defaultColumn.addControl(control);
        return this;
    }

    public toHtml(): string {

        const html = [];

        for (let i = 0; i < this.columns.length; i++) {
            html.push(this.columns[i].toHtml());
        }

        return html.join("");
    }

    /**
     * Removes this section and all contained columns and controls from the collection
     */
    public remove(): void {
        this.page.sections = this.page.sections.filter(section => section._memId !== this._memId);
        reindex(this.page.sections);
    }
}

export abstract class CanvasControl {

    constructor(
        protected controlType: number,
        public dataVersion: string,
        public column: CanvasColumn = null,
        public order = 1,
        public id: string = getGUID(),
        public controlData: IClientSideControlData = null) { }

    /**
     * Value of the control's "data-sp-controldata" attribute
     */
    public get jsonData(): string {
        return jsonToEscapedString(this.getControlData());
    }

    public abstract toHtml(index: number): string;

    public fromHtml(html: string): void {
        this.controlData = escapedStringToJson<IClientSideControlData>(getAttrValueFromString(html, "data-sp-controldata"));
        this.dataVersion = getAttrValueFromString(html, "data-sp-canvasdataversion");
        this.controlType = this.controlData.controlType;
        this.id = this.controlData.id;
    }

    protected abstract getControlData(): IClientSideControlData;
}

export class CanvasColumn extends CanvasControl {

    constructor(
        public section: CanvasSection,
        public order: number,
        public factor: CanvasColumnFactorType = 12,
        public controls: ClientSidePart[] = [],
        dataVersion = "1.0") {
        super(0, dataVersion);
    }

    public addControl(control: ClientSidePart): this {
        control.column = this;
        this.controls.push(control);
        return this;
    }

    public getControl<T extends ClientSidePart>(index: number): T {
        return <T>this.controls[index];
    }

    public toHtml(): string {
        const html = [];

        if (this.controls.length < 1) {

            html.push(`<div data-sp-canvascontrol="" data-sp-canvasdataversion="${this.dataVersion}" data-sp-controldata="${this.jsonData}"></div>`);

        } else {

            for (let i = 0; i < this.controls.length; i++) {
                html.push(this.controls[i].toHtml(i + 1));
            }
        }

        return html.join("");
    }

    public fromHtml(html: string): void {
        super.fromHtml(html);

        this.controlData = escapedStringToJson<IClientSideControlData>(getAttrValueFromString(html, "data-sp-controldata"));
        if (hOP(this.controlData, "position")) {
            if (hOP(this.controlData.position, "sectionFactor")) {
                this.factor = this.controlData.position.sectionFactor;
            }
            if (hOP(this.controlData.position, "sectionIndex")) {
                this.order = this.controlData.position.sectionIndex;
            }
        }
    }

    public getControlData(): IClientSideControlData {
        return {
            displayMode: 2,
            position: {
                sectionFactor: this.factor,
                sectionIndex: this.order,
                zoneIndex: this.section.order,
            },
        };
    }

    /**
     * Removes this column and all contained controls from the collection
     */
    public remove(): void {
        this.section.columns = this.section.columns.filter(column => column.id !== this.id);
        reindex(this.column.controls);
    }
}

/**
 * Abstract class with shared functionality for parts
 */
export abstract class ClientSidePart extends CanvasControl {

    /**
     * Removes this column and all contained controls from the collection
     */
    public remove(): void {
        this.column.controls = this.column.controls.filter(control => control.id !== this.id);
        reindex(this.column.controls);
    }
}

export class ClientSideText extends ClientSidePart {

    private _text: string;

    constructor(text = "") {
        super(4, "1.0");

        this.text = text;
    }

    /**
     * The text markup of this control
     */
    public get text(): string {
        return this._text;
    }

    public set text(text: string) {

        if (!text.startsWith("<p>")) {
            text = `<p>${text}</p>`;
        }

        this._text = text;
    }

    public getControlData(): IClientSideControlData {

        return {
            controlType: this.controlType,
            editorType: "CKEditor",
            id: this.id,
            position: {
                controlIndex: this.order,
                sectionFactor: this.column.factor,
                sectionIndex: this.column.order,
                zoneIndex: this.column.section.order,
            },
        };
    }

    public toHtml(index: number): string {

        // set our order to the value passed in
        this.order = index;

        const html: string[] = [];

        html.push(`<div data-sp-canvascontrol="" data-sp-canvasdataversion="${this.dataVersion}" data-sp-controldata="${this.jsonData}">`);
        html.push("<div data-sp-rte=\"\">");
        html.push(`${this.text}`);
        html.push("</div>");
        html.push("</div>");

        return html.join("");
    }

    public fromHtml(html: string): void {

        super.fromHtml(html);

        this.text = "";

        getBoundedDivMarkup(html, /<div[^>]*data-sp-rte[^>]*>/i, (s: string) => {

            // now we need to grab the inner text between the divs
            const match = /<div[^>]*data-sp-rte[^>]*>(.*?)<\/div>$/i.exec(s);

            this.text = match.length > 1 ? match[1] : "";
        });
    }
}

export class ClientSideWebpart extends ClientSidePart {

    constructor(public title: string,
        public description = "",
        public propertieJson: TypedHash<any> = {},
        public webPartId = "",
        protected htmlProperties = "",
        protected serverProcessedContent: IServerProcessedContent = null,
        protected canvasDataVersion = "1.0") {
        super(3, "1.0");
    }

    public static fromComponentDef(definition: IClientSidePageComponent): ClientSideWebpart {
        const part = new ClientSideWebpart("");
        part.import(definition);
        return part;
    }

    public import(component: IClientSidePageComponent): void {
        this.webPartId = component.Id.replace(/^\{|\}$/g, "").toLowerCase();
        const manifest: IClientSidePageComponentManifest = JSON.parse(component.Manifest);
        this.title = manifest.preconfiguredEntries[0].title.default;
        this.description = manifest.preconfiguredEntries[0].description.default;
        this.dataVersion = "1.0";
        this.propertieJson = this.parseJsonProperties(manifest.preconfiguredEntries[0].properties);
    }

    public setProperties<T = any>(properties: T): this {
        this.propertieJson = extend(this.propertieJson, properties);
        return this;
    }

    public getProperties<T = any>(): T {
        return <T>this.propertieJson;
    }

    public toHtml(index: number): string {

        // set our order to the value passed in
        this.order = index;

        // will form the value of the data-sp-webpartdata attribute
        const data = {
            dataVersion: this.dataVersion,
            description: this.description,
            id: this.webPartId,
            instanceId: this.id,
            properties: this.propertieJson,
            serverProcessedContent: this.serverProcessedContent,
            title: this.title,
        };

        const html: string[] = [];

        html.push(`<div data-sp-canvascontrol="" data-sp-canvasdataversion="${this.canvasDataVersion}" data-sp-controldata="${this.jsonData}">`);

        html.push(`<div data-sp-webpart="" data-sp-webpartdataversion="${this.dataVersion}" data-sp-webpartdata="${jsonToEscapedString(data)}">`);

        html.push(`<div data-sp-componentid>`);
        html.push(this.webPartId);
        html.push("</div>");

        html.push(`<div data-sp-htmlproperties="">`);
        html.push(this.renderHtmlProperties());
        html.push("</div>");

        html.push("</div>");
        html.push("</div>");

        return html.join("");
    }

    public fromHtml(html: string): void {

        super.fromHtml(html);

        const webPartData = escapedStringToJson<IClientSideWebpartData>(getAttrValueFromString(html, "data-sp-webpartdata"));

        this.title = webPartData.title;
        this.description = webPartData.description;
        this.webPartId = webPartData.id;
        this.canvasDataVersion = getAttrValueFromString(html, "data-sp-canvasdataversion").replace(/\\\./, ".");
        this.dataVersion = getAttrValueFromString(html, "data-sp-webpartdataversion").replace(/\\\./, ".");
        this.setProperties(webPartData.properties);

        if (webPartData.serverProcessedContent !== undefined) {
            this.serverProcessedContent = webPartData.serverProcessedContent;
        }

        // get our html properties
        const htmlProps = getBoundedDivMarkup(html, /<div\b[^>]*data-sp-htmlproperties[^>]*?>/i, markup => {
            return markup.replace(/^<div\b[^>]*data-sp-htmlproperties[^>]*?>/i, "").replace(/<\/div>$/i, "");
        });

        this.htmlProperties = htmlProps.length > 0 ? htmlProps[0] : "";
    }

    public getControlData(): IClientSideControlData {

        return {
            controlType: this.controlType,
            id: this.id,
            position: {
                controlIndex: this.order,
                sectionFactor: this.column.factor,
                sectionIndex: this.column.order,
                zoneIndex: this.column.section.order,
            },
            webPartId: this.webPartId,
        };

    }

    protected renderHtmlProperties(): string {

        const html: string[] = [];

        if (this.serverProcessedContent === undefined || this.serverProcessedContent === null) {

            html.push(this.htmlProperties);

        } else if (this.serverProcessedContent !== undefined) {

            if (this.serverProcessedContent.searchablePlainTexts !== undefined) {

                const keys = Object.keys(this.serverProcessedContent.searchablePlainTexts);
                for (let i = 0; i < keys.length; i++) {
                    html.push(`<div data-sp-prop-name="${keys[i]}" data-sp-searchableplaintext="true">`);
                    html.push(this.serverProcessedContent.searchablePlainTexts[keys[i]]);
                    html.push("</div>");
                }
            }

            if (this.serverProcessedContent.imageSources !== undefined) {

                const keys = Object.keys(this.serverProcessedContent.imageSources);
                for (let i = 0; i < keys.length; i++) {
                    html.push(`<img data-sp-prop-name="${keys[i]}" src="${this.serverProcessedContent.imageSources[keys[i]]}" />`);
                }
            }

            if (this.serverProcessedContent.links !== undefined) {

                const keys = Object.keys(this.serverProcessedContent.links);
                for (let i = 0; i < keys.length; i++) {
                    html.push(`<a data-sp-prop-name="${keys[i]}" href="${this.serverProcessedContent.links[keys[i]]}"></a>`);
                }
            }
        }

        return html.join("");
    }

    protected parseJsonProperties(props: TypedHash<any>): any {

        // If the web part has the serverProcessedContent property then keep this one as it might be needed as input to render the web part HTML later on
        if (props.webPartData !== undefined && props.webPartData.serverProcessedContent !== undefined) {
            this.serverProcessedContent = props.webPartData.serverProcessedContent;
        } else if (props.serverProcessedContent !== undefined) {
            this.serverProcessedContent = props.serverProcessedContent;
        } else {
            this.serverProcessedContent = null;
        }

        if (props.webPartData !== undefined && props.webPartData.properties !== undefined) {
            return props.webPartData.properties;
        } else if (props.properties !== undefined) {
            return props.properties;
        } else {
            return props;
        }
    }
}

/**
 * Client side webpart object (retrieved via the _api/web/GetClientSideWebParts REST call)
 */
export interface IClientSidePageComponent {
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

export interface IServerProcessedContent {
    searchablePlainTexts: TypedHash<string>;
    imageSources: TypedHash<string>;
    links: TypedHash<string>;
}

export interface IClientSideControlPosition {
    controlIndex?: number;
    sectionFactor: CanvasColumnFactorType;
    sectionIndex: number;
    zoneIndex: number;
}

export interface IClientSideControlData {
    controlType?: number;
    id?: string;
    editorType?: string;
    position: IClientSideControlPosition;
    webPartId?: string;
    displayMode?: number;
}

export interface IClientSideWebpartData {
    dataVersion: string;
    description: string;
    id: string;
    instanceId: string;
    properties: any;
    title: string;
    serverProcessedContent?: IServerProcessedContent;
}

export module ClientSideWebpartPropertyTypes {

    /**
     * Propereties for Embed (component id: 490d7c76-1824-45b2-9de3-676421c997fa)
     */
    export interface IEmbed {
        embedCode: string;
        cachedEmbedCode?: string;
        shouldScaleWidth?: boolean;
        tempState?: any;
    }

    /**
     * Properties for Bing Map (component id: e377ea37-9047-43b9-8cdb-a761be2f8e09)
     */
    export interface IBingMap {
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
