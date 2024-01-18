import {
    PlannerPlan as IPlannerPlanType,
    PlannerPlanDetails as IPlannerPlanDetailsType,
    PlannerTask as IPlannerTaskType,
    PlannerTaskDetails as IPlannerTaskDetailsType,
    PlannerBucket as IPlannerBucketType,
    Planner as IPlannerType,
    PlannerPlanContainer as IPlannerPlanContainerType,
    PlannerAssignedToTaskBoardTaskFormat as IPlannerAssignedToTaskBoardTaskFormatType,
    PlannerBucketTaskBoardTaskFormat as IPlannerBucketTaskBoardTaskFormatType,
    PlannerProgressTaskBoardTaskFormat as IPlannerProgressTaskBoardTaskFormatType,
} from "@microsoft/microsoft-graph-types";
import { _GraphInstance, _GraphCollection, graphInvokableFactory } from "../graphqueryable.js";
import { getById, IGetById, deleteableWithETag, IDeleteableWithETag, updateableWithETag, IUpdateableWithETag, addable, IAddable } from "../decorators.js";
import { defaultPath } from "../decorators.js";

/**
 * Planner
 */
@defaultPath("planner")
export class _Planner extends _GraphInstance<IPlannerType> {

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
export class _PlanDetails extends _GraphInstance<IPlannerPlanDetailsType> { }
export interface IPlanDetails extends _PlanDetails, IUpdateableWithETag<IPlannerPlanDetailsType> { }
export const PlanDetails = graphInvokableFactory<IPlanDetails>(_PlanDetails);

/**
 * Plan
 */
@updateableWithETag()
@deleteableWithETag()
export class _Plan extends _GraphInstance<IPlannerPlanType> {

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
@addable()
export class _Plans extends _GraphCollection<IPlannerPlanType[]> {}
export interface IPlans extends _Plans, IGetById<IPlan>, IAddable<IPlanAdd, IPlannerPlanType> { }
export const Plans = graphInvokableFactory<IPlans>(_Plans);

/**
 * Details
 */
@defaultPath("details")
@updateableWithETag()
export class _TaskDetails extends _GraphInstance<IPlannerTaskDetailsType> { }
export interface ITaskDetails extends _TaskDetails, IUpdateableWithETag<IPlannerTaskDetailsType> { }
export const TaskDetails = graphInvokableFactory<ITaskDetails>(_TaskDetails);

/**
 * AssignedToTaskBoardFormat
 */
@defaultPath("assignedToTaskBoardFormat")
@updateableWithETag()
export class _AssignedToTaskBoardFormat extends _GraphInstance<IPlannerAssignedToTaskBoardTaskFormatType> { }
export interface IAssignedToTaskBoardFormat extends _AssignedToTaskBoardFormat, IUpdateableWithETag<IPlannerAssignedToTaskBoardTaskFormatType> { }
export const AssignedToTaskBoardFormat = graphInvokableFactory<IAssignedToTaskBoardFormat>(_AssignedToTaskBoardFormat);

/**
 * BucketTaskBoardFormat
 */
@defaultPath("bucketTaskBoardFormat")
@updateableWithETag()
export class _BucketTaskBoardFormat extends _GraphInstance<IPlannerBucketTaskBoardTaskFormatType> { }
export interface IBucketTaskBoardFormat extends _BucketTaskBoardFormat, IUpdateableWithETag<IPlannerBucketTaskBoardTaskFormatType> { }
export const BucketTaskBoardFormat = graphInvokableFactory<IBucketTaskBoardFormat>(_BucketTaskBoardFormat);

/**
 * ProgressTaskBoardFormat
 */
@defaultPath("progressTaskBoardFormat")
@updateableWithETag()
export class _ProgressTaskBoardFormat extends _GraphInstance<IPlannerProgressTaskBoardTaskFormatType> { }
export interface IProgressTaskBoardFormat extends _ProgressTaskBoardFormat, IUpdateableWithETag<IPlannerProgressTaskBoardTaskFormatType> { }
export const ProgressTaskBoardFormat = graphInvokableFactory<IProgressTaskBoardFormat>(_ProgressTaskBoardFormat);

/**
 * Task
 */
@updateableWithETag()
@deleteableWithETag()
export class _Task extends _GraphInstance<IPlannerTaskType> {
    public get details(): ITaskDetails {
        return TaskDetails(this);
    }

    public get assignedToTaskBoardFormat(): IAssignedToTaskBoardFormat {
        return AssignedToTaskBoardFormat(this);
    }

    public get bucketTaskBoardFormat(): IBucketTaskBoardFormat {
        return BucketTaskBoardFormat(this);
    }

    public get progressTaskBoardFormat(): IProgressTaskBoardFormat {
        return ProgressTaskBoardFormat(this);
    }
}
export interface ITask extends _Task, IUpdateableWithETag<IPlannerTaskType>, IDeleteableWithETag { }
export const Task = graphInvokableFactory<ITask>(_Task);

/**
 * Tasks
 */
@defaultPath("tasks")
@getById(Task)
@addable()
export class _Tasks extends _GraphCollection<IPlannerTaskType[]> {}
export interface ITasks extends _Tasks, IGetById<ITask>, IAddable<IPlannerTaskType, IPlannerTaskType> { }
export const Tasks = graphInvokableFactory<ITasks>(_Tasks);

/**
 * Bucket
 */
@updateableWithETag()
@deleteableWithETag()
export class _Bucket extends _GraphInstance<IPlannerBucketType> {
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
@addable()
export class _Buckets extends _GraphCollection<IPlannerBucketType[]> {}
export interface IBuckets extends _Buckets, IGetById<IBucket>, IAddable<IPlannerBucketType, IPlannerBucketType> { }
export const Buckets = graphInvokableFactory<IBuckets>(_Buckets);

export interface IPlanAdd {
    container: IPlannerPlanContainerType;
    title: string;
}

