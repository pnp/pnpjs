import { ITestingSettings } from "../../test/load-settings.js";
import { Logger, LogLevel } from "@pnp/logging";
import { spSetup } from "./setup.js";
import { spfi } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/search";
import { CacheKey, Caching } from "@pnp/queryable";

declare var process: { exit(code?: number): void };

export async function Example(settings: ITestingSettings) {

  const sp = spSetup(settings);

  const w = await spfi(sp).using(Caching({
    store: "local",
    expireFunc: (url) => Config.CacheTimers.DEFAULT,
  }),
    CacheKey(`myCacheKey ${getHashCode(query)}`)).search(({
      QueryTemplate: ${ query } AND(NOT IsAudienceTargeted: true OR ModernAudienceAadObjectIds: { User.Audiences }),
  });

Logger.log({
  data: w,
  level: LogLevel.Info,
  message: "Web Data",
});

process.exit(0);
}
