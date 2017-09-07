import { expect } from "chai";

import { testSettings } from "../test-config.test";
import pnp from "../../src/pnp";
import { NodeFetchClient } from "../../src/net/nodefetchclient";
import { MockFetchClient } from "../mocks/mockfetchclient";

describe("Custom options", () => {
    const mockFetch = new MockFetchClient();
    const headerName = "my-header";
    const headerValue = "my header value";
    const headers = {};
    headers[headerName] = headerValue;
    headers["X-RequestDigest"] = "test";

    before(() => {
        pnp.setup({
            sp: {
                fetchClientFactory: () => {
                    return mockFetch;
                },
            }
        });
    });

    after(() => {
        if (testSettings.enableWebTests) {
            pnp.setup({
                sp: {
                    fetchClientFactory: () => {
                        return new NodeFetchClient(testSettings.webUrl, testSettings.clientId, testSettings.clientSecret);
                    },
                }
            });
        }
    });

    it("Should set header when getting a web and configuring global SPRests", () => {
        return pnp.sp.configure({
            headers: headers,
        }).web.get()
            .then(() => {
                const header = mockFetch.options.headers.get(headerName);
                expect(header).to.equal(headerValue);
            });
    });

    it("Should set header when making a post request using getParent method", () => {
        return pnp.sp.configure({
            headers: headers,
        }).web.features.getById("test").deactivate()
            .then(() => {
                const header = mockFetch.options.headers.get(headerName);
                expect(header).to.equal(headerValue);
            });
    });

    it("Should set header when getting a web and applying headers for web only", () => {
        return pnp.sp.web.configure({
            headers: headers,
        }).get()
            .then(() => {
                const header = mockFetch.options.headers.get(headerName);
                expect(header).to.equal(headerValue);
            });
    });

    it("Should override header when setting headers on a web", () => {
        const webHeaders = {};
        webHeaders[headerName] = "web's value";
        return pnp.sp.configure(headers).web.configure({
            headers: webHeaders,
        }).get()
            .then(() => {
                const header = mockFetch.options.headers.get(headerName);
                expect(header).to.equal("web's value");
            });
    });

    it("Should add another header when setting headers on a web", () => {
        const webHeaders = {};
        webHeaders["new-header"] = "web's value";
        return pnp.sp.configure(headers).web.configure({
            headers: webHeaders,
        }).get()
            .then(() => {
                const header = mockFetch.options.headers.get("new-header");
                expect(header).to.equal("web's value");
            });
    });

    it("Should use the same header for all requests", () => {
        const sp = pnp.sp.configure({
            headers: headers,
        });
        const validate = () => {
            const header = mockFetch.options.headers.get(headerName);
            expect(header).to.equal(headerValue);
            mockFetch.options = null;
        };
        return sp.site.get()
            .then(() => {
                validate();
                return sp.web.get();
            })
            .then(() => {
                validate();
                return sp.web.fields.add("test", "Text");
            })
            .then(() => {
                validate();
            });
    });

    it("Should use different headers for requests", () => {
        const webHeaders = {};
        webHeaders["new-header"] = "web's value";
        const sp = pnp.sp.configure({
            headers: headers,
        });

        return sp.site.get()
            .then(() => {
                const header = mockFetch.options.headers.get(headerName);
                expect(header).to.equal(headerValue);
                return pnp.sp.web.get();
            })
            .then(() => {
                const header = mockFetch.options.headers.get(headerName);
                expect(header).to.be.null;
            });
    });

    it("Should set correct options when getting a web and configuring global SPRests", () => {
        return pnp.sp.configure({
            cache: "no-store",
            credentials: "omit",
            mode: "cors",
        }).web.get()
            .then(() => {
                const mode = mockFetch.options.mode;
                const cache = mockFetch.options.cache;
                const creds = mockFetch.options.credentials;

                expect(mode).to.equal("cors");
                expect(cache).to.equal("no-store");
                expect(creds).to.equal("omit");
            });
    });

    it("Should override options when applying on child objects", () => {
        return pnp.sp.configure({
            cache: "no-store",
            credentials: "omit",
            mode: "cors",
        }).web.configure({
            cache: "default",
            mode: "navigate",
        }).get()
            .then(() => {
                const mode = mockFetch.options.mode;
                const cache = mockFetch.options.cache;

                expect(mode).to.equal("navigate");
                expect(cache).to.equal("default");
            });
    });
});
