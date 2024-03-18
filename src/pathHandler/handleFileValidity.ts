import * as fs from "fs";
// import path from "path";

const supportedFiles = [".html", ".jsx",".tsx"];
// const userPath = "./src/index.ts";

export const isDirectory = (path: string): boolean =>{
    try{
        fs.statSync(path).isDirectory();
        return true;
    }
    catch(err: unknown){
        return false;
    }
}
export const isSupported = (path: string): boolean => {
    return supportedFiles.some(supTypes => path.endsWith(supTypes));
}