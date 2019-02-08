import { GraphQueryableInstance, GraphQueryableCollection, defaultPath } from "./graphqueryable";
import { OfficeGraphInsights as IInsights, Trending as ITrending, UsedInsight as IUsed, SharedInsight as IShared } from "@microsoft/microsoft-graph-types";

export interface InsightsMethods {
    trending: Trending;
    used: Used;
    shared: Shared;
}

/**
 * Represents a Insights entity
 */
@defaultPath("insights")
export class Insights extends GraphQueryableInstance<IInsights> implements InsightsMethods {

    public get trending(): Trending {
        return new Trending(this);
    }

    public get used(): Used {
        return new Used(this);
    }

    public get shared(): Shared {
        return new Shared(this);
    }
}

/**
 * Describes a collection of Trending objects
 *
 */
@defaultPath("trending")
export class Trending extends GraphQueryableCollection<ITrending[]> { }

/**
 * Describes a collection of Used objects
 *
 */
@defaultPath("used")
export class Used extends GraphQueryableCollection<IUsed[]> { }

/**
 * Describes a collection of Shared objects
 *
 */
@defaultPath("shared")
export class Shared extends GraphQueryableCollection<IShared[]> { }
