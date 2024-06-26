import {
    OfficeGraphInsights as IOfficeGraphInsightsType,
    Trending as ITrendingInsightType,
    UsedInsight as IUsedInsightType,
    SharedInsight as ISharedInsightType,
    Entity as IEntityType,
} from "@microsoft/microsoft-graph-types";
import {
    _GraphInstance,
    _GraphCollection,
    graphInvokableFactory,
} from "../graphqueryable.js";
import { defaultPath, getById, IGetById } from "../decorators.js";

/**
 * Represents a insights entity
 */
@defaultPath("insights")
export class _Insights extends _GraphInstance<IOfficeGraphInsightsType> {

    public get trending(): ITrendingInsights {
        return TrendingInsights(this);
    }

    public get used(): IUsedInsights {
        return UsedInsights(this);
    }

    public get shared(): ISharedInsights {
        return SharedInsights(this);
    }
}
export interface IInsights extends _Insights {}
export const Insights = graphInvokableFactory<IInsights>(_Insights);

/**
 * Describes a Trending Insight instance
 */
export class _TrendingInsight extends _GraphInstance<ITrendingInsightType> {
    public get resource(): IResource {
        return Resource(this);
    }
}
export interface ITrendingInsight extends _TrendingInsight { }
export const TrendingInsight = graphInvokableFactory<ITrendingInsight>(_TrendingInsight);

/**
 * Describes a collection of Trending Insight objects
 *
 */
@defaultPath("trending")
@getById(TrendingInsight)
export class _TrendingInsights extends _GraphCollection<ITrendingInsightType[]> {}
export interface ITrendingInsights extends _TrendingInsights, IGetById<ITrendingInsight> {}
export const TrendingInsights = graphInvokableFactory<ITrendingInsights>(_TrendingInsights);

/**
 * Describes a Used Insight instance
 */
export class _UsedInsight extends _GraphInstance<IUsedInsightType> {
    public get resource(): IResource {
        return Resource(this);
    }
}
export interface IUsedInsight extends _UsedInsight { }
export const UsedInsight = graphInvokableFactory<IUsedInsight>(_UsedInsight);

/**
 * Describes a collection of Used Insight objects
 *
 */
@defaultPath("used")
@getById(UsedInsight)
export class _UsedInsights extends _GraphCollection<IUsedInsightType[]> {}
export interface IUsedInsights extends _UsedInsights, IGetById<IUsedInsight> {}
export const UsedInsights = graphInvokableFactory<IUsedInsights>(_UsedInsights);

/**
 * Describes a Shared Insight instance
 */
export class _SharedInsight extends _GraphInstance<ISharedInsightType> {
    public get resource(): IResource {
        return Resource(this);
    }
}
export interface ISharedInsight extends _SharedInsight { }
export const SharedInsight = graphInvokableFactory<ISharedInsight>(_SharedInsight);

/**
 * Describes a collection of Shared Insight objects
 *
 */
@defaultPath("shared")
@getById(SharedInsight)
export class _SharedInsights extends _GraphCollection<ISharedInsightType[]> {}
export interface ISharedInsights extends _SharedInsights, IGetById<ISharedInsight> {}
export const SharedInsights = graphInvokableFactory<ISharedInsights>(_SharedInsights);

/**
 * Describes a Resource Entity instance
 */
@defaultPath("resource")
export class _Resource extends _GraphInstance<IEntityType> {}
export interface IResource extends _Resource { }
export const Resource = graphInvokableFactory<IResource>(_Resource);
