import { IGraphQueryable } from "../graphqueryable";
import { IRange, Range } from "./types";

/**
 * Adds the getRange method to the tagged class
 */
export function getRange() {
    // eslint-disable-next-line @typescript-eslint/ban-types
    return function <T extends { new(...args: any[]): {} }>(target: T) {

        return class extends target {
            public getRange(this: IGraphQueryable): IRange {
                return Range(this, "range");
            }
        };
    };
}

export interface IGetRange {
    /**
     * Get the range of cells contained by this element.
     */
    getRange(): IRange;
}