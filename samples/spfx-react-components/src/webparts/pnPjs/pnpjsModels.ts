export interface IFile {
  Id: number;
  Title: string;
  Name: string;
  Size: number;
}

export interface IResponseFile {
  Length: number;
}

export interface IResponseItem {
  Id: number;
  File: IResponseFile;
  FileLeafRef: string;
  Title: string;
}