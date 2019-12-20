import { ITypedHash, assign } from "@pnp/common";
import {
    PlannerPlan as IPlannerPlanType,
    PlannerTask as IPlannerTaskType,
    PlannerBucket as IPlannerBucketType,
    Planner as IPlannerType,
} from "@microsoft/microsoft-graph-types";
import { IInvokable, body } from "@pnp/odata";
import { _GraphQueryableInstance, IGraphQueryableInstance, _GraphQueryableCollection, IGraphQueryableCollection, graphInvokableFactory } from "../graphqueryable";
import { updateable, IUpdateable, deleteable, IDeleteable, getById, IGetById } from "../decorators";
import { graphPost } from "../operations";
import { defaultPath } from "../decorators";

/**
 * Planner
 */
@defaultPath("planner")
export class _Planner extends _GraphQueryableInstance<IPlannerType> implements _IPlanner {

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
export interface _IPlanner {
    readonly plans: IPlans;
    readonly tasks: ITasks;
    readonly buckets: IBuckets;
}
export interface IPlanner extends _IPlanner, IInvokable { }
export const Planner = graphInvokableFactory<IPlanner>(_Planner);

/**
 * Plan
 */
@updateable()
@deleteable()
export class _Plan extends _GraphQueryableInstance<IPlannerPlanType> implements _IPlan {

    public get tasks(): ITasks {
        return Tasks(this);
    }

    public get buckets(): IBuckets {
        return Buckets(this);
    }
}
export interface _IPlan {
    readonly tasks: ITasks;
    readonly buckets: IBuckets;
}
export interface IPlan extends _IPlan, IInvokable, IUpdateable<IPlannerPlanType>, IDeleteable, IGraphQueryableInstance<IPlannerPlanType> {}
export const Plan = graphInvokableFactory<IPlan>(_Plan);

@defaultPath("plans")
@getById(Plan)
export class _Plans extends _GraphQueryableCollection<IPlannerPlanType[]> implements _IPlans {
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
export interface _IPlans {
    add(owner: string, title: string): Promise<IPlanAddResult>;
}
export interface IPlans extends _IPlans, IInvokable, IGetById<IPlan>, IGraphQueryableCollection<IPlannerPlanType[]> {}
export const Plans = graphInvokableFactory<IPlans>(_Plans);

/**
 * Task
 */
@updateable()
@deleteable()
export class _Task extends _GraphQueryableInstance<IPlannerTaskType> implements _ITask { }
export interface _ITask { }
export interface ITask extends _ITask, IInvokable, IUpdateable<IPlannerTaskType>, IDeleteable, IGraphQueryableInstance<IPlannerTaskType> { }
export const Task = graphInvokableFactory<ITask>(_Task);

/**
 * Tasks
 */
@defaultPath("tasks")
@getById(Task)
export class _Tasks extends _GraphQueryableCollection<IPlannerTaskType[]> implements _ITasks {
    /**
     * Create a new Planner Task.
     * 
     * @param planId Id of Plan.
     * @param title The Title of the Task.
     * @param assignments Assign the task
     * @param bucketId Id of Bucket
     */
    public async add(planId: string, title: string, assignments?: ITypedHash<any>, bucketId?: string): Promise<ITaskAddResult> {

        let postBody = assign({
            planId,
            title,
        }, assignments);

        if (bucketId) {
            postBody = assign(postBody, {
                bucketId: bucketId,
            });
        }

        const data = await graphPost(this, body(postBody));

        return {
            data,
            task: (<any>this).getById(data.id),
        };
    }
}
export interface _ITasks {
    add(planId: string, title: string, assignments?: ITypedHash<any>, bucketId?: string): Promise<ITaskAddResult>;
}
export interface ITasks extends _ITasks, IInvokable, IGetById<ITask>, IGraphQueryableCollection<IPlannerTaskType[]> {}
export const Tasks = graphInvokableFactory<ITasks>(_Tasks);


/**
 * Bucket
 */
@updateable()
@deleteable()
export class _Bucket extends _GraphQueryableInstance<IPlannerBucketType> implements _IBucket {
    public get tasks(): ITasks {
        return Tasks(this);
    }
}
export interface _IBucket {
    readonly tasks: ITasks;
}
export interface IBucket extends _IBucket, IInvokable, IUpdateable<IPlannerBucketType>, IDeleteable, IGraphQueryableInstance<IPlannerBucketType> {}
export const Bucket = graphInvokableFactory<IBucket>(_Bucket);


/**
 * Buckets
 */
@defaultPath("buckets")
@getById(Bucket)
export class _Buckets extends _GraphQueryableCollection<IPlannerBucketType[]> implements _IBuckets {
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
export interface _IBuckets {
    add(name: string, planId: string, orderHint?: string): Promise<IBucketAddResult>;
}
export interface IBuckets extends _IBuckets, IInvokable, IGetById<IBucket>, IGraphQueryableCollection<IPlannerBucketType[]> {}
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
