import { SPFetchClient } from "@pnp/nodejs";
import { ConsoleListener, Logger, LogLevel } from "@pnp/logging";
import { ISPConfiguration, sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";

declare var process: { exit(code?: number): void };

export async function Example(settings: any) {

  // configure your node options
  sp.setup({
    sp: {
      fetchClientFactory: () => {
        return new SPFetchClient(settings.testing.sp.url, settings.testing.sp.id, settings.testing.sp.secret);
      },
    },
  });

  // const w = await sp.web.select("Title")();

  const isolated = await sp.createIsolated<ISPConfiguration>({
    cloneGlobal: false,
    runtimeConfig: {
      sp: {
        fetchClientFactory: () => {
          return new SPFetchClient("https://318studios.sharepoint.com/sites/dev/6b6baf3e-e344-41e3-aa42-c47d4ad1be24", settings.testing.sp.id, settings.testing.sp.secret);
        },
      },
    },
  });

  Logger.activeLogLevel = LogLevel.Verbose;
  Logger.subscribe(new ConsoleListener());

  // const batch1 = sp.createBatch();
  // sp.web.lists.inBatch(batch1)();
  // sp.web.inBatch(batch1)();
  // await batch1.execute();

  const batch2 = isolated.createBatch();
  isolated.web.lists.inBatch(batch2)();
  isolated.web.inBatch(batch2)();
  await batch2.execute();

  // const special = await sp.createIsolated<ISPConfiguration>({
  //   cloneGlobal: true,
  //   runtimeConfig: {
  //     sp: {
  //       fetchClientFactory: () => {
  //         return new SPFetchClient("https://318studios.sharepoint.com/sites/dev/6b6baf3e-e344-41e3-aa42-c47d4ad1be24", settings.testing.sp.id, settings.testing.sp.secret);
  //       },
  //     },
  //   },
  // });

  // const special = await sp.createIsolated<ISPConfiguration>({
  //   cloneGlobal: true,
  // });

  // const special = await sp.createIsolated<ISPConfiguration>({
  //   baseUrl: "https://318studios.sharepoint.com/sites/dev/61e6b9e7-9b67-4450-af78-6c21a465e48b",
  //   cloneGlobal: true,
  // });

  //   const special = await sp.createIsolated<ISPConfiguration>({
  //   cloneGlobal: true,
  //   options: {
  //     headers: {
  //       "X-TestHeader": "123456",
  //     },
  //   },
  // });

  // isolated sp.setup must work correctly

  // const ww = await isolated.web.select("Title")();

  // Logger.log({
  //   data: w,
  //   level: LogLevel.Info,
  //   message: "List of Web Data",
  // });

  // Logger.log({
  //   data: ww,
  //   level: LogLevel.Info,
  //   message: "List of Web Data",
  // });

  // process.exit(0);
}
