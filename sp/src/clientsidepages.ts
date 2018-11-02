import { List } from "./lists";
import { TemplateFileType, FileAddResult, File } from "./files";
import { Item, ItemUpdateResult } from "./items";
import { TypedHash, extend, combine, getGUID, getAttrValueFromString, jsS, hOP } from "@pnp/common";

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
 * After https://stackoverflow.com/questions/273789/is-there-a-version-of-javascripts-string-indexof-that-allows-for-regular-expr/274094#274094
 * 
 * @param this Types the called context this to a string in which the search will be conducted
 * @param regex A regex or string to match
 * @param startpos A starting position from which the search will begin
 */
function regexIndexOf(this: string, regex: RegExp | string, startpos = 0) {
    const indexOf = this.substring(startpos).search(regex);
    return (indexOf >= 0) ? (indexOf + (startpos)) : indexOf;
}

/**
 * Finds bounded blocks of markup bounded by divs, ensuring to match the ending div even with nested divs in the interstitial markup
 * 
 * @param html HTML to search
 * @param boundaryStartPattern The starting pattern to find, typically a div with attribute
 * @param collector A func to take the found block and provide a way to form it into a useful return that is added into the return array
 */
function getBoundedDivMarkup<T>(html: string, boundaryStartPattern: RegExp | string, collector: (s: string) => T): T[] {

    const blocks: T[] = [];

    if (html === undefined || html === null) {
        return blocks;
    }

    // remove some extra whitespace if present
    const cleanedHtml = html.replace(/[\t\r\n]/g, "");

    // find the first div
    let startIndex = regexIndexOf.call(cleanedHtml, boundaryStartPattern);

    if (startIndex < 0) {
        // we found no blocks in the supplied html
        return blocks;
    }

    // this loop finds each of the blocks
    while (startIndex > -1) {

        // we have one open div counting from the one found above using boundaryStartPattern so we need to ensure we find it's close
        let openCounter = 1;
        let searchIndex = startIndex + 1;
        let nextDivOpen = -1;
        let nextCloseDiv = -1;

        // this loop finds the </div> tag that matches the opening of the control
        while (true) {

            // find both the next opening and closing div tags from our current searching index
            nextDivOpen = regexIndexOf.call(cleanedHtml, /<div[^>]*>/i, searchIndex);
            nextCloseDiv = regexIndexOf.call(cleanedHtml, /<\/div>/i, searchIndex);

            if (nextDivOpen < 0) {
                // we have no more opening divs, just set this to simplify checks below
                nextDivOpen = cleanedHtml.length + 1;
            }

            // determine which we found first, then increment or decrement our counter
            // and set the location to begin searching again
            if (nextDivOpen < nextCloseDiv) {
                openCounter++;
                searchIndex = nextDivOpen + 1;
            } else if (nextCloseDiv < nextDivOpen) {
                openCounter--;
                searchIndex = nextCloseDiv + 1;
            }

            // once we have no open divs back to the level of the opening control div
            // meaning we have all of the markup we intended to find
            if (openCounter === 0) {

                // get the bounded markup, +6 is the size of the ending </div> tag
                const markup = cleanedHtml.substring(startIndex, nextCloseDiv + 6).trim();

                // save the control data we found to the array
                blocks.push(collector(markup));

                // get out of our while loop
                break;
            }

            if (openCounter > 1000 || openCounter < 0) {
                // this is an arbitrary cut-off but likely we will not have 1000 nested divs
                // something has gone wrong above and we are probably stuck in our while loop
                // let's get out of our while loop and not hang everything
                throw Error("getBoundedDivMarkup exceeded depth parameters.");
            }
        }

        // get the start of the next control
        startIndex = regexIndexOf.call(cleanedHtml, boundaryStartPattern, nextCloseDiv);
    }

    return blocks;
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

    /**
     * Creates a new instance of the ClientSidePage class
     *
     * @param baseUrl The url or SharePointQueryable which forms the parent of this web collection
     * @param commentsDisabled Indicates if comments are disabled, not valid until load is called
     */
    constructor(file: File, public sections: CanvasSection[] = [], public commentsDisabled = false) {
        super(file);
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
                            CanvasContent1: "",
                            ClientSideApplicationId: "b6917cb1-93a0-4b97-a84d-7cf49975d4ec",
                            ContentTypeId: "0x0101009D1CB255DA76424F860D91F20E6C4118",
                            PageLayoutType: pageLayoutType,
                            PromotedState: PromotedState.NotPromoted,
                            Title: title,
                        }).then((iar: ItemUpdateResult) => new ClientSidePage(iar.item.file, (<any>iar.item).CommentsDisabled));
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
            .replace(/\./g, "\.");
    }

    /**
     * Converts an escaped string from a client-side control attribute to a json object
     * 
     * @param escapedString 
     */
    public static escapedStringToJson<T = any>(escapedString: string): T {
        const unespace = (escaped: string): string => {
            const mapDict = [
                [/&quot;/g, "\""], [/&#58;/g, ":"], [/&#123;/g, "{"], [/&#125;/g, "}"],
                [/\\\\/g, "\\"], [/\\\?/g, "?"], [/\\\./g, "."], [/\\\[/g, "["], [/\\\]/g, "]"],
                [/\\\(/g, "("], [/\\\)/g, ")"], [/\\\|/g, "|"], [/\\\+/g, "+"],
            ];
            return mapDict.reduce((r, m) => r.replace(m[0], m[1] as string), escaped);
        };

        return JSON.parse(unespace(escapedString));
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
    public load(): Promise<void> {
        return this.getItem<{ CanvasContent1: string, CommentsDisabled: boolean }>("CanvasContent1", "CommentsDisabled").then(item => {
            this.fromHtml(item.CanvasContent1);
            this.commentsDisabled = item.CommentsDisabled;
        });
    }

    /**
     * Persists the content changes (sections, columns, and controls)
     */
    public save(): Promise<ItemUpdateResult> {
        return this.updateProperties({ CanvasContent1: this.toHtml() });
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
    private mergePartToTree(control: ClientSidePart): void {

        let section: CanvasSection = null;
        let column: CanvasColumn = null;

        const sections = this.sections.filter(s => s.order === control.controlData.position.zoneIndex);
        if (sections.length < 1) {
            section = new CanvasSection(this, control.controlData.position.zoneIndex);
            this.sections.push(section);
        } else {
            section = sections[0];
        }

        const columns = section.columns.filter(c => c.order === control.controlData.position.sectionIndex);
        if (columns.length < 1) {
            column = new CanvasColumn(section, control.controlData.position.sectionIndex, control.controlData.position.sectionFactor);
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

        let section: CanvasSection = null;
        const sections = this.sections.filter(s => s.order === column.controlData.position.zoneIndex);

        if (sections.length < 1) {
            section = new CanvasSection(this, column.controlData.position.zoneIndex);
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
    private updateProperties(properties: TypedHash<any>, eTag = "*"): Promise<ItemUpdateResult> {
        return this.getItem().then(i => i.update(properties, eTag));
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
        public controlData: ClientSideControlData = null) { }

    /**
     * Value of the control's "data-sp-controldata" attribute
     */
    public get jsonData(): string {
        return ClientSidePage.jsonToEscapedString(this.getControlData());
    }

    public abstract toHtml(index: number): string;

    public fromHtml(html: string): void {
        this.controlData = ClientSidePage.escapedStringToJson<ClientSideControlData>(getAttrValueFromString(html, "data-sp-controldata"));
        this.dataVersion = getAttrValueFromString(html, "data-sp-canvasdataversion");
        this.controlType = this.controlData.controlType;
        this.id = this.controlData.id;
    }

    protected abstract getControlData(): ClientSideControlData;
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

        this.controlData = ClientSidePage.escapedStringToJson<ClientSideControlData>(getAttrValueFromString(html, "data-sp-controldata"));
        this.factor = this.controlData.position.sectionFactor;
        this.order = this.controlData.position.sectionIndex;
    }

    public getControlData(): ClientSideControlData {
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

    public getControlData(): ClientSideControlData {

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
        protected serverProcessedContent: ServerProcessedContent = null,
        protected canvasDataVersion = "1.0") {
        super(3, "1.0");
    }

    public static fromComponentDef(definition: ClientSidePageComponent): ClientSideWebpart {
        const part = new ClientSideWebpart("");
        part.import(definition);
        return part;
    }

    public import(component: ClientSidePageComponent): void {
        this.webPartId = component.Id.replace(/^\{|\}$/g, "").toLowerCase();
        const manifest: ClientSidePageComponentManifest = JSON.parse(component.Manifest);
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

        html.push(`<div data-sp-webpart="" data-sp-webpartdataversion="${this.dataVersion}" data-sp-webpartdata="${ClientSidePage.jsonToEscapedString(data)}">`);

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

        const webPartData = ClientSidePage.escapedStringToJson<ClientSideWebpartData>(getAttrValueFromString(html, "data-sp-webpartdata"));

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

    public getControlData(): ClientSideControlData {

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

interface ClientSidePageComponentManifest {
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

export interface ServerProcessedContent {
    searchablePlainTexts: TypedHash<string>;
    imageSources: TypedHash<string>;
    links: TypedHash<string>;
}

export interface ClientSideControlPosition {
    controlIndex?: number;
    sectionFactor: CanvasColumnFactorType;
    sectionIndex: number;
    zoneIndex: number;
}

export interface ClientSideControlData {
    controlType?: number;
    id?: string;
    editorType?: string;
    position: ClientSideControlPosition;
    webPartId?: string;
    displayMode?: number;
}

export interface ClientSideWebpartData {
    dataVersion: string;
    description: string;
    id: string;
    instanceId: string;
    properties: any;
    title: string;
    serverProcessedContent?: ServerProcessedContent;
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
