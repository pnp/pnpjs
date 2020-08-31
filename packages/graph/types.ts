export class GraphEndpoints {

    public static Beta = "beta";
    public static V1 = "v1.0";

    /**
     * 
     * @param url The url to set the endpoint 
     */
    public static ensure(url: string, endpoint: string): string {
        const all = [GraphEndpoints.Beta, GraphEndpoints.V1];
        let regex = new RegExp(endpoint, "i");
        const replaces = all.filter(s => !regex.test(s)).map(s => s.replace(".", "\\."));
        regex = new RegExp(`/?(${replaces.join("|")})/?`, "ig");
        return url.replace(regex, `/${endpoint}/`);
    }
}
