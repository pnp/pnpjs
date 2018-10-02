export * from "./builder";
export * from "./packager";
export * from "./publisher";
import * as _Tasks from "./tasks";
export const Tasks = _Tasks;

// we need to hoist these so they are exported as interfaces at the top level
export {
    BuildContext,
    BuildSchema,
    BuildFunction,
    BuildPackageFunction,
    BuildInfo,
} from "./tasks/build";

export {
    PackageContext,
    PackageInfo,
    PackageSchema,
    PackageTaskFunction,
} from "./tasks/package";

export {
    PublishContext,
    PublishInfo,
    PublishSchema,
    PublishTaskFunction,
} from "./tasks/publish";
