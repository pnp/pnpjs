import {
    _SharePointQueryableInstance,
    _SharePointQueryableCollection,
    spInvokableFactory,
} from "../sharepointqueryable";
import { defaultPath } from "../decorators";
import { PageType } from "../types";
import { tag } from "../telemetry";

/**
 * Describes a collection of Form objects
 *
 */
@defaultPath("forms")
export class _Forms extends _SharePointQueryableCollection<IFormInfo[]> {
    /**	
     * Gets a form by id	
     *	
     * @param id The guid id of the item to retrieve	
     */
    public getById(id: string): IForm {
        return tag.configure(Form(this).concat(`('${id}')`), "fos.getById");
    }
}
export interface IForms extends _Forms { }
export const Forms = spInvokableFactory<IForms>(_Forms);

/**
 * Describes a single of Form instance
 *
 */
export class _Form extends _SharePointQueryableInstance<IFormInfo> { }
export interface IForm extends _Form { }
export const Form = spInvokableFactory<IForm>(_Form);

export interface IFormInfo {
    FormType: PageType;
    Id: string;
    ResourcePath: { DecodedUrl: string; };
    DecodedUrl: string;
    ServerRelativeUrl: string;
}
