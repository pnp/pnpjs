import { odataUrlFrom } from "../utils/odata-url-from.js";
import { extractWebUrl } from "../utils/extract-web-url.js";
import { IResourcePath } from "../utils/to-resource-path.js";
import { Web } from "../webs/types.js";
import "../lists/web.js";
import { _Folder, Folder } from "../folders/types.js";
import { IFieldDefault, IFieldDefaultProps } from "./types.js";

declare module "../folders/types" {
    interface _Folder {
        getDefaultColumnValues(): Promise<IFieldDefault[]>;
        setDefaultColumnValues(defaults: IFieldDefaultProps[], merge?: boolean): Promise<void>;
        clearDefaultColumnValues(): Promise<void>;
    }
    interface IFolder {
        /**
         * Gets the default column value for a given list
         */
        getDefaultColumnValues(): Promise<IFieldDefault[]>;
        /**
         *
         * Sets the default column values for this folder
         *
         * @param fieldDefaults The values to set including field name and appropriate value
         * @param merge If true (default) existing values will be updated and new values added, otherwise all defaults are replaced for this folder
         */
        setDefaultColumnValues(defaults: IFieldDefaultProps[], merge?: boolean): Promise<void>;
        /**
         * Clears all defaults from this folder
         */
        clearDefaultColumnValues(): Promise<void>;
    }
}

_Folder.prototype.getDefaultColumnValues = async function (this: _Folder): Promise<IFieldDefault[]> {

    const folderProps = await Folder(this, "Properties").select("vti_x005f_listname")<{ vti_x005f_listname: string }>();
    const { ServerRelativePath: serRelPath } = await this.select("ServerRelativePath")<{ ServerRelativePath: IResourcePath }>();

    const web = Web([this, extractWebUrl(odataUrlFrom(folderProps))]);
    const docLib = web.lists.getById(folderProps.vti_x005f_listname);

    // and we return the defaults associated with this folder's server relative path only
    // if you want all the defaults use list.getDefaultColumnValues()
    return (await docLib.getDefaultColumnValues()).filter(v => v.path.toLowerCase() === serRelPath.DecodedUrl.toLowerCase());
};

_Folder.prototype.setDefaultColumnValues = async function (fieldDefaults: IFieldDefaultProps[], merge = true): Promise<void> {

    // we start by figuring out where we are
    const folderProps = await Folder(this, "Properties").select("vti_x005f_listname")<{ vti_x005f_listname: string }>();

    // now we create a web, list and batch to get some info we need
    const web = Web([this, extractWebUrl(odataUrlFrom(folderProps))]);
    const docLib = web.lists.getById(folderProps.vti_x005f_listname);

    // we need the proper folder path
    const folderPath = (await this.select("ServerRelativePath")()).ServerRelativePath.DecodedUrl;

    // at this point we should have all the defaults to update
    // and we need to get all the defaults to update the entire doc
    const existingDefaults = await docLib.getDefaultColumnValues();

    // we filter all defaults to remove any associated with this folder if merge is false
    const filteredExistingDefaults = merge ? existingDefaults : existingDefaults.filter(f => f.path !== folderPath);

    // we update / add any new defaults from those passed to this method
    fieldDefaults.forEach(d => {

        const existing = filteredExistingDefaults.find(ed => ed.name === d.name && ed.path === folderPath);

        if (existing) {
            existing.value = d.value;
        } else {
            filteredExistingDefaults.push({
                name: d.name,
                path: folderPath,
                value: d.value,
            });
        }
    });

    // after this operation filteredExistingDefaults should contain all the value we want to write to the file
    await docLib.setDefaultColumnValues(filteredExistingDefaults);
};

_Folder.prototype.clearDefaultColumnValues = async function (this: _Folder): Promise<void> {
    await this.setDefaultColumnValues([], false);
};
