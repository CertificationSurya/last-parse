// Define an enum for error types
export enum ErrorType {
    FileError,
    OutputError,
}

// Define the error type
export interface MyError {
    nodeGenErrObj: Error;
    message: string;
    errType: ErrorType;
    exitable?: boolean
}

// for fileValidities
export enum FileInvalidityType { DIRECTORY, SUPPORT, NON_EXISTING};
// file details type
export type fileInvalidityObjType = {
	filePath: string,
	invalidityType: FileInvalidityType
}