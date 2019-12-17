import { SharePointQueryable, SharePointQueryableInstance, SharePointQueryableCollection, defaultPath } from "./sharepointqueryable";
import { MenuNodeCollection } from "./types";
import { jsS, extend, TypedHash } from "@pnp/common";
import { metadata } from "./utils/metadata";

/**
 * Result from adding a navigation node
 *
 */
export interface NavigationNodeAddResult {
    data: any;
    node: NavigationNode;
}

/**
 * Represents a collection of navigation nodes
 *
 */
export class NavigationNodes extends SharePointQueryableCollection {

    /**	    
     * Gets a navigation node by id	
     *	
     * @param id The id of the node	
     */
    public getById(id: number): NavigationNode {
        const node = new NavigationNode(this);
        node.concat(`(${id})`);
        return node;
    }

    /**
     * Adds a new node to the collection
     *
     * @param title Display name of the node
     * @param url The url of the node
     * @param visible If true the node is visible, otherwise it is hidden (default: true)
     */
    public add(title: string, url: string, visible = true): Promise<NavigationNodeAddResult> {

        const postBody = jsS(extend(metadata("SP.NavigationNode"), {
            IsVisible: visible,
            Title: title,
            Url: url,
        }));

        return this.clone(NavigationNodes, null).postCore({ body: postBody }).then((data) => {
            return {
                data: data,
                node: this.getById(data.Id),
            };
        });
    }

    /**
     * Moves a node to be after another node in the navigation
     *
     * @param nodeId Id of the node to move
     * @param previousNodeId Id of the node after which we move the node specified by nodeId
     */
    public moveAfter(nodeId: number, previousNodeId: number): Promise<void> {

        const postBody = jsS({
            nodeId: nodeId,
            previousNodeId: previousNodeId,
        });

        return this.clone(NavigationNodes, "MoveAfter").postCore({ body: postBody });
    }
}

/**
 * Represents an instance of a navigation node
 *
 */
export class NavigationNode extends SharePointQueryableInstance {

    /**
     * Represents the child nodes of this node
     */
    public get children(): NavigationNodes {
        return new NavigationNodes(this, "Children");
    }

    /**
     * Deletes this node and any child nodes
     */
    public delete(): Promise<void> {
        return super.deleteCore();
    }

    /**
     * Updates this node
     * 
     * @param properties Properties used to update this node
     */
    public update(properties: TypedHash<string | number | boolean>): Promise<NavNodeUpdateResult> {

        const postBody = jsS(extend({
            "__metadata": { "type": "SP.NavigationNode" },
        }, properties));

        return this.postCore({
            body: postBody,
            headers: {
                "X-HTTP-Method": "MERGE",
            },
        }).then((data) => {
            return {
                data: data,
                node: this,
            };
        });
    }
}

export interface NavNodeUpdateResult {
    data: any;
    node: NavigationNode;
}

/**
 * Exposes the navigation components
 *
 */
@defaultPath("navigation")
export class Navigation extends SharePointQueryable {

    /**
     * Gets the quicklaunch navigation nodes for the current context
     *
     */
    public get quicklaunch(): NavigationNodes {
        return new NavigationNodes(this, "quicklaunch");
    }

    /**
     * Gets the top bar navigation nodes for the current context
     *
     */
    public get topNavigationBar(): NavigationNodes {
        return new NavigationNodes(this, "topnavigationbar");
    }
}

export interface INavigationService {
    getMenuState(menuNodeKey?: string, depth?: number, mapProviderName?: string, customProperties?: string): Promise<MenuNodeCollection>;
    getMenuNodeKey(currentUrl: string, mapProviderName?: string): Promise<string>;
}

/**
 * Represents the top level navigation service
 */
export class NavigationService extends SharePointQueryable implements INavigationService {

    constructor(baseUrl: string | SharePointQueryable, path: string = null) {
        super(baseUrl, path);
    }

    /**
     * The MenuState service operation returns a Menu-State (dump) of a SiteMapProvider on a site.
     * 
     * @param menuNodeKey MenuNode.Key of the start node within the SiteMapProvider If no key is provided the SiteMapProvider.RootNode will be the root of the menu state.
     * @param depth Depth of the dump. If no value is provided a dump with the depth of 10 is returned
     * @param mapProviderName The name identifying the SiteMapProvider to be used
     * @param customProperties comma seperated list of custom properties to be returned.
     */
    public getMenuState(menuNodeKey: string = null, depth = 10, mapProviderName: string = null, customProperties: string = null): Promise<MenuNodeCollection> {

        return (new NavigationService(this, "_api/navigation/MenuState")).postCore({
            body: jsS({
                customProperties: customProperties,
                depth: depth,
                mapProviderName: mapProviderName,
                menuNodeKey: menuNodeKey,
            }),
        });
    }

    /**
     * Tries to get a SiteMapNode.Key for a given URL within a site collection.
     * 
     * @param currentUrl A url representing the SiteMapNode
     * @param mapProviderName The name identifying the SiteMapProvider to be used
     */
    public getMenuNodeKey(currentUrl: string, mapProviderName: string = null): Promise<string> {

        return (new NavigationService(this, "_api/navigation/MenuNodeKey")).postCore({
            body: jsS({
                currentUrl: currentUrl,
                mapProviderName: mapProviderName,
            }),
        });
    }
}
