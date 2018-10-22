import { GraphQueryable, GraphQueryableInstance, GraphQueryableCollection } from "./graphqueryable";
import { jsS, TypedHash, extend } from "@pnp/common";
import { PlannerPlan as IPlannerPlan, PlannerTask as IPlannerTask, PlannerBucket as IPlannerBucket } from "@microsoft/microsoft-graph-types";

// Should not be able to use the planner.get()
export interface IPlannerMethods {
    plans: IPlansMethods;
    tasks: ITasksMethods;
    buckets: IBucketsMethods;
}

export interface IPlansMethods {
    getById(id: string): Plan;
    add(owner: string, title: string): Promise<PlanAddResult>;
}

export interface ITasksMethods {
    getById(id: string): Task;
    add(planId: string, title: string, assignments?: TypedHash<any>, bucketId?: string): Promise<TaskAddResult>;
}

export interface IBucketsMethods {
    getById(id: string): Bucket;
    add(name: string, planId: string, orderHint?: string): Promise<BucketAddResult>;
}

export class Planner extends GraphQueryableCollection implements IPlannerMethods {

    constructor(baseUrl: string | GraphQueryable, path = "planner") {
        super(baseUrl, path);
    }

    // Should Only be able to get by id, or else error occur
    public get plans(): IPlansMethods {
        return new PlansNoGet(this);
    }

    // Should Only be able to get by id, or else error occur
    public get tasks(): ITasksMethods {
        return new TasksNoGet(this);
    }

    // Should Only be able to get by id, or else error occur
    public get buckets(): IBucketsMethods {
        return new BucketsNoGet(this);
    }
}

export class Plans extends GraphQueryableCollection {

    constructor(baseUrl: string | GraphQueryable, path = "plans") {
        super(baseUrl, path);
    }
}

export class PlansNoGet extends Plans implements IPlansMethods {

    constructor(baseUrl: string | GraphQueryable, path = "plans") {
        super(baseUrl, path);
    }

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

export class Plan extends GraphQueryableInstance {

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
    public update(properties: TypedHash<string | number | boolean | string[]>): Promise<void> {

        return this.patchCore({
            body: jsS(properties),
        });
    }
}

export class Tasks extends GraphQueryableCollection {
    constructor(baseUrl: string | GraphQueryable, path = "tasks") {
        super(baseUrl, path);
    }
}

export class TasksNoGet extends Tasks implements ITasksMethods {
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

export class Task extends GraphQueryableInstance {
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
    public update(properties: TypedHash<string | number | boolean | string[]>): Promise<void> {

        return this.patchCore({
            body: jsS(properties),
        });
    }

    public get details(): Details {
        return new Details(this);
    }
}

export class Buckets extends GraphQueryableCollection {
    constructor(baseUrl: string | GraphQueryable, path = "buckets") {
        super(baseUrl, path);
    }
}

export class BucketsNoGet extends Buckets implements IBucketsMethods {

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

export class Bucket extends GraphQueryableInstance {
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
    public update(properties: TypedHash<string | number | boolean | string[]>): Promise<void> {

        return this.patchCore({
            body: jsS(properties),
        });
    }

    public get tasks(): Tasks {
        return new Tasks(this);
    }
}

export class Details extends GraphQueryableCollection {
    constructor(baseUrl: string | GraphQueryable, path = "details") {
        super(baseUrl, path);
    }

    /**
     * Update the Details of a Task
     * 
     * @param properties Set of properties of this Details to update
     */
    public update(properties: TypedHash<string | number | boolean | string[]>): Promise<void> {

        return this.patchCore({
            body: jsS(properties),
        });
    }
}

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
