import { Todo as ITodoType, TodoTaskList as ITodoTaskListType, TodoTask as ITodoTaskType, AttachmentBase as ITodoAttachmentType, AttachmentSession as IAttachmentSessionType, AttachmentInfo as IAttachmentInfoType, ChecklistItem as IChecklistItemType, LinkedResource as ILinkedResourceType } from "@microsoft/microsoft-graph-types";
import { _GraphInstance, _GraphCollection, graphInvokableFactory, IGraphCollection, GraphCollection } from "../graphqueryable.js";
import { defaultPath, getById, addable, IGetById, IAddable, updateable, IUpdateable, IDeleteable, deleteable } from "../decorators.js";
import { cancelableScope, errorCheck } from "@pnp/queryable";

/**
 * Todo
 */
@defaultPath("todo")
export class _Todo extends _GraphInstance<ITodoType> {
    public get lists(): ITaskLists{
        return TaskLists(this);
    }
}
export interface ITodo extends _Todo{ }
export const Todo = graphInvokableFactory<ITodo>(_Todo);

/**
 * TaskList
 */
@deleteable()
@updateable()
export class _TaskList extends _GraphInstance<ITodoTaskListType> { 
    public get tasks(): ITasks{
        return Tasks(this);
    }
     /**
     * Get changes since optional change token
     * @param token - string (Optional)
     * change token
     * @returns IDeltaItems
     */
     public delta(token?: string): IGraphCollection<IDeltaItems> {
        const path = `delta${(token) ? `(token=${token})` : ""}`;

        const query: IGraphCollection<IDeltaItems> = <any>GraphCollection(this, path);
        query.on.parse.replace(errorCheck);
        query.on.parse(async (url: URL, response: Response, result: any): Promise<[URL, Response, any]> => {

            const json = await response.json();
            const nextLink = json["@odata.nextLink"];
            const deltaLink = json["@odata.deltaLink"];

            result = {
                // TODO:: update docs to show how to load next with async iterator
                next: () => (nextLink ? GraphCollection([this, nextLink]) : null),
                delta: () => (deltaLink ? GraphCollection([query, deltaLink])() : null),
                values: json.value,
            };

            return [url, response, result];
        });

        return query;
    }
    //TODO Create Open Extension. Wait for it to be built as part of extensions module
    //TODO Get Open Extension. Wait for it to be built as part of extensions module
}
export interface ITaskList extends _TaskList, IUpdateable<ITodoTaskListType>, IDeleteable { }
export const TaskList = graphInvokableFactory<ITaskList>(_TaskList);

/**
 * TaskLists
 */
@defaultPath("lists")
@getById(TaskList)
@addable()
export class _TaskLists extends _GraphCollection<ITodoTaskListType[]> { }
export interface ITaskLists extends _TaskLists, IGetById<ITaskList>, IAddable<ITodoTaskListType,ITodoTaskListType>{ }
export const TaskLists = graphInvokableFactory<ITaskLists>(_TaskLists);

/**
 * Task
 */
@deleteable()
@updateable()
export class _Task extends _GraphInstance<ITodoTaskType> { 

    public get attachments(): IAttachments{
        return Attachments(this);
    }

    public get checklistItems(): IChecklistItems{
        return ChecklistItems(this);
    }

    public get resources(): ILinkedResources{
        return LinkedResources(this);
    }
    //TODO Create Open Extension. Wait for it to be built as part of extensions module
    //TODO Get Open Extension. Wait for it to be built as part of extensions module
}
export interface ITask extends _Task, IUpdateable<ITodoTaskType>, IDeleteable{ }
export const Task = graphInvokableFactory<ITask>(_Task);

/**
 * Tasks
 */
