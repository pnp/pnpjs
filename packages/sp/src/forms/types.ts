import {
    _SharePointQueryableInstance,
    _SharePointQueryableCollection,
    spInvokableFactory,
} from "../sharepointqueryable";
import { defaultPath } from "../decorators";

/**
 * Describes a collection of Field objects
 *
 */
@defaultPath("forms")
export class _Forms extends _SharePointQueryableCollection {
    /**	
     * Gets a form by id	
     *	
     * @param id The guid id of the item to retrieve	
     */
    public getById(id: string): IForm {
        return Form(this).concat(`('${id}')`);
    }
}
export interface IForms extends _Forms { }
export const Forms = spInvokableFactory<IForms>(_Forms);

/**
 * Describes a single of Form instance
 *
 */
export class _Form extends _SharePointQueryableInstance { }
export interface IForm extends _Form { }
export const Form = spInvokableFactory<IForm>(_Form);
