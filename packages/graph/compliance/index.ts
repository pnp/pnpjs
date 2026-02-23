import { GraphFI } from "../fi.js";
import { Compliance, ICompliance} from "./types.js";

export {
    Compliance,
    ICompliance,
    Notes,
    INotes,
    SubjectRightsRequests,
    ISubjectRightsRequests,
    SubjectRightsRequest,
    ISubjectRightsRequest,
} from "./types.js";

declare module "../fi" {
    interface GraphFI {
        readonly compliance: ICompliance;
    }
}

Reflect.defineProperty(GraphFI.prototype, "compliance", {
    configurable: true,
    enumerable: true,
    get: function (this: GraphFI) {
        return this.create(Compliance);
    },
});
