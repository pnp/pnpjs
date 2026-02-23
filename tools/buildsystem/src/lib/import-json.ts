import { readFileSync } from "fs";

export default (path): any => JSON.parse(readFileSync(path).toString());;