@defaultPath("tasks")
@getById(Task)
@addable()
export class _Tasks extends _GraphCollection<ITodoTaskType[]> { 
    /**
     * Get changes since optional change token
     * @param token - string (Optional)
     * change token
     * @returns IDeltaItems
     */
    public delta(token?: string): IGraphCollection<IDeltaItems> {
        const path = `delta${(token) ? `(token=${token})` : ""}`;

        const query: IGraphCollection<IDeltaItems> = <any>GraphCollection(this, path);
        query.on.parse.replace(errorCheck);
        query.on.parse(async (url: URL, response: Response, result: any): Promise<[URL, Response, any]> => {

            const json = await response.json();
            const nextLink = json["@odata.nextLink"];
            const deltaLink = json["@odata.deltaLink"];

            result = {
                // TODO:: update docs to show how to load next with async iterator
                next: () => (nextLink ? GraphCollection([this, nextLink]) : null),
                delta: () => (deltaLink ? GraphCollection([query, deltaLink])() : null),
                values: json.value,
            };

            return [url, response, result];
        });

        return query;
    }
}
export interface ITasks extends _Tasks, IGetById<ITask>, IAddable<ITodoTaskType,ITodoTaskType>{ }
export const Tasks = graphInvokableFactory<ITasks>(_Tasks);

/**
 * Attachment
 */
@deleteable()
export class _Attachment extends _GraphInstance<ITodoAttachmentType> { 

    public get attachments(): IAttachments{
        return Attachments(this);
    }
}
export interface IAttachment extends _Attachments, IDeleteable{ }
export const Attachment = graphInvokableFactory<IAttachments>(_Attachment);

/**
 * Attachments
 */
@defaultPath("attachments")
@getById(Attachment)
@addable()
export class _Attachments extends _GraphCollection<ITodoAttachmentType[]> {

    // maybe we should fix this so they just pass a file, instead of an attachment info object.
    @cancelableScope
    public async addChunked(attachmentInfo: IAttachmentInfoType): Promise<any>{
       // const response:IAttachmentSessionType = await graphPost(this, body(attachmentInfo));
        return null;
    }
 }
export interface IAttachments extends _Attachments, IGetById<IAttachment>, IAddable<IAttachmentInfoType>{ }
export const Attachments = graphInvokableFactory<IAttachments>(_Attachments);

/**
 * Checklist
 */
@deleteable()
@updateable()
export class _ChecklistItem extends _GraphInstance<IChecklistItemType> { }
export interface IChecklistItem extends _ChecklistItems, IUpdateable<IChecklistItemType>, IDeleteable{ }
export const ChecklistItem = graphInvokableFactory<IChecklistItem>(_ChecklistItem);

/**
 * ChecklistItems
 */
@defaultPath("checklistItems")
@getById(ChecklistItem)
@addable()
export class _ChecklistItems extends _GraphCollection<IChecklistItemType[]> { }
export interface IChecklistItems extends _ChecklistItems, IGetById<IChecklistItemType>, IAddable<IChecklistItemType>{ }
export const ChecklistItems = graphInvokableFactory<IChecklistItems>(_ChecklistItems);

/**
 * LinkedResource
 */
@deleteable()
@updateable()
export class _LinkedResource extends _GraphInstance<ILinkedResourceType> { }
export interface ILinkedResource extends _LinkedResource, IUpdateable<ILinkedResourceType>, IDeleteable{ }
export const LinkedResource = graphInvokableFactory<ILinkedResource>(_LinkedResource);

/**
 * LinkedResources
 */
@defaultPath("linkedResources")
@getById(LinkedResource)
@addable()
export class _LinkedResources extends _GraphCollection<ILinkedResourceType[]> { }
export interface ILinkedResources extends _LinkedResources, IGetById<ILinkedResourceType>, IAddable<ILinkedResourceType>{ }
export const LinkedResources = graphInvokableFactory<ILinkedResources>(_LinkedResources);

export interface IAddTaskListOptions{
    displayName: string;
}

export interface IDeltaItems {
    next: IGraphCollection<IDeltaItems>;
    delta: IGraphCollection<IDeltaItems>;
    values: any[];
}
