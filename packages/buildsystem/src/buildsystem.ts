export * from "./builder";
export * from "./packager";
import * as _Tasks from "./tasks";
export const Tasks = _Tasks;

// we need to hoist these so they are exported as interfaces
export {
    BuildContext,
    BuildSchema,
    BuildTaskFunction,
    BuildInfo,
} from "./tasks/build";

export {
    PackageContext,
    PackageInfo,
    PackageSchema,
    PackageTaskFunction,
} from "./tasks/package";
