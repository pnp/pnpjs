import { GraphRest } from "../rest.js";
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

declare module "../rest" {
    interface GraphRest {
        readonly planner: IPlanner;
    }
}

Reflect.defineProperty(GraphRest.prototype, "planner", {
    configurable: true,
    enumerable: true,
    get: function (this: GraphRest) {
        return this.childConfigHook(({ options, baseUrl, runtime }) => {
            return Planner(baseUrl).configure(options).setRuntime(runtime);
        });
    },
});
