import { IChangeToken } from "../types.js";

/**
 * Creates a change token for use with sites, webs, or lists
 *
 * @param resourceType The type of resource for which you want a change token
 * @param resource The identifier (GUID) of the resource site.Id, web.Id, or List.Id
 * @param tokenDate The date for this token (if start token, start date of chages; if end token, end date of the changes)
 * @param versionNumber Version number for token (default = 1)
 * @returns A properly formatted change token
 */
export function createChangeToken(resourceType: "site" | "web" | "list" = "site", resource: string, tokenDate: Date = new Date(), versionNumber = 1): IChangeToken {

    const resourceTypeMapping = new Map([["site", 1], ["web", 2], ["list", 3]]).get(resourceType);

    // The value of the string assigned to ChangeTokenStart.StringValue is semicolon delimited, and takes the following parameters in the order listed:
    // Version number.
    // The change scope (0 - Content Database, 1 - site collection, 2 - site, 3 - list).
    // GUID of the item the scope applies to (for example, GUID of the list).
    // Time (in UTC) from when changes occurred in Ticks (but its .NET ticks so we do this math)
    // Initialize the change item on the ChangeToken using a default value of -1.
    const tokenDateTicks = (tokenDate.getTime() * 10000) + 621355968000000000;
    return { StringValue: `${versionNumber};${resourceTypeMapping};${resource};${tokenDateTicks};-1` };
}
