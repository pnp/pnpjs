import { GraphQueryableInstance, GraphQueryableCollection, defaultPath } from "./graphqueryable";
import { jsS, TypedHash, extend } from "@pnp/common";
import {
    PlannerPlan as IPlannerPlan,
    PlannerTask as IPlannerTask,
    PlannerBucket as IPlannerBucket,
    Planner as IPlanner,
    PlannerPlanDetails as IPlannerPlanDetails,
} from "@microsoft/microsoft-graph-types";

// Should not be able to use the planner.get()
export interface IPlannerMethods {
    plans: Plans;
    tasks: Tasks;
    buckets: Buckets;
}

@defaultPath("planner")
export class Planner extends GraphQueryableInstance<IPlanner> implements IPlannerMethods {

    // Should Only be able to get by id, or else error occur
    public get plans(): Plans {
        return new Plans(this);
    }

    // Should Only be able to get by id, or else error occur
    public get tasks(): Tasks {
        return new Tasks(this);
    }

    // Should Only be able to get by id, or else error occur
    public get buckets(): Buckets {
        return new Buckets(this);
    }
}

@defaultPath("plans")
export class Plans extends GraphQueryableCollection<IPlannerPlan[]> {
    public getById(id: string): Plan {
        return new Plan(this, id);
    }

    /**
     * Create a new Planner Plan.
     * 
     * @param owner Id of Group object.
     * @param title The Title of the Plan.
     */
    public add(owner: string, title: string): Promise<PlanAddResult> {

        const postBody = {
            owner: owner,
            title: title,
        };

        return this.postCore({
            body: jsS(postBody),
        }).then(r => {
            return {
                data: r,
                plan: this.getById(r.id),
            };
        });
    }

}

/**
 * Should not be able to get by Id
 */

export class Plan extends GraphQueryableInstance<IPlannerPlan> {

    public get tasks(): Tasks {
        return new Tasks(this);
    }

    public get buckets(): Buckets {
        return new Buckets(this);
    }

    public get details(): Details {
        return new Details(this);
    }

    /**
     * Deletes this Plan
     */
    public delete(): Promise<void> {
        return this.deleteCore();
    }

    /**
     * Update the properties of a Plan
     * 
     * @param properties Set of properties of this Plan to update
     */
    public update(properties: IPlanner, eTag = "*"): Promise<void> {

        return this.patchCore({
            body: jsS(properties),
            headers: {
                "If-Match": eTag,
            },
        });
    }
}

@defaultPath("tasks")
export class Tasks extends GraphQueryableCollection<IPlannerTask[]> {
    public getById(id: string): Task {
        return new Task(this, id);
    }

    /**
     * Create a new Planner Task.
     * 
     * @param planId Id of Plan.
     * @param title The Title of the Task.
     * @param assignments Assign the task
     * @param bucketId Id of Bucket
     */
    public add(planId: string, title: string, assignments?: TypedHash<any>, bucketId?: string): Promise<TaskAddResult> {

        let postBody = extend({
            planId: planId,
            title: title,
        }, assignments);

        if (bucketId) {
            postBody = extend(postBody, {
                bucketId: bucketId,
            });
        }

        return this.postCore({
            body: jsS(postBody),
        }).then(r => {
            return {
                data: r,
                task: this.getById(r.id),
            };
        });
    }

}

export class Task extends GraphQueryableInstance<IPlannerTask> {
    /**
     * Deletes this Task
     */
    public delete(): Promise<void> {
        return this.deleteCore();
    }

    /**
     * Update the properties of a Task
     * 
     * @param properties Set of properties of this Task to update
     */
    public update(properties: IPlannerTask, eTag = "*"): Promise<void> {

        return this.patchCore({
            body: jsS(properties),
            headers: {
                "If-Match": eTag,
            },
        });
    }

    public get details(): Details {
        return new Details(this);
    }
}

@defaultPath("buckets")
export class Buckets extends GraphQueryableCollection<IPlannerBucket[]> {
    /**
     * Create a new Bucket.
     * 
     * @param name Name of Bucket object.
     * @param planId The Id of the Plan.
     * @param oderHint Hint used to order items of this type in a list view.
     */
    public add(name: string, planId: string, orderHint?: string): Promise<BucketAddResult> {

        const postBody = {
            name: name,
            orderHint: orderHint ? orderHint : "",
            planId: planId,
        };

        return this.postCore({
            body: jsS(postBody),
        }).then(r => {
            return {
                bucket: this.getById(r.id),
                data: r,
            };
        });
    }

    public getById(id: string): Bucket {
        return new Bucket(this, id);
    }

}

export class Bucket extends GraphQueryableInstance<IPlannerBucket> {
    /**
     * Deletes this Bucket
     */
    public delete(): Promise<void> {
        return this.deleteCore();
    }

    /**
     * Update the properties of a Bucket
     * 
     * @param properties Set of properties of this Bucket to update
     */
    public update(properties: IPlannerBucket, eTag = "*"): Promise<void> {

        return this.patchCore({
            body: jsS(properties),
            headers: {
                "If-Match": eTag,
            },
        });
    }

    public get tasks(): Tasks {
        return new Tasks(this);
    }
}

@defaultPath("details")
export class Details extends GraphQueryableCollection<IPlannerPlanDetails> { }

export interface BucketAddResult {
    data: IPlannerBucket;
    bucket: Bucket;
}

export interface PlanAddResult {
    data: IPlannerPlan;
    plan: Plan;
}

export interface TaskAddResult {
    data: IPlannerTask;
    task: Task;
}
