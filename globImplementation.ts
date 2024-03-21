import * as fs from 'fs'
const folderGlobRegex = /\*+(?!\.)/; // for folder
const fileGlobRegex = /[/\*]+/ // for file

// list of file at the end
let files: string[] = [];

function recurseToFile (currPath: string, fragPath: string[], currPathLevel: number, targetFile: string, endPathLevel: number): void {

    // get allValidPath from the given path
    const allValidFiles = fs.readdirSync(currPath);
    // check path level
    if (currPathLevel === endPathLevel+1){
        currPathLevel --;
        return;
    }

    allValidFiles.map(fNf => {
        const tempPath = currPath + (currPath.endsWith("/")? fNf :`/${fNf}`);
        if (fNf.endsWith(targetFile)) files.push(tempPath);

        else if (folderGlobRegex.test(fragPath[currPathLevel])){
            // console.log(tempPath)
            if (fs.statSync(tempPath).isDirectory()){
                recurseToFile(tempPath, fragPath, ++currPathLevel, targetFile, endPathLevel);
            }
            
        }
        else if (fNf===fragPath[currPathLevel]){
            recurseToFile(currPath+fragPath[currPathLevel], fragPath, ++currPathLevel, targetFile, endPathLevel);
        }

    })
}


export const recurseToFileMain = (path: string) :string[] => {
    let allValidFiles:string[] = [];
    const rootPath = process.cwd()+'/';

    const fragPath = path.replace(rootPath, "").split("/");
    const targetFile = fragPath.pop()?.replace(fileGlobRegex, "")!;
    // console.log(fragPath, targetFile)
    
    recurseToFile(rootPath, fragPath, 0, targetFile, fragPath.length+1)

    console.log(path, files)


    return allValidFiles;

}
