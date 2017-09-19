/**
 * Used to create an escaped regex for the non-SharePoint request tests 
 * 
 */
export function toMatchEndRegex(s: string): RegExp {
    let s2 = s.replace(/\(/g, "\\(");
    s2 = s2.replace(/\)/g, "\\)");
    s2 = s2.replace(/\?/g, "\\?");
    s2 = s2.replace(/\$/g, "\\$");
    return new RegExp(s2 + "$");
}
