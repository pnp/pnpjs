import { hOP, objectDefinedNotNull, jsS } from "@pnp/common";

/**
 * Converts a json object to an escaped string appropriate for use in attributes when storing client-side controls
 * 
 * @param json The json object to encode into a string
 */
export function jsonToEscapedString(json: any): string {

    return jsS(json)
        .replace(/"/g, "&quot;")
        .replace(/:/g, "&#58;")
        .replace(/{/g, "&#123;")
        .replace(/}/g, "&#125;")
        .replace(/\[/g, "\[")
        .replace(/\]/g, "\]")
        .replace(/\*/g, "\*")
        .replace(/\$/g, "\$")
        .replace(/\./g, "\.");
}

/**
 * Converts an escaped string from a client-side control attribute to a json object
 * 
 * @param escapedString 
 */
export function escapedStringToJson<T = any>(escapedString: string): T {
    const unespace = (escaped: string): string => {
        return [
            [/&quot;/g, "\""],
            [/&#58;/g, ":"],
            [/&#123;/g, "{"],
            [/&#125;/g, "}"],
            [/\\\\/g, "\\"],
            [/\\\?/g, "?"],
            [/\\\./g, "."],
            [/\\\[/g, "["],
            [/\\\]/g, "]"],
            [/\\\(/g, "("],
            [/\\\)/g, ")"],
            [/\\\|/g, "|"],
            [/\\\+/g, "+"],
            [/\\\*/g, "*"],
            [/\\\$/g, "$"],
        ].reduce((r, m) => r.replace(m[0], m[1] as string), escaped);
    };

    return objectDefinedNotNull(escapedString) ? JSON.parse(unespace(escapedString)) : null;
}

/**
 * Gets the next order value 1 based for the provided collection
 * 
 * @param collection Collection of orderable things
 */
export function getNextOrder(collection: { order: number }[]): number {

    if (collection.length < 1) {
        return 1;
    }

    return Math.max.apply(null, collection.map(i => i.order)) + 1;
}

/**
 * Finds bounded blocks of markup bounded by divs, ensuring to match the ending div even with nested divs in the interstitial markup
 * 
 * @param html HTML to search
 * @param boundaryStartPattern The starting pattern to find, typically a div with attribute
 * @param collector A func to take the found block and provide a way to form it into a useful return that is added into the return array
 */
export function getBoundedDivMarkup<T>(html: string, boundaryStartPattern: RegExp | string, collector: (s: string) => T): T[] {

    const blocks: T[] = [];

    if (html === undefined || html === null) {
        return blocks;
    }

    // remove some extra whitespace if present
    const cleanedHtml = html.replace(/[\t\r\n]/g, "");

    // find the first div
    let startIndex = regexIndexOf.call(cleanedHtml, boundaryStartPattern);

    if (startIndex < 0) {
        // we found no blocks in the supplied html
        return blocks;
    }

    // this loop finds each of the blocks
    while (startIndex > -1) {

        // we have one open div counting from the one found above using boundaryStartPattern so we need to ensure we find it's close
        let openCounter = 1;
        let searchIndex = startIndex + 1;
        let nextDivOpen = -1;
        let nextCloseDiv = -1;

        // this loop finds the </div> tag that matches the opening of the control
        while (true) {

            // find both the next opening and closing div tags from our current searching index
            nextDivOpen = regexIndexOf.call(cleanedHtml, /<div[^>]*>/i, searchIndex);
            nextCloseDiv = regexIndexOf.call(cleanedHtml, /<\/div>/i, searchIndex);

            if (nextDivOpen < 0) {
                // we have no more opening divs, just set this to simplify checks below
                nextDivOpen = cleanedHtml.length + 1;
            }

            // determine which we found first, then increment or decrement our counter
            // and set the location to begin searching again
            if (nextDivOpen < nextCloseDiv) {
                openCounter++;
                searchIndex = nextDivOpen + 1;
            } else if (nextCloseDiv < nextDivOpen) {
                openCounter--;
                searchIndex = nextCloseDiv + 1;
            }

            // once we have no open divs back to the level of the opening control div
            // meaning we have all of the markup we intended to find
            if (openCounter === 0) {

                // get the bounded markup, +6 is the size of the ending </div> tag
                const markup = cleanedHtml.substring(startIndex, nextCloseDiv + 6).trim();

                // save the control data we found to the array
                blocks.push(collector(markup));

                // get out of our while loop
                break;
            }

            if (openCounter > 1000 || openCounter < 0) {
                // this is an arbitrary cut-off but likely we will not have 1000 nested divs
                // something has gone wrong above and we are probably stuck in our while loop
                // let's get out of our while loop and not hang everything
                throw Error("getBoundedDivMarkup exceeded depth parameters.");
            }
        }

        // get the start of the next control
        startIndex = regexIndexOf.call(cleanedHtml, boundaryStartPattern, nextCloseDiv);
    }

    return blocks;
}

/**
 * Normalizes the order value for all the sections, columns, and controls to be 1 based and stepped (1, 2, 3...)
 * 
 * @param collection The collection to normalize
 */
export function reindex(collection: { order: number, columns?: { order: number }[], controls?: { order: number }[] }[]): void {

    for (let i = 0; i < collection.length; i++) {
        collection[i].order = i + 1;
        if (hOP(collection[i], "columns")) {
            reindex(collection[i].columns);
        } else if (hOP(collection[i], "controls")) {
            reindex(collection[i].controls);
        }
    }
}

/**
 * After https://stackoverflow.com/questions/273789/is-there-a-version-of-javascripts-string-indexof-that-allows-for-regular-expr/274094#274094
 * 
 * @param this Types the called context this to a string in which the search will be conducted
 * @param regex A regex or string to match
 * @param startpos A starting position from which the search will begin
 */
function regexIndexOf(this: string, regex: RegExp | string, startpos = 0) {
    const indexOf = this.substring(startpos).search(regex);
    return (indexOf >= 0) ? (indexOf + (startpos)) : indexOf;
}
