export * from "./builder";
export * from "./packager";
export * from "./publisher";
import * as _Tasks from "./tasks";
export const Tasks = _Tasks;

// we need to hoist these so they are exported as interfaces at the top level
export {
    BuildSchema,
    BuildFunction,
    BuildTask,
    BuildTaskScoped,
} from "./tasks/build";

export {
    PackageFunction,
    PackageTask,
    PackageSchema,
    PackageTaskScoped,
} from "./tasks/package";

export {
    PublishFunction,
    PublishSchema,
    PublishTask,
    PublishTaskScoped,
} from "./tasks/publish";
