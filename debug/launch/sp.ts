import { ITestingSettings } from "../../test/load-settings.js";
import { Logger, LogLevel } from "@pnp/logging";
import { spSetup } from "./setup.js";
import "@pnp/sp/webs";
import { Queryable } from "@pnp/queryable/queryable.js";

declare var process: { exit(code?: number): void };


interface GetTokenInternalParams {
  siteUrl: string;
  clientId: string;
  clientSecret: string;
  refreshToken: string;
  realm: string;
  stsUri: string;
}

export const SharePointServicePrincipal = "00000003-0000-0ff1-ce00-000000000000";

export function ACSAuth(): (instance: Queryable) => Queryable {

  return (instance: Queryable) => {

    instance.on.auth.replace(async (url: URL, init: RequestInit) => {


  //     var addin_creds = await axios.post(`https://accounts.accesscontrol.windows.net/${creds.tennant.id}/tokens/OAuth/2`, qs.stringify({
  //   grant_type:       'client_credentials',
  //   client_id:        `${creds.clientid}@${creds.tennant.id}`,
  //   client_secret:    `${creds.secret}`,
  //   resource:         `00000003-0000-0ff1-ce00-000000000000/${creds.tennant.name}.sharepoint.com@${creds.tennant.id}`
  // }), {
  //   'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
  // })



      // async function getTokenInternal(params: GetTokenInternalParams): Promise<AuthToken> {

        //     let accessToken = tokenCache.getAccessToken(params.realm, params.cacheKey);
        //     if (accessToken && new Date() < toDate(accessToken.expires_on)) {
        //         return accessToken;
        //     }

        //     const resource = getFormattedPrincipal(SharePointServicePrincipal, u.parse(params.siteUrl).hostname, params.realm);
        //     const formattedClientId = getFormattedPrincipal(params.clientId, "", params.realm);

        //     const body: string[] = [];
        //     if (params.refreshToken) {
        //         body.push("grant_type=refresh_token");
        //         body.push(`refresh_token=${encodeURIComponent(params.refreshToken)}`);
        //     } else {
        //         body.push("grant_type=client_credentials");
        //     }
        //     body.push(`client_id=${formattedClientId}`);
        //     body.push(`client_secret=${encodeURIComponent(params.clientSecret)}`);
        //     body.push(`resource=${resource}`);

        //     const r = await fetch(params.stsUri, {
        //         body: body.join("&"),
        //         headers: {
        //             "Content-Type": "application/x-www-form-urlencoded",
        //         },
        //         method: "POST",
        //     });

        //     accessToken = await r.json();
        //     tokenCache.setAccessToken(params.realm, params.cacheKey, accessToken);
        //     return accessToken;
        // }

        // function getFormattedPrincipal(principalName: string, hostName: string, realm: string): string {
        //     let resource = principalName;
        //     if (hostName !== null && hostName !== "") {
        //         resource += "/" + hostName;
        //     }
        //     resource += "@" + realm;
        //     return resource;
        // }




        init.headers = { ...init.headers, Authorization: `Bearer ${accessToken}` };

        return [url, init];
      });

    return instance;
  };
}



export async function Example(settings: ITestingSettings) {

  const sp = spSetup(settings).using(ACSAuth());

  const w = await sp.web();

  Logger.log({
    data: w,
    level: LogLevel.Info,
    message: "List of Web Data",
  });

  process.exit(0);
}
