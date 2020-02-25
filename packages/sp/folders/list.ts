import { addProp, TextParser, headers, body } from "@pnp/odata";
import { _List, List } from "../lists/types";
import { Folder, IFolder, IFieldDefault } from "./types";
import { IResourcePath } from "../utils/toResourcePath";
import { combine } from "@pnp/common";
import { escapeQueryStrValue } from "../utils/escapeQueryStrValue";
import { Logger, LogLevel } from "@pnp/logging";
import { spPost } from "../operations";

declare module "../lists/types" {
    interface _List {
        readonly rootFolder: IFolder;
        getDefaultColumnValues(): Promise<IFieldDefault[]>;
        setDefaultColumnValues(defaults: IFieldDefault[]): Promise<void>;
    }
    interface IList {
        /**
         * Root folder for this list/library
         */
        readonly rootFolder: IFolder;
        /**
         * Gets the default column value for a given list
         */
        getDefaultColumnValues(): Promise<IFieldDefault[]>;

        /**
         * Replaces all the column defaults with the supplied values
         * 
         * @param defaults 
         */
        setDefaultColumnValues(defaults: IFieldDefault[]): Promise<void>;
    }
}

addProp(_List, "rootFolder", Folder, "rootFolder");

_List.prototype.getDefaultColumnValues = async function (this: _List): Promise<IFieldDefault[]> {

    const pathPart: { ServerRelativePath: IResourcePath } = await this.rootFolder.select("ServerRelativePath")();
    const webUrl: { ParentWeb: { Url: string } } = await this.select("ParentWeb/Url").expand("ParentWeb")();

    const path = combine("/", pathPart.ServerRelativePath.DecodedUrl, "Forms/client_LocationBasedDefaults.html");

    const baseFilePath = combine(webUrl.ParentWeb.Url, "_api/web", `getFileByServerRelativePath(decodedUrl='${escapeQueryStrValue(path)}')`);

    // we do this because we don't want to import file if we don't have to
    let xml = "";

    try {

        xml = await Folder(baseFilePath, "$value").usingParser(new TextParser())(headers({ "binaryStringResponseBody": "true" }));

    } catch (e) {

        // if this call fails we assume it is because the file is 404
        if (e && e.status && e.status === 404) {

            // return an empty array
            return [];
        }

        throw e;
    }

    // get all the tags from the xml
    const tags = xml.match(/<a.*?<\/a>/ig).map(t => t.trim());

    // now we need to turn these tags of form into objects
    // <a href="/sites/dev/My%20Title"><DefaultValue FieldName="TextField">Test</DefaultValue></a>

    return tags.map(t => {
        const m = /<a href="(.*?)"><DefaultValue FieldName="(.*?)">(.*?)<\/DefaultValue>/ig.exec(t);
        // if things worked our captures are:
        // 0: whole string
        // 1: ENCODED server relative path
        // 2: Field internal name
        // 3: Default value as string

        if (m.length < 1) {
            // this really indicates an error, but let's face it we have no way to meaningfully recover
            Logger.write(`Could not parse default column value from '${t}'`, LogLevel.Warning);
            return null;
        }

        // return the parsed out values
        return {
            name: m[2],
            path: decodeURIComponent(m[1]),
            value: m[3],
        };

    }).filter(v => v !== null);
};

_List.prototype.setDefaultColumnValues = async function (this: _List, defaults: IFieldDefault[]): Promise<void> {

    const tags = defaults.map(d => {
        return `<a href="${d.path.replace(/ /gi, "%20")}"><DefaultValue FieldName="${d.name}">${d.value}</DefaultValue></a>`;
    });

    const xml = `<MetadataDefaults>${tags.join("")}</MetadataDefaults>`;

    const pathPart: { ServerRelativePath: IResourcePath } = await this.rootFolder.select("ServerRelativePath")();
    const webUrl: { ParentWeb: { Url: string } } = await this.select("ParentWeb/Url").expand("ParentWeb")();

    const path = combine("/", pathPart.ServerRelativePath.DecodedUrl, "Forms");

    const baseFilePath = combine(webUrl.ParentWeb.Url, "_api/web", `getFolderByServerRelativePath(decodedUrl='${escapeQueryStrValue(path)}')`, "files");

    await spPost(Folder(baseFilePath, `add(overwrite=true,url='client_LocationBasedDefaults.html')`), { body: xml });

    // finally we need to ensure this list has the right event receiver added
    const existingReceivers = await this.eventReceivers.filter("ReceiverName eq 'LocationBasedMetadataDefaultsReceiver ItemAdded'").select("ReceiverId")();

    if (existingReceivers.length < 1) {
        await spPost(List(this.eventReceivers, "add"), body({
            eventReceiverCreationInformation: {
                EventType: 10001,
                ReceiverAssembly: "Microsoft.Office.DocumentManagement, Version=16.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c",
                ReceiverClass: "Microsoft.Office.DocumentManagement.LocationBasedMetadataDefaultsReceiver",
                ReceiverName: "LocationBasedMetadataDefaultsReceiver ItemAdded",
                SequenceNumber: 1000,
                Synchronization: 1,
            },
        }));
    }
};
