import { IInvokable } from "@pnp/queryable";
import { expect } from "chai";

export default function testSPInvokables<TargetType extends IInvokable, Keys extends string & keyof TargetType>(targetF: () => TargetType, ...keys: Keys[]): () => void {

    return () => {

        const target = targetF();

        for (let i = 0; i < keys.length; i++) {

            it(keys[i], function () {
                return expect((<any>target)[keys[i]]()).to.eventually.be.fulfilled;
            });
        }
    };
}




//     before(function () {
//         Object.getOwnPropertyNames(tests).forEach((key) => {
//             switch (key) {
//                 case ".roleDefinitions":
//                     tests[key] = _spfi.web.roleDefinitions;
//                     break;
//                 case ".webs":
//                     tests[key] = _spfi.web.webs;
//                     break;
//                 case ".contentTypes":
//                     tests[key] = _spfi.web.contentTypes;
//                     break;
//                 case ".lists":
//                     tests[key] = _spfi.web.lists;
//                     break;
//                 case ".siteUserInfoList":
//                     tests[key] = _spfi.web.siteUserInfoList;
//                     break;
//                 case ".defaultDocumentLibrary":
//                     tests[key] = _spfi.web.defaultDocumentLibrary;
//                     break;
//                 case ".customListTemplates":
//                     tests[key] = _spfi.web.customListTemplates;
//                     break;
//                 case ".siteUsers":
//                     tests[key] = _spfi.web.siteUsers;
//                     break;
//                 case ".siteGroups":
//                     tests[key] = _spfi.web.siteGroups;
//                     break;
//                 case ".userCustomActions":
//                     tests[key] = _spfi.web.userCustomActions;
//                     break;
//                 case ".allProperties":
//                     tests[key] = _spfi.web.allProperties;
//                     break;
//                 case ".webinfos":
//                     tests[key] = _spfi.web.webinfos;
//                     break;
//                 case ".features":
//                     tests[key] = _spfi.web.features;
//                     break;
//                 case ".fields":
//                     tests[key] = _spfi.web.fields;
//                     break;
//                 case ".availablefields":
//                     tests[key] = _spfi.web.availablefields;
//                     break;
//                 case ".folders":
//                     tests[key] = _spfi.web.folders;
//                     break;
//                 case ".rootFolder":
//                     tests[key] = _spfi.web.rootFolder;
//                     break;
//                 case ".regionalSettings":
//                     tests[key] = _spfi.web.regionalSettings;
//                     break;
//             }
//         });
//     });

//     Object.getOwnPropertyNames(tests).forEach((key) => {
//         it(key, function () {
//             const test = tests[key];
//             return expect((<any>test)()).to.eventually.be.fulfilled;
//         });
//     });
// });