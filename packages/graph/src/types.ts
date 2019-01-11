export class GraphEndpoints {

    public static Beta = "beta";
    public static V1 = "v1.0";

    /**
     * 
     * @param url The url to set the endpoint 
     */
    public static ensure(url: string, endpoint: string): string {
        const all = [GraphEndpoints.Beta, GraphEndpoints.V1];
        let regex = new RegExp(endpoint, "i");
        const replaces = all.filter(s => !regex.test(s)).map(s => s.replace(".", "\\."));
        regex = new RegExp(`/?(${replaces.join("|")})/`, "ig");
        return url.replace(regex, `/${endpoint}/`);
    }
}

/**
 * Defines the properties for a Team
 * 
 * TODO:: remove this once typings are present in graph types package
 */
export interface TeamProperties {

    memberSettings?: {
        "allowCreateUpdateChannels"?: boolean;
        "allowDeleteChannels"?: boolean;
        "allowAddRemoveApps"?: boolean;
        "allowCreateUpdateRemoveTabs"?: boolean;
        "allowCreateUpdateRemoveConnectors"?: boolean;
    };

    guestSettings?: {
        "allowCreateUpdateChannels"?: boolean;
        "allowDeleteChannels"?: boolean;
    };

    messagingSettings?: {
        "allowUserEditMessages"?: boolean;
        "allowUserDeleteMessages"?: boolean;
        "allowOwnerDeleteMessages"?: boolean;
        "allowTeamMentions"?: boolean;
        "allowChannelMentions"?: boolean;
    };

    funSettings?: {
        "allowGiphy"?: boolean;
        "giphyContentRating"?: "strict" | string,
        "allowStickersAndMemes"?: boolean;
        "allowCustomMemes"?: boolean;
    };
}

export interface TabsConfiguration {

    configuration: {
        "entityId": string;
        "contentUrl": string;
        "websiteUrl": string;
        "removeUrl": string;

    };
}
