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
