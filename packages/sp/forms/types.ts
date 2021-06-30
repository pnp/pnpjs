import {
    _OLD_SharePointQueryableInstance,
    _OLD_SharePointQueryableCollection,
    OLD_spInvokableFactory,
} from "../sharepointqueryable.js";
import { defaultPath } from "../decorators.js";
import { PageType } from "../types.js";
import { tag } from "../telemetry.js";

/**
 * Describes a collection of Form objects
 *
 */
@defaultPath("forms")
export class _Forms extends _OLD_SharePointQueryableCollection<IFormInfo[]> {
    /**
     * Gets a form by id
     *
     * @param id The guid id of the item to retrieve
     */
    public getById(id: string): IForm {
        return tag.configure(Form(this).concat(`('${id}')`), "fos.getById");
    }
}
export interface IForms extends _Forms {}
export const Forms = OLD_spInvokableFactory<IForms>(_Forms);

/**
 * Describes a single of Form instance
 *
 */
export class _Form extends _OLD_SharePointQueryableInstance<IFormInfo> { }
export interface IForm extends _Form {}
export const Form = OLD_spInvokableFactory<IForm>(_Form);

export interface IFormInfo {
    FormType: PageType;
    Id: string;
    ResourcePath: { DecodedUrl: string };
    DecodedUrl: string;
    ServerRelativeUrl: string;
}
