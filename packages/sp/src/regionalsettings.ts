import {
    SharePointQueryable,
    SharePointQueryableInstance,
    SharePointQueryableCollection,
} from "./sharepointqueryable";

import {
    spODataEntity,
} from "./odata";

import {
    Util,
} from "@pnp/common";

/**
 * Describes regional settings ODada object
 */
export class RegionalSettings extends SharePointQueryableInstance {

    /**
     * Creates a new instance of the RegionalSettings class
     *
     * @param baseUrl The url or SharePointQueryable which forms the parent of this regional settings collection
     */

    constructor(baseUrl: string | SharePointQueryable, path = "regionalsettings") {
        super(baseUrl, path);
    }

    /**
     * Gets the collection of languages used in a server farm.
     */
    public get installedLanguages(): InstalledLanguages {
        return new InstalledLanguages(this);
    }

    /**
     * Gets the collection of language packs that are installed on the server.
     */
    public get globalInstalledLanguages(): InstalledLanguages {
        return new InstalledLanguages(this, "globalinstalledlanguages");
    }

    /**
     * Gets time zone
     */
    public get timeZone(): TimeZone {
        return new TimeZone(this);
    }

    /**
     * Gets time zones
     */
    public get timeZones(): TimeZones {
        return new TimeZones(this);
    }
}

/**
 * Describes installed languages ODada queriable collection
 */
export class InstalledLanguages extends SharePointQueryableCollection {
    constructor(baseUrl: string | SharePointQueryable, path = "installedlanguages") {
        super(baseUrl, path);
    }
}

/**
 * Describes TimeZone ODada object
 */
export class TimeZone extends SharePointQueryableInstance {
    constructor(baseUrl: string | SharePointQueryable, path = "timezone") {
        super(baseUrl, path);
    }

    /**
     * Gets an Local Time by UTC Time
     *
     * @param utcTime UTC Time as Date or ISO String
     */
    public utcToLocalTime(utcTime: string | Date): Promise<string> {
        let dateIsoString: string;
        if (typeof utcTime === "string") {
            dateIsoString = utcTime;
        } else {
            dateIsoString = utcTime.toISOString();
        }

        return this.clone(TimeZone, `utctolocaltime('${dateIsoString}')`)
            .postCore()
            .then(res => res.hasOwnProperty("UTCToLocalTime") ? res.UTCToLocalTime : res);
    }

    /**
     * Gets an UTC Time by Local Time
     *
     * @param localTime Local Time as Date or ISO String
     */
    public localTimeToUTC(localTime: string | Date): Promise<string> {
        let dateIsoString: string;

        if (typeof localTime === "string") {
            dateIsoString = localTime;
        } else {
            dateIsoString = Util.dateAdd(localTime, "minute", localTime.getTimezoneOffset() * -1).toISOString();
        }

        return this.clone(TimeZone, `localtimetoutc('${dateIsoString}')`)
            .postCore()
            .then(res => res.hasOwnProperty("LocalTimeToUTC") ? res.LocalTimeToUTC : res);
    }
}

/**
 * Describes time zones queriable collection
 */
export class TimeZones extends SharePointQueryableCollection {
    constructor(baseUrl: string | SharePointQueryable, path = "timezones") {
        super(baseUrl, path);
    }

    // https://msdn.microsoft.com/en-us/library/office/jj247008.aspx - timezones ids
    /**
     * Gets an TimeZone by id
     *
     * @param id The integer id of the timezone to retrieve
     */
    public getById(id: number): Promise<TimeZone> {
        // do the post and merge the result into a TimeZone instance so the data and methods are available
        return this.clone(TimeZones, `GetById(${id})`).postCore({}, spODataEntity(TimeZone));
    }
}
