import { expect } from "chai";
import { encodePath, ISPQueryable, spfi } from "@pnp/sp";
import "@pnp/sp/navigation";
import "@pnp/sp/webs";
import "@pnp/sp/files";
import "@pnp/sp/folders";
import { Folders } from "@pnp/sp/folders";

function getTestValue(query: ISPQueryable) {

    const url = query.toRequestUrl();
    return url.substring(url.indexOf("_api/"));
}

describe("Query Escaping", function () {

    let sp = null;

    before(function () {

        // we do this so these tests can run in non-web mode and for PRs
        // since we'll not make these requests we don't need all the behaviors properly registered
        sp = spfi();
    });

    it("single quote in path", function () {

        let value = getTestValue(sp.web.getFileByServerRelativePath("/sites/dev/documents/folder's root/something.txt"));
        expect(value).to.eq("_api/web/getFileByServerRelativePath(decodedUrl='%2Fsites%2Fdev%2Fdocuments%2Ffolder''s%20root%2Fsomething.txt')");

        value = getTestValue(sp.web.getFileByUrl("/sites/dev/documents/folder's root/something.txt"));
        expect(value).to.eq("_api/web/getFileByUrl(@p1)?%40p1=%27%2Fsites%2Fdev%2Fdocuments%2Ffolder%27%27s+root%2Fsomething.txt%27");

        value = getTestValue(sp.web.getFolderByServerRelativePath("/sites/dev/documents/folder's root/"));
        expect(value).to.eq(`_api/web/getFolderByServerRelativePath(decodedUrl='${encodeURIComponent("/sites/dev/documents/folder''s root/")}')`);

        value = getTestValue(sp.web.folders.getByUrl("/sites/dev/documents/folder's root/"));
        expect(value).to.eq(`_api/web/folders('${encodeURIComponent("/sites/dev/documents/folder''s root/")}')`);
    });

    it("random chars in path", function () {

        let value = getTestValue(sp.web.getFileByServerRelativePath("/sites/dev/shared documents/#!@#$%^&()_+-/readme.md"));
        expect(value).to.eq("_api/web/getFileByServerRelativePath(decodedUrl='%2Fsites%2Fdev%2Fshared%20documents%2F%23!%40%23%24%25%5E%26()_%2B-%2Freadme.md')");

        value = getTestValue(sp.web.getFileByUrl("/sites/dev/shared documents/#!@#$%^&()_+-/readme.md"));
        expect(value).to.eq("_api/web/getFileByUrl(@p1)?%40p1=%27%2Fsites%2Fdev%2Fshared+documents%2F%23%21%40%23%24%25%5E%26%28%29_%2B-%2Freadme.md%27");

        value = getTestValue(sp.web.getFolderByServerRelativePath("/sites/dev/documents/folder #!@#$%^&()_+-"));
        expect(value).to.eq("_api/web/getFolderByServerRelativePath(decodedUrl='%2Fsites%2Fdev%2Fdocuments%2Ffolder%20%23!%40%23%24%25%5E%26()_%2B-')");

        value = getTestValue(sp.web.folders.getByUrl("/sites/dev/documents/folder #!@#$%^&()_+-"));
        expect(value).to.eq("_api/web/folders('%2Fsites%2Fdev%2Fdocuments%2Ffolder%20%23!%40%23%24%25%5E%26()_%2B-')");
    });

    it("aliasing", function () {

        let value = getTestValue(sp.web.getFileByServerRelativePath("!@p1::/sites/dev/shared documents/#!@#$%^&()_+-/readme.md"));
        expect(value).to.eq("_api/web/getFileByServerRelativePath(decodedUrl=@p1)?%40p1=%27%2Fsites%2Fdev%2Fshared+documents%2F%23%21%40%23%24%25%5E%26%28%29_%2B-%2Freadme.md%27");

        // fake addUsingPath to ensure alias works in multi value calls
        value = getTestValue(Folders("", `addUsingPath(DecodedUrl='${encodePath("!@p1::/sites/dev/documents/folder's root/something.txt")}',overwrite=${true})`));
        expect(value).to.eq("addUsingPath(DecodedUrl=@p1,overwrite=true)?%40p1=%27%2Fsites%2Fdev%2Fdocuments%2Ffolder%27%27s+root%2Fsomething.txt%27");

        // fake made up request to ensure alias works in multi value calls in the other order
        value = getTestValue(Folders("", `addUsingPath(overwrite=${true},DecodedUrl='${encodePath("!@p1::/sites/dev/documents/folder's root/something.txt")}')`));
        expect(value).to.eq("addUsingPath(overwrite=true,DecodedUrl=@p1)?%40p1=%27%2Fsites%2Fdev%2Fdocuments%2Ffolder%27%27s+root%2Fsomething.txt%27");

        // fake made up request to ensure alias works in multi value calls in the other order
        value = getTestValue(Folders("", `addUsingPath(overwrite=${true},DecodedUrl='${encodePath("!@p1::/sites/dev/documents/folder's root/something.txt")}',something=false)`));
        expect(value).to.eq("addUsingPath(overwrite=true,DecodedUrl=@p1,something=false)?%40p1=%27%2Fsites%2Fdev%2Fdocuments%2Ffolder%27%27s+root%2Fsomething.txt%27");

        value = getTestValue(sp.web.getFileByServerRelativePath("!@p1::/sites/dev/documents/folder's root/something.txt"));
        expect(value).to.eq("_api/web/getFileByServerRelativePath(decodedUrl=@p1)?%40p1=%27%2Fsites%2Fdev%2Fdocuments%2Ffolder%27%27s+root%2Fsomething.txt%27");

        value = getTestValue(sp.web.getFileByServerRelativePath("!@p1::/sites/dev/shared documents/tom's files/readme.md"));
        expect(value).to.eq("_api/web/getFileByServerRelativePath(decodedUrl=@p1)?%40p1=%27%2Fsites%2Fdev%2Fshared+documents%2Ftom%27%27s+files%2Freadme.md%27");

        value = getTestValue(sp.web.getFileByServerRelativePath("!@p1::/sites/dev/documents/folder #!@#$%^&()_+-/something.txt"));
        // eslint-disable-next-line max-len
        expect(value).to.eq("_api/web/getFileByServerRelativePath(decodedUrl=@p1)?%40p1=%27%2Fsites%2Fdev%2Fdocuments%2Ffolder+%23%21%40%23%24%25%5E%26%28%29_%2B-%2Fsomething.txt%27");

        value = getTestValue(sp.web.getFolderByServerRelativePath("!@p1::/sites/dev/documents/folder #!@#$%^&()_+-"));
        expect(value).to.eq("_api/web/getFolderByServerRelativePath(decodedUrl=@p1)?%40p1=%27%2Fsites%2Fdev%2Fdocuments%2Ffolder+%23%21%40%23%24%25%5E%26%28%29_%2B-%27");

        // multiple ' chars
        value = getTestValue(sp.web.getFileByServerRelativePath("!@p1::/sites/dev/documents/folder's ro'ot/something.txt"));
        expect(value).to.eq("_api/web/getFileByServerRelativePath(decodedUrl=@p1)?%40p1=%27%2Fsites%2Fdev%2Fdocuments%2Ffolder%27%27s+ro%27%27ot%2Fsomething.txt%27");

        // multiple ' chars2
        value = getTestValue(sp.web.getFileByServerRelativePath("!@p1::/sites/dev/documents/folder''s ro'ot/something.txt"));
        expect(value).to.eq("_api/web/getFileByServerRelativePath(decodedUrl=@p1)?%40p1=%27%2Fsites%2Fdev%2Fdocuments%2Ffolder%27%27%27%27s+ro%27%27ot%2Fsomething.txt%27");
    });
});
