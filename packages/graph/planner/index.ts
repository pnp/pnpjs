import { GraphFI } from "../fi.js";
import { IPlanner, Planner } from "./types.js";

import "./groups.js";
import "./users.js";

export {
    Bucket,
    Buckets,
    IBucket,
    IBucketAddResult,
    IBuckets,
    IPlan,
    IPlanAddResult,
    IPlanner,
    IPlans,
    ITask,
    ITaskAddResult,
    ITasks,
    ITaskDetails,
    Plan,
    Planner,
    Plans,
    Task,
    Tasks,
    TaskDetails,
    PlanDetails,
} from "./types.js";

declare module "../fi" {
    interface GraphFI {
        readonly planner: IPlanner;
    }
}

Reflect.defineProperty(GraphFI.prototype, "planner", {
    configurable: true,
    enumerable: true,
    get: function (this: GraphFI) {
        return this.create(Planner);
    },
});
