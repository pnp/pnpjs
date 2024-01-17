import {
    Todo as ITodoType,
    TodoTaskList as ITodoTaskListType,
    TodoTask as ITodoTaskType,
    AttachmentBase as ITodoAttachmentType,
    ChecklistItem as IChecklistItemType,
    LinkedResource as ILinkedResourceType,
} from "@microsoft/microsoft-graph-types";
import { _GraphInstance, _GraphCollection, graphInvokableFactory, graphPost } from "../graphqueryable.js";
import { defaultPath, getById, addable, IGetById, IAddable, updateable, IUpdateable, IDeleteable, deleteable, hasDelta, IHasDelta, IDeltaProps } from "../decorators.js";
import { body } from "@pnp/queryable/index.js";

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

    // TODO Create Open Extension. Wait for it to be built as part of extensions module
    // TODO Get Open Extension. Wait for it to be built as part of extensions module
}
export interface ITaskList extends _TaskList, IUpdateable<ITodoTaskListType>, IDeleteable { }
export const TaskList = graphInvokableFactory<ITaskList>(_TaskList);

/**
 * TaskLists
 */
@defaultPath("lists")
@getById(TaskList)
@addable()
@hasDelta()
export class _TaskLists extends _GraphCollection<ITodoTaskListType[]> { }
export interface ITaskLists extends _TaskLists, IGetById<ITaskList>, IAddable<ITodoTaskListType, ITodoTaskListType>, IHasDelta<Omit<IDeltaProps, "token">, ITodoTaskListType> { }
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
    // TODO Create Open Extension. Wait for it to be built as part of extensions module
    // TODO Get Open Extension. Wait for it to be built as part of extensions module
}
export interface ITask extends _Task, IUpdateable<ITodoTaskType>, IDeleteable{ }
export const Task = graphInvokableFactory<ITask>(_Task);

/**
 * Tasks
 */
@defaultPath("tasks")
@getById(Task)
@addable()
@hasDelta()
export class _Tasks extends _GraphCollection<ITodoTaskType[]> { }
export interface ITasks extends _Tasks, IGetById<ITask>, IAddable<ITodoTaskType>, IHasDelta<Omit<IDeltaProps, "token">, ITodoTaskType> { }
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
export interface IAttachment extends _Attachment, IDeleteable{ }
export const Attachment = graphInvokableFactory<IAttachments>(_Attachment);

/**
 * Attachments
 */
@defaultPath("attachments")
@getById(Attachment)
export class _Attachments extends _GraphCollection<ITodoAttachmentType[]> {

    public async add(attachmentInfo: IAddAttachmentOptions): Promise<ITodoAttachmentType>{

        const postBody = {
            "@odata.type": "#microsoft.graph.taskFileAttachment",
            ...attachmentInfo,
        };
        return graphPost(this, body(postBody));
    }
}
export interface IAttachments extends _Attachments, IGetById<IAttachment> { }
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
export interface IChecklistItems extends _ChecklistItems, IGetById<IChecklistItem>, IAddable<IChecklistItemType>{ }
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
export interface ILinkedResources extends _LinkedResources, IGetById<ILinkedResource>, IAddable{ }
export const LinkedResources = graphInvokableFactory<ILinkedResources>(_LinkedResources);

export interface IAddTaskListOptions{
    displayName: string;
}

export interface IAddAttachmentOptions extends ITodoAttachmentType{
    contentBytes: string;
}
