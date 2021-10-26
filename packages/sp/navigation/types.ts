import {
    _SPCollection,
    spInvokableFactory,
    deleteable,
    _SPInstance,
    _SPQueryable,
    IDeleteable,
    ISPQueryable,
} from "../spqueryable.js";
import { body } from "@pnp/queryable";
import { defaultPath } from "../decorators.js";
import { spPost, spPostMerge } from "../operations.js";
import { extractWebUrl } from "../index.js";
import { combine } from "@pnp/core";

/**
 * Represents a collection of navigation nodes
 *
 */
export class _NavigationNodes extends _SPCollection<INavNodeInfo[]> {

    /**
     * Gets a navigation node by id
     *
     * @param id The id of the node
     */
    public getById(id: number): INavigationNode {
        return NavigationNode(this).concat(`(${id})`);
    }

    /**
     * Adds a new node to the collection
     *
     * @param title Display name of the node
     * @param url The url of the node
     * @param visible If true the node is visible, otherwise it is hidden (default: true)
     */
    public async add(title: string, url: string, visible = true): Promise<INavigationNodeAddResult> {

        const postBody = body({
            IsVisible: visible,
            Title: title,
            Url: url,
        });

        const data = await spPost(NavigationNodes(this, null), postBody);

        return {
            data,
            node: this.getById(data.Id),
        };
    }

    /**
     * Moves a node to be after another node in the navigation
     *
     * @param nodeId Id of the node to move
     * @param previousNodeId Id of the node after which we move the node specified by nodeId
     */
    public moveAfter(nodeId: number, previousNodeId: number): Promise<void> {

        const postBody = body({
            nodeId: nodeId,
            previousNodeId: previousNodeId,
        });

        return spPost(NavigationNodes(this, "MoveAfter"), postBody);
    }
}
export interface INavigationNodes extends _NavigationNodes {}
export const NavigationNodes = spInvokableFactory<INavigationNodes>(_NavigationNodes);


/**
 * Represents an instance of a navigation node
 *
 */
export class _NavigationNode extends _SPInstance<INavNodeInfo> {

    public delete = deleteable();

    /**
     * Represents the child nodes of this node
     */
    public get children(): INavigationNodes {
        return NavigationNodes(this, "children");
    }

    /**
     * Updates this node
     *
     * @param properties Properties used to update this node
     */
    public async update(properties: Partial<INavNodeInfo>): Promise<INavNodeUpdateResult> {

        const data = await spPostMerge(this, body(properties));

        return {
            data,
            node: <any>this,
        };
    }
}
export interface INavigationNode extends _NavigationNode, IDeleteable { }
export const NavigationNode = spInvokableFactory<INavigationNode>(_NavigationNode);

export interface INavNodeUpdateResult {
    data: any;
    node: INavigationNode;
}

/**
 * Exposes the navigation components
 *
 */
@defaultPath("navigation")
export class _Navigation extends _SPQueryable {

    /**
     * Gets the quicklaunch navigation nodes for the current context
     *
     */
    public get quicklaunch(): INavigationNodes {
        return NavigationNodes(this, "quicklaunch");
    }

    /**
     * Gets the top bar navigation nodes for the current context
     *
     */
    public get topNavigationBar(): INavigationNodes {
        return NavigationNodes(this, "topnavigationbar");
    }
}
export interface INavigation {
    readonly quicklaunch: INavigationNodes;
    readonly topNavigationBar: INavigationNodes;
}
export const Navigation: INavigation = <any>spInvokableFactory(_Navigation);

/**
 * Represents the top level navigation service
 */
export class _NavigationService extends _SPQueryable {

    constructor(base: string | ISPQueryable = null, path?: string) {
        super(base, path);

        this._url = combine(extractWebUrl(this._url), "_api/navigation", path);
    }

    /**
     * The MenuState service operation returns a Menu-State (dump) of a SiteMapProvider on a site.
     *
     * @param menuNodeKey MenuNode.Key of the start node within the SiteMapProvider If no key is provided the SiteMapProvider.RootNode will be the root of the menu state.
     * @param depth Depth of the dump. If no value is provided a dump with the depth of 10 is returned
     * @param mapProviderName The name identifying the SiteMapProvider to be used
     * @param customProperties comma seperated list of custom properties to be returned.
     */
    public getMenuState(menuNodeKey: string = null, depth = 10, mapProviderName: string = null, customProperties: string = null): Promise<IMenuNodeCollection> {

        return spPost(NavigationService(this, "MenuState"), body({
            customProperties,
            depth,
            mapProviderName,
            menuNodeKey,
        }));
    }

    /**
     * Tries to get a SiteMapNode.Key for a given URL within a site collection.
     *
     * @param currentUrl A url representing the SiteMapNode
     * @param mapProviderName The name identifying the SiteMapProvider to be used
     */
    public getMenuNodeKey(currentUrl: string, mapProviderName: string = null): Promise<string> {

        return spPost(NavigationService(this, "MenuNodeKey"), body({
            currentUrl,
            mapProviderName,
        }));
    }
}
export interface INavigationService extends _NavigationService {}
export const NavigationService = (base?: string | ISPQueryable, path?: string) => <INavigationService>new _NavigationService(base, path);

export interface IMenuNode {
    CustomProperties: any[];
    FriendlyUrlSegment: string;
    IsDeleted: boolean;
    IsHidden: boolean;
    Key: string;
    Nodes: IMenuNode[];
    NodeType: number;
    SimpleUrl: string;
    Title: string;
}

export interface IMenuNodeCollection {
    FriendlyUrlPrefix: string;
    Nodes: IMenuNode[];
    SimpleUrl: string;
    SPSitePrefix: string;
    SPWebPrefix: string;
    StartingNodeKey: string;
    StartingNodeTitle: string;
    Version: Date;
}

export interface ISerializableNavigationNode {
    Id: number;
    Title: string;
    Url: string;
    IsDocLib: boolean;
    IsExternal: boolean;
    ParentId: number;
    ListTemplateType: number;
    AudienceIds: string[];
    Children: ISerializableNavigationNode[];
}

/**
 * Result from adding a navigation node
 *
 */
export interface INavigationNodeAddResult {
    data: INavNodeInfo;
    node: INavigationNode;
}

/**
 * Represents the information describing a navigation node
 */
export interface INavNodeInfo {
    AudienceIds: string[] | null;
    Id: number;
    IsDocLib: boolean;
    IsExternal: boolean;
    IsVisible: boolean;
    ListTemplateType: number;
    Title: string;
    Url: string;
}
