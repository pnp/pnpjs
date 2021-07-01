import { addProp, TextParser, headers, body } from "@pnp/queryable";
import { _List, List } from "../lists/types.js";
import { Folder } from "../folders/types.js";
import { IFieldDefault } from "./types.js";
import { IResourcePath } from "../utils/toResourcePath.js";
import { combine, isArray } from "@pnp/core";
import { escapeQueryStrValue } from "../utils/escapeQueryStrValue.js";
import { Logger, LogLevel } from "@pnp/logging";
import { OLD_spPost } from "../operations.js";
import { OLD_SharePointQueryableCollection } from "../presets/all.js";

declare module "../lists/types" {
    interface _List {
        getDefaultColumnValues(): Promise<IFieldDefault[]>;
        setDefaultColumnValues(defaults: IFieldDefault[]): Promise<void>;
    }
    interface IList {
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
    const matches = xml.match(/<a.*?<\/a>/ig);
    const tags = matches === null ? [] : matches.map(t => t.trim());

    // now we need to turn these tags of form into objects
    // <a href="/sites/dev/My%20Title"><DefaultValue FieldName="TextField">Test</DefaultValue></a>

    return tags.reduce((defVals, t) => {
        const m = /<a href="(.*?)">/ig.exec(t);
        // if things worked out captures are:
        // 0: whole string
        // 1: ENCODED server relative path

        if (m.length < 1) {
            // this indicates an error somewhere, but we have no way to meaningfully recover
            // perhaps the way the tags are stored has changed on the server? Check that first.
            Logger.write(`Could not parse default column value from '${t}'`, LogLevel.Warning);
            return null;
        }

        // return the parsed out values
        const subMatches = t.match(/<DefaultValue.*?<\/DefaultValue>/ig);
        const subTags = subMatches === null ? [] : subMatches.map(st => st.trim());

        subTags.map(st => {
            const sm = /<DefaultValue FieldName="(.*?)">(.*?)<\/DefaultValue>/ig.exec(st);
            // if things worked out captures are:
            // 0: whole string
            // 1: Field internal name
            // 2: Default value as string

            if (sm.length < 1) {
                Logger.write(`Could not parse default column value from '${st}'`, LogLevel.Warning);
            } else {
                defVals.push({
                    name: sm[1],
                    path: decodeURIComponent(m[1]),
                    value: sm[2],
                });
            }
        });

        return defVals;

    }, []).filter(v => v !== null);
};

_List.prototype.setDefaultColumnValues = async function (this: _List, defaults: IFieldDefault[]): Promise<void> {

    // we need the field types from the list to map the values
    // eslint-disable-next-line max-len
    const fieldDefs: { InternalName: string; TypeAsString: string }[] = await OLD_SharePointQueryableCollection(this, "fields").select("InternalName", "TypeAsString").filter("Hidden ne true")();

    // group field defaults by path
    const defaultsByPath = {};
    for (let i = 0; i < defaults.length; i++) {
        if (defaultsByPath[defaults[i].path] == null) {
            defaultsByPath[defaults[i].path] = [defaults[i]];
        } else {
            defaultsByPath[defaults[i].path].push(defaults[i]);
        }
    }

    const paths = Object.getOwnPropertyNames(defaultsByPath);
    const pathDefaults: string[] = [];
    // For each path, group field defaults
    for (let j = 0; j < paths.length; j++) {
        // map the values into the right format and produce our xml elements
        const pathFields = defaultsByPath[paths[j]];
        const tags: string[] = pathFields.map(fieldDefault => {

            const index = fieldDefs.findIndex(fd => fd.InternalName === fieldDefault.name);

            if (index < 0) {
                throw Error(`Field '${fieldDefault.name}' does not exist in the list. Please check the internal field name. Failed to set defaults.`);
            }

            const fieldDef = fieldDefs[index];
            let value = "";

            switch (fieldDef.TypeAsString) {
                case "Boolean":
                case "Currency":
                case "Text":
                case "DateTime":
                case "Number":
                case "Choice":
                case "User":
                    if (isArray(fieldDefault.value)) {
                        throw Error(`The type '${fieldDef.TypeAsString}' does not support multiple values.`);
                    }
                    value = `${fieldDefault.value}`;
                    break;

                case "MultiChoice":
                    if (isArray(fieldDefault.value)) {
                        value = (<any[]>fieldDefault.value).map(v => `${v}`).join(";");
                    } else {
                        value = `${fieldDefault.value}`;
                    }
                    break;

                case "UserMulti":
                    if (isArray(fieldDefault.value)) {
                        value = (<any[]>fieldDefault.value).map(v => `${v}`).join(";#");
                    } else {
                        value = `${fieldDefault.value}`;
                    }
                    break;

                case "Taxonomy":
                case "TaxonomyFieldType":
                    if (isArray(fieldDefault.value)) {
                        throw Error(`The type '${fieldDef.TypeAsString}' does not support multiple values.`);
                    } else {
                        value = `${(<any>fieldDefault.value).wssId};#${(<any>fieldDefault.value).termName}|${(<any>fieldDefault.value).termId}`;
                    }
                    break;

                case "TaxonomyMulti":
                case "TaxonomyFieldTypeMulti":
                    if (isArray(fieldDefault.value)) {
                        value = (<{ wssId: string; termName: string; termId: string }[]>fieldDefault.value).map(v => `${v.wssId};#${v.termName}|${v.termId}`).join(";#");
                    } else {
                        value = (<{ wssId: string; termName: string; termId: string }[]>[fieldDefault.value]).map(v => `${v.wssId};#${v.termName}|${v.termId}`).join(";#");
                    }
                    break;
            }

            return `<DefaultValue FieldName="${fieldDefault.name}">${value}</DefaultValue>`;
        });
        const href = pathFields[0].path.replace(/ /gi, "%20");
        const pathDefault = `<a href="${href}">${tags.join("")}</a>`;
        pathDefaults.push(pathDefault);
    }
    // builds update to defaults
    const xml = `<MetadataDefaults>${pathDefaults.join("")}</MetadataDefaults>`;
    const pathPart: { ServerRelativePath: IResourcePath } = await this.rootFolder.select("ServerRelativePath")();
    const webUrl: { ParentWeb: { Url: string } } = await this.select("ParentWeb/Url").expand("ParentWeb")();
    const path = combine("/", pathPart.ServerRelativePath.DecodedUrl, "Forms");
    const baseFilePath = combine(webUrl.ParentWeb.Url, "_api/web", `getFolderByServerRelativePath(decodedUrl='${escapeQueryStrValue(path)}')`, "files");

    await OLD_spPost(Folder(baseFilePath, "add(overwrite=true,url='client_LocationBasedDefaults.html')"), { body: xml });

    // finally we need to ensure this list has the right event receiver added
    const existingReceivers = await this.eventReceivers.filter("ReceiverName eq 'LocationBasedMetadataDefaultsReceiver ItemAdded'").select("ReceiverId")();

    if (existingReceivers.length < 1) {
        await OLD_spPost(List(this.eventReceivers, "add"), body({
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
