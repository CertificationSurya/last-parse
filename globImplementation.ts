import * as fs from 'fs'
const folderGlobRegex = /\*+(?!\.)/; // for folder
const fileGlobRegex = /[/\*]+/ // for file

// list of file at the end
let files: string[] = [];

const satisfyNestedDirectPath = (nestedDirectPaths: string[], path: string) => {
    if (!nestedDirectPaths || nestedDirectPaths.length === 0) {
        return true; // Return true if nestedDirectPaths is null, undefined, or empty
    }
    const isOk = nestedDirectPaths.every(nestedPath => new RegExp(`/${nestedPath}/`).test(path));
    return isOk;
};

function recurseToFile (currPath: string, fragPath: string[], currPathLevel: number, targetFile: string, endPathLevel: number, nestedDirectPaths: string[]): void {
    // get allValidPath from the given path
    const allValidFiles = fs.readdirSync(currPath);
    // check path level
    if (currPathLevel === endPathLevel+1){
        // currPathLevel--;
        return;
    }

    allValidFiles.map(fNf => {
        if (fNf == "node_modules") return;
        const tempPath = currPath + (currPath.endsWith("/")? fNf :`/${fNf}`);
        
        // if folder is a glob
        if (folderGlobRegex.test(fragPath[currPathLevel])){
            // console.log(tempPath, currPathLevel)
            if (fs.statSync(tempPath).isDirectory()){
                recurseToFile(tempPath, fragPath, ++currPathLevel, targetFile, endPathLevel, nestedDirectPaths);
                currPathLevel--;
            }   
        }
        // if folder is direct path
        else if (fNf===fragPath[currPathLevel]){
            recurseToFile(currPath+fragPath[currPathLevel], fragPath, ++currPathLevel, targetFile, endPathLevel, nestedDirectPaths);
            currPathLevel--;
        }
        if (fNf.endsWith(targetFile)) {
            // if (satisfyNestedDirectPath( nestedDirectPaths, tempPath))
            files.push(tempPath);
            // console.log(tempPath, nestedDirectPaths)
        }
    })
}


export const recurseToFileMain = (path: string) :string[] => {
    let allValidFiles:string[] = [];
    const rootPath = process.cwd()+'/';

    const fragPath = path.replace(rootPath, "").split("/");
    const targetFile = fragPath.pop()?.replace(fileGlobRegex, "")!;
    // console.log(rootPath, fragPath, fragPath.length+1)
    const nestedDirectPaths = fragPath.filter(nestedPath => !folderGlobRegex.test(nestedPath));

    recurseToFile(rootPath, fragPath, 0, targetFile, fragPath.length+1, nestedDirectPaths)

    console.log(path, '\n' ,files)


    return allValidFiles;

}
