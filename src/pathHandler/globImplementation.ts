import * as fs from 'fs'
const folderGlobRegex = /\*+(?!\.)/; // for folder
const fileGlobRegex = /[/\*]+/ // for file

// list of file at the end
let files: string[] = [];
let nestedDirectPathLv = 0; // for nestedDirectPath like /src and /test in /**/**/src/**/test/**

const satisfyNestedDirectPath = (nestedDirectPaths: string[], path: string) => {
    if (!nestedDirectPaths || nestedDirectPaths.length === 0) {
        return true; // Return true if nestedDirectPaths is null, undefined, or empty
    }
    let previousMatchedIndex = -1;
    // created this to check if order of nestedDirectPath is correct. e.g: if path is: /src/**/test, only src/**/test must be correct not /test/src
    const isOk = nestedDirectPaths.every(nestedPath => {
        const tempPathIndex = path.indexOf(`/${nestedPath}`);
        if (previousMatchedIndex < tempPathIndex){
            previousMatchedIndex = tempPathIndex;
            return true;
        }
        return false;
    });
    return isOk;
};

function recurseToFile (currPath: string, fragPath: string[], currPathLevel: number, targetFile: string, endPathLevel: number, nestedDirectPaths: string[]): void {
    // get allValidPath from the given path
    let validFilesAndFolders :string[];
    try{
        validFilesAndFolders = fs.readdirSync(currPath);
    } catch { return; }
    // check path level
    if (currPathLevel === endPathLevel+1){ // endPathLevel+1 because, our rootPath gets 0 idx
        return;
    }

    // all Valid FilesAndFolder in a directory
    validFilesAndFolders.map(fNf => {
        // new variable to hold new Path so, we don't have to do hassel of poping last added path
        const tempPath = currPath + (currPath.endsWith("/")? fNf :`/${fNf}`); // path Creator
        
        // if folder is direct path, start pathLevel from there
        if (fNf===nestedDirectPaths[nestedDirectPathLv]){
            currPathLevel = fragPath.indexOf(fNf);
            recurseToFile(tempPath, fragPath, ++currPathLevel, targetFile, endPathLevel, nestedDirectPaths);
            currPathLevel--;
        }
        // if folder is a glob, enter into any folder you find
        else if (folderGlobRegex.test(fragPath[currPathLevel])){
            // console.log(tempPath, currPathLevel)
            if (fs.statSync(tempPath).isDirectory()){
                recurseToFile(tempPath, fragPath, ++currPathLevel, targetFile, endPathLevel, nestedDirectPaths);
                currPathLevel--;
            }   
        }
        // if current file matches with targetFile && the path satisfies nestedDirectPath, then only insert path to files
        if (fNf.endsWith(targetFile) && satisfyNestedDirectPath( nestedDirectPaths, tempPath)) {
            files.push(tempPath);
        }
    })
}


export const recurseToFileMain = (globPath: string[]) :string[] => {

    // allValidFiles for as name suggest
    let allValidFiles:string[] = [];
    const rootPath = process.cwd()+'/'; // for first arg as currPath

    globPath.map((path) => {
        const fragPath = path.replace(rootPath, "").split("/"); // remove rootPath and then split with /
        const targetFile = fragPath.pop()?.replace(fileGlobRegex, "")!;  // get last fragPath and replace * if contains
        const nestedDirectPaths = fragPath.filter(nestedPath => !folderGlobRegex.test(nestedPath)); // all path that doesn't have /*+/

        recurseToFile(rootPath, fragPath, 0, targetFile, fragPath.length+1, nestedDirectPaths)
        // in each recurseToFile, we'll add filePath in files and if we don't have already stored, we'll store
        files.map(validFiles => !allValidFiles.includes(validFiles) && allValidFiles.push(validFiles))
    })
    files = [];
    nestedDirectPathLv =0;
    return allValidFiles;
}