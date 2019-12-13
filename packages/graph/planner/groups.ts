import { addProp } from "@pnp/odata";
import { _Group } from "../groups/types";
import { IPlans, Plans } from "./types";

declare module "../groups/types" {
    interface _Group {
        readonly plans: IPlans;
    }
    interface IGroup {
        readonly plans: IPlans;
    }
}

addProp(_Group, "plans", Plans, "planner/plans");
