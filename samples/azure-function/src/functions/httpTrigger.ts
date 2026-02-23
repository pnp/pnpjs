import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import AppInsights from 'applicationinsights';
import { pnpjs } from "../common/pnpjsService.js";

export async function httpTrigger(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  const LOG_SOURCE = "httpTrigger";
  // Initialize Application Insights, setting AutoDependencyCorrelation to true so that all logs for each run are correlated together in App Insights. 
  AppInsights.setup(process.env.APPLICATIONINSIGHTS_CONNECTION_STRING).setAutoDependencyCorrelation(true);

  // start the client
  AppInsights.start();

  AppInsights.defaultClient.trackEvent({
    name: `${LOG_SOURCE}/request`,
    properties: {
      source: LOG_SOURCE,
      requestBody: JSON.stringify(request.body),
      requestQuery: JSON.stringify(request.query)
    }
  });

  // Set the default response to a 200 with an empty body.
  let retVal: HttpResponseInit = { status: 200, body: "" };

  try {
    // If the request is a GET
    if (request.method == "GET") {
      const id = request.query.get("id");
      if (id != null) {
        const ready = await pnpjs.Init();
        if (ready) {
          const result = await pnpjs.GetListItem(id);
          if (result != null) {
            retVal = { status: 200, body: JSON.stringify(result) };
            AppInsights.defaultClient.trackTrace({
              message: 'Found item',
              properties: {
                source: LOG_SOURCE,
                request_type: "GET"
              },
              severity: AppInsights.Contracts.SeverityLevel.Verbose
            });
          } else {
            retVal = { status: 400, body: "Item not found." };
            AppInsights.defaultClient.trackTrace({
              message: 'Item not found',
              properties: {
                source: LOG_SOURCE,
                request_type: "GET"
              },
              severity: AppInsights.Contracts.SeverityLevel.Verbose
            });
          }
        }
      } else {
        retVal = { status: 400, body: "Invalid request" };
        AppInsights.defaultClient.trackTrace({
          message: 'Invalid Request',
          properties: {
            source: LOG_SOURCE,
            request_type: "GET"
          },
          severity: AppInsights.Contracts.SeverityLevel.Verbose
        });
      }
    }
  } catch (err) {
    AppInsights.defaultClient.trackException({
      exception: err,
      severity: AppInsights.Contracts.SeverityLevel.Critical,
      properties: { source: LOG_SOURCE, method: "httpTrigger" }
    });
  }

  // Return the appropriate response to the requestor.
  return retVal;
};

app.http('httpTrigger', {
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: httpTrigger
});
