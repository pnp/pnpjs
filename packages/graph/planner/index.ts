import { GraphRest } from "../rest";
import { IPlanner, Planner } from "./types";

import "./groups";
import "./users";

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
    Plan,
    Planner,
    Plans,
    Task,
    Tasks,
} from "./types";

declare module "../rest" {
    interface GraphRest {
        readonly planner: IPlanner;
    }
}

Reflect.defineProperty(GraphRest.prototype, "planner", {
    configurable: true,
    enumerable: true,
    get: function (this: GraphRest) {
        return Planner(this);
    },
});
