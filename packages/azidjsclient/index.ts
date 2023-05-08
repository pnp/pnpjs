import { PnPClientStorage, getHashCode } from "@pnp/core/index.js";
import { Queryable } from "@pnp/queryable/index.js";
import {
    AccessToken,
    AuthorizationCodeCredential,
    AzureCliCredential,
    AzurePowerShellCredential,
    ChainedTokenCredential,
    ClientAssertionCredential,
    ClientCertificateCredential,
    ClientSecretCredential,
    DefaultAzureCredential,
    DeviceCodeCredential,
    EnvironmentCredential,
    GetTokenOptions,
    InteractiveBrowserCredential,
    ManagedIdentityCredential,
    OnBehalfOfCredential,
    UsernamePasswordCredential,
    VisualStudioCodeCredential,
} from "@azure/identity";

export interface IAzureIdentityToken {
    token: string;
    expires: Date;
}

export type ValidCredential = DefaultAzureCredential | ChainedTokenCredential | EnvironmentCredential |
ManagedIdentityCredential | ClientAssertionCredential | ClientCertificateCredential | ClientSecretCredential |
AuthorizationCodeCredential | DeviceCodeCredential | InteractiveBrowserCredential | OnBehalfOfCredential |
UsernamePasswordCredential | AzureCliCredential | AzurePowerShellCredential | VisualStudioCodeCredential;

export function AzureIdentity(credential: ValidCredential,
    scopes: string[] = ["https://graph.microsoft.com/.default"],
    options?: GetTokenOptions): (instance: Queryable) => Queryable {

    const key = `AzureIdentityCredential${Math.abs(getHashCode(scopes.join()))}`;
    const storage = new PnPClientStorage();

    return (instance: Queryable) => {
        instance.on.auth.replace(async (url: URL, init: RequestInit) => {
            let token: string;
            let expires: Date;

            const tokenStore = storage.session.get(key);
            if (tokenStore) {
                const storedToken: IAzureIdentityToken = JSON.parse(tokenStore);
                if (new Date(storedToken.expires) > (new Date())) {
                    token = storedToken.token;
                }
            }
            if (token == null) {
                const aiToken: AccessToken = await credential.getToken(scopes, options);
                // Set expiration date equal to the expiration timestamp minus 5 minutes for buffer
                expires = new Date((new Date()).getMilliseconds() + (aiToken.expiresOnTimestamp - 300000));
                token = aiToken.token;
                const newToken: IAzureIdentityToken = { token, expires };
                storage.session.put(key, JSON.stringify(newToken));
            }

            init.headers = { ...init.headers, Authorization: `Bearer ${token}` };

            return [url, init];
        });

        return instance;
    };
}
