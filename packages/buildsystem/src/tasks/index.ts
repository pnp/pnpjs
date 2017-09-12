import { BuildContext } from "../buildcontext";

export type TaskFunction = (ctx: BuildContext) => Promise<void>;

export * from "./build-project";
export * from "./copy-assets";
export * from "./copy-package-file";
export * from "./install-npm-dependencies";
export * from "./replace-debug";
export * from "./replace-sp-http-version";
