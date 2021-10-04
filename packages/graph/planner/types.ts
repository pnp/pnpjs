import {
    PlannerPlan as IPlannerPlanType,
    PlannerPlanDetails as IPlannerPlanDetailsType,
    PlannerTask as IPlannerTaskType,
    PlannerTaskDetails as IPlannerTaskDetailsType,
    PlannerBucket as IPlannerBucketType,
    Planner as IPlannerType,
} from "@microsoft/microsoft-graph-types";
import { body } from "@pnp/queryable";
import { _GraphQueryableInstance, _GraphQueryableCollection, graphInvokableFactory } from "../graphqueryable.js";
import { getById, IGetById, deleteableWithETag, IDeleteableWithETag, updateableWithETag, IUpdateableWithETag } from "../decorators.js";
import { graphPost } from "../operations.js";
import { defaultPath } from "../decorators.js";

/**
 * Planner
 */
@defaultPath("planner")
export class _Planner extends _GraphQueryableInstance<IPlannerType> {

    // Should Only be able to get by id, or else error occur
    public get plans(): IPlans {
        return Plans(this);
    }

    // Should Only be able to get by id, or else error occur
    public get tasks(): ITasks {
        return Tasks(this);
    }

    // Should Only be able to get by id, or else error occur
    public get buckets(): IBuckets {
        return Buckets(this);
    }
}
export interface IPlanner extends _Planner { }
export const Planner = graphInvokableFactory<IPlanner>(_Planner);

/**
 * Details
 */
@defaultPath("details")
@updateableWithETag()
export class _PlanDetails extends _GraphQueryableInstance<IPlannerPlanDetailsType> { }
export interface IPlanDetails extends _PlanDetails, IUpdateableWithETag<IPlannerPlanDetailsType> { }
export const PlanDetails = graphInvokableFactory<ITaskDetails>(_PlanDetails);

/**
 * Plan
 */
@updateableWithETag()
@deleteableWithETag()
export class _Plan extends _GraphQueryableInstance<IPlannerPlanType> {

    public get tasks(): ITasks {
        return Tasks(this);
    }

    public get buckets(): IBuckets {
        return Buckets(this);
    }

    public get details(): IPlanDetails {
        return PlanDetails(this);
    }
}
export interface IPlan extends _Plan, IUpdateableWithETag<IPlannerPlanType>, IDeleteableWithETag { }
export const Plan = graphInvokableFactory<IPlan>(_Plan);

@defaultPath("plans")
@getById(Plan)
export class _Plans extends _GraphQueryableCollection<IPlannerPlanType[]> {
    /**
     * Create a new Planner Plan.
     *
     * @param owner Id of Group object.
     * @param title The Title of the Plan.
     */
    public async add(owner: string, title: string): Promise<IPlanAddResult> {

        const data = await graphPost(this, body({ owner, title }));

        return {
            data,
            plan: (<any>this).getById(data.id),
        };
    }
}
export interface IPlans extends _Plans, IGetById<IPlan> { }
export const Plans = graphInvokableFactory<IPlans>(_Plans);

/**
 * Details
 */
@defaultPath("details")
@updateableWithETag()
export class _TaskDetails extends _GraphQueryableInstance<IPlannerTaskDetailsType> { }
export interface ITaskDetails extends _TaskDetails, IUpdateableWithETag<IPlannerTaskDetailsType> { }
export const TaskDetails = graphInvokableFactory<ITaskDetails>(_TaskDetails);

/**
 * Task
 */
@updateableWithETag()
@deleteableWithETag()
export class _Task extends _GraphQueryableInstance<IPlannerTaskType> {
    public get details(): ITaskDetails {
        return TaskDetails(this);
    }
}
export interface ITask extends _Task, IUpdateableWithETag<IPlannerTaskType>, IDeleteableWithETag { }
export const Task = graphInvokableFactory<ITask>(_Task);

/**
 * Tasks
 */
@defaultPath("tasks")
@getById(Task)
export class _Tasks extends _GraphQueryableCollection<IPlannerTaskType[]> {
    /**
     * Create a new Planner Task.
     *
     * @param planId Id of Plan.
     * @param title The Title of the Task.
     * @param assignments Assign the task
     * @param bucketId Id of Bucket
     */
    public async add(planId: string, title: string, assignments?: Record<string, any>, bucketId?: string): Promise<ITaskAddResult> {

        let postBody = {
            planId,
            title,
            ...assignments,
        };

        if (bucketId) {
            postBody = <any>{
                ...postBody,
                bucketId,
            };
        }

        const data = await graphPost(this, body(postBody));

        return {
            data,
            task: (<any>this).getById(data.id),
        };
    }
}
export interface ITasks extends _Tasks, IGetById<ITask> { }
export const Tasks = graphInvokableFactory<ITasks>(_Tasks);

/**
 * Bucket
 */
@updateableWithETag()
@deleteableWithETag()
export class _Bucket extends _GraphQueryableInstance<IPlannerBucketType> {
    public get tasks(): ITasks {
        return Tasks(this);
    }
}
export interface IBucket extends _Bucket, IUpdateableWithETag<IPlannerBucketType>, IDeleteableWithETag { }
export const Bucket = graphInvokableFactory<IBucket>(_Bucket);


/**
 * Buckets
 */
@defaultPath("buckets")
@getById(Bucket)
export class _Buckets extends _GraphQueryableCollection<IPlannerBucketType[]> {
    /**
     * Create a new Bucket.
     *
     * @param name Name of Bucket object.
     * @param planId The Id of the Plan.
     * @param oderHint Hint used to order items of this type in a list view.
     */
    public async add(name: string, planId: string, orderHint?: string): Promise<IBucketAddResult> {

        const postBody = {
            name: name,
            orderHint: orderHint ? orderHint : "",
            planId: planId,
        };

        const data = await graphPost(this, body(postBody));

        return {
            bucket: (<any>this).getById(data.id),
            data,
        };
    }
}
export interface IBuckets extends _Buckets, IGetById<IBucket> { }
export const Buckets = graphInvokableFactory<IBuckets>(_Buckets);

export interface IBucketAddResult {
    data: IPlannerBucketType;
    bucket: IBucket;
}

export interface IPlanAddResult {
    data: IPlannerPlanType;
    plan: IPlan;
}

export interface ITaskAddResult {
    data: IPlannerTaskType;
    task: ITask;
}
