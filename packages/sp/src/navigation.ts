import { Util } from "../utils/util";
import { TypedHash } from "../collections/collections";
import { SharePointQueryable, SharePointQueryableInstance, SharePointQueryableCollection } from "./sharepointqueryable";

/**
 * Result from adding a navigation node
 *
 */
export interface NavigationNodeAddResult {
    data: any;
    node: NavigationNode;
}

/**
 * Result from udpdating a navigation node
 *
 */
export interface NavigationNodeUpdateResult {
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

        const postBody = JSON.stringify({
            IsVisible: visible,
            Title: title,
            Url: url,
            "__metadata": { "type": "SP.NavigationNode" },
        });

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

        const postBody = JSON.stringify({
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
     * Updates this node based on the supplied properties
     *
     * @param properties The hash of key/value pairs to update
     */
    public update(properties: TypedHash<boolean | string | number>): Promise<NavigationNodeUpdateResult> {

        const postBody = JSON.stringify(Util.extend({
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

    /**
     * Deletes this node and any child nodes
     */
    public delete(): Promise<void> {
        return super.deleteCore();
    }
}


/**
 * Exposes the navigation components
 *
 */
export class Navigation extends SharePointQueryable {

    /**
     * Creates a new instance of the Navigation class
     *
     * @param baseUrl The url or SharePointQueryable which forms the parent of these navigation components
     */
    constructor(baseUrl: string | SharePointQueryable, path = "navigation") {
        super(baseUrl, path);
    }

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

