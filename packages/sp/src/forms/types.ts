import { IInvokable } from "@pnp/odata";
import {
    _SharePointQueryableInstance,
    ISharePointQueryableInstance,
    ISharePointQueryableCollection,
    _SharePointQueryableCollection,
    spInvokableFactory,
} from "../sharepointqueryable";
import { defaultPath } from "../decorators";

/**
 * Describes a collection of Field objects
 *
 */
@defaultPath("forms")
export class _Forms extends _SharePointQueryableCollection implements IForms {
    /**	
     * Gets a form by id	
     *	
     * @param id The guid id of the item to retrieve	
     */
    public getById(id: string): IForm {
        return Form(this).concat(`('${id}')`);
    }
}

export interface IForms extends IInvokable, ISharePointQueryableCollection {
    getById(id: string): IForm;
}
export interface _Forms extends IInvokable { }
export const Forms = spInvokableFactory<IForms>(_Forms);

/**
 * Describes a single of Form instance
 *
 */
export class _Form extends _SharePointQueryableInstance implements IForm { }

export interface IForm extends IInvokable, ISharePointQueryableInstance { }
export interface _Form extends IInvokable { }
export const Form = spInvokableFactory<IForm>(_Form);
