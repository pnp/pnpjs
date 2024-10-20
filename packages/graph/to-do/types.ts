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
    public get tasks(): ITodoTasks{
        return TodoTasks(this);
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
 * TodoTask
 */
@deleteable()
@updateable()
export class _TodoTask extends _GraphInstance<ITodoTaskType> {

    public get attachments(): ITodoAttachments{
        return TodoAttachments(this);
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
export interface ITodoTask extends _TodoTask, IUpdateable<ITodoTaskType>, IDeleteable{ }
export const TodoTask = graphInvokableFactory<ITodoTask>(_TodoTask);

/**
 * TodoTasks
 */
@defaultPath("tasks")
@getById(TodoTask)
@addable()
@hasDelta()
export class _TodoTasks extends _GraphCollection<ITodoTaskType[]> { }
export interface ITodoTasks extends _TodoTasks, IGetById<ITodoTask>, IAddable<ITodoTaskType>, IHasDelta<Omit<IDeltaProps, "token">, ITodoTaskType> { }
export const TodoTasks = graphInvokableFactory<ITodoTasks>(_TodoTasks);

/**
 * TodoAttachment
 */
@deleteable()
export class _TodoAttachment extends _GraphInstance<ITodoAttachmentType> {

    public get TodoAttachments(): ITodoAttachments{
        return TodoAttachments(this);
    }
}
export interface ITodoAttachment extends _TodoAttachment, IDeleteable{ }
export const TodoAttachment = graphInvokableFactory<ITodoAttachments>(_TodoAttachment);

/**
 * TodoAttachments
 */
@defaultPath("attachments")
@getById(TodoAttachment)
export class _TodoAttachments extends _GraphCollection<ITodoAttachmentType[]> {

    public async add(TodoAttachmentInfo: IAddTodoAttachmentOptions): Promise<ITodoAttachmentType>{

        const postBody = {
            "@odata.type": "#microsoft.graph.taskFileAttachment",
            ...TodoAttachmentInfo,
        };
        return graphPost(this, body(postBody));
    }
}
export interface ITodoAttachments extends _TodoAttachments, IGetById<ITodoAttachment> { }
export const TodoAttachments = graphInvokableFactory<ITodoAttachments>(_TodoAttachments);

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

export interface IAddTodoAttachmentOptions extends ITodoAttachmentType{
    contentBytes: string;
}
