import { SPFetchClient } from "@pnp/nodejs";
import { Logger, LogLevel } from "@pnp/logging";
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import { MsalClientSetup } from "@pnp/msaljsclient";

declare var process: { exit(code?: number): void };

export async function Example(settings: any) {

  // configure your node options
  // sp.setup({
  //   sp: {
  //     fetchClientFactory: () => {
  //       return new SPFetchClient(settings.testing.sp.url, settings.testing.sp.id, settings.testing.sp.secret);
  //     },
  //   },
  // });


  sp.setup({
    sp: {
      fetchClientFactory: MsalClientSetup({
        auth: {
            authority: "https://login.microsoftonline.com/common",
            clientId: "00000000-0000-0000-0000-000000000000",
            redirectUri: "{your redirect uri}",
        },
        cache: {
            cacheLocation: "sessionStorage",
        },
    }, ["email", "Files.Read.All", "User.Read.All"])
    },
  });

  const w = await sp.web();

  Logger.log({
    data: w,
    level: LogLevel.Info,
    message: "List of Web Data",
  });

  process.exit(0);
}
