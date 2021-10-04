import {
    spInvokableFactory,
    _SPCollection,
    _SPInstance,
} from "../spqueryable.js";
import { defaultPath } from "../decorators.js";
import { PageType } from "../types.js";

/**
 * Describes a collection of Form objects
 *
 */
@defaultPath("forms")
export class _Forms extends _SPCollection<IFormInfo[]> {
    /**
     * Gets a form by id
     *
     * @param id The guid id of the item to retrieve
     */
    public getById(id: string): IForm {
        return Form(this).concat(`('${id}')`);
    }
}
export interface IForms extends _Forms {}
export const Forms = spInvokableFactory<IForms>(_Forms);

/**
 * Describes a single of Form instance
 *
 */
export class _Form extends _SPInstance<IFormInfo> { }
export interface IForm extends _Form {}
export const Form = spInvokableFactory<IForm>(_Form);

export interface IFormInfo {
    FormType: PageType;
    Id: string;
    ResourcePath: { DecodedUrl: string };
    DecodedUrl: string;
    ServerRelativeUrl: string;
}
