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
export class _Forms extends _SharePointQueryableCollection implements _IForms {
    /**	
     * Gets a form by id	
     *	
     * @param id The guid id of the item to retrieve	
     */
    public getById(id: string): IForm {
        return Form(this).concat(`('${id}')`);
    }
}

export interface _IForms {
    getById(id: string): IForm;
}
export interface IForms extends _IForms, IInvokable, ISharePointQueryableCollection { }

export const Forms = spInvokableFactory<IForms>(_Forms);

/**
 * Describes a single of Form instance
 *
 */
export class _Form extends _SharePointQueryableInstance implements _IForm { }

export interface _IForm { }
export interface IForm extends _IForm, IInvokable, ISharePointQueryableInstance { }

export const Form = spInvokableFactory<IForm>(_Form);
