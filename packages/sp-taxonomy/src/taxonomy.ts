import { Session, ITaxonomySession } from "./session";

// export an existing session instance
export const taxonomy: ITaxonomySession = new Session();

export * from "./labels";
export * from "./session";
export * from "./termgroup";
export * from "./terms";
export * from "./termsets";
export * from "./termstores";
export * from "./types";
export * from "./utilities";
