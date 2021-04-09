import { addProp } from "@pnp/queryable";
import { _Group } from "../groups/types.js";
import { IPlans, Plans } from "./types.js";

declare module "../groups/types" {
    interface _Group {
        readonly plans: IPlans;
    }
    interface IGroup {
        readonly plans: IPlans;
    }
}

addProp(_Group, "plans", Plans, "planner/plans");
