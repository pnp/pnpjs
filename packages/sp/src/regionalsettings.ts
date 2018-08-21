import {
    SharePointQueryableInstance,
    SharePointQueryableCollection,
    defaultPath,
} from "./sharepointqueryable";

import {
    spODataEntity,
} from "./odata";

import {
    dateAdd, hOP,
} from "@pnp/common";

/**
 * Describes regional settings ODada object
 */
@defaultPath("regionalsettings")
export class RegionalSettings extends SharePointQueryableInstance {
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
@defaultPath("installedlanguages")
export class InstalledLanguages extends SharePointQueryableCollection {}

/**
 * Describes TimeZone ODada object
 */
@defaultPath("timezone")
export class TimeZone extends SharePointQueryableInstance {
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
            .then(res => hOP(res, "UTCToLocalTime") ? res.UTCToLocalTime : res);
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
            dateIsoString = dateAdd(localTime, "minute", localTime.getTimezoneOffset() * -1).toISOString();
        }

        return this.clone(TimeZone, `localtimetoutc('${dateIsoString}')`)
            .postCore()
            .then(res => hOP(res, "LocalTimeToUTC") ? res.LocalTimeToUTC : res);
    }
}

/**
 * Describes time zones queriable collection
 */
@defaultPath("timezones")
export class TimeZones extends SharePointQueryableCollection {
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
