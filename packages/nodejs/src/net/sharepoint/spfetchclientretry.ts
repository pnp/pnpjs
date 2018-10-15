import { SPOAuthEnv, SPFetchClient } from "./spfetchclient";
import {
    RetryNodeFetchClient,
} from "../retrynodefetchclient";



/**
 * Fetch client for use within nodejs, requires you register a client id and secret with app only permissions
 */
export class SPFetchClientRetry extends SPFetchClient {

    constructor(
        siteUrl: string,
        _clientId: string,
        _clientSecret: string,
        authEnv: SPOAuthEnv = SPOAuthEnv.SPO,
        _realm = "",
        _fetchClient = new RetryNodeFetchClient(),
    ) {

            super(
                siteUrl,
                _clientId,
                _clientSecret,
                authEnv,
                _realm,
                _fetchClient);

    }

}
