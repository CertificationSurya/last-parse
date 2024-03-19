import * as fs from 'fs'
let path = "../src/**/*.ts";
const globRegex = /\/\*+(?!\.)/g; // for folder
const fileGlobRegex = /^\/\*+/ // for file

// tweaks
const sepreator = "|";
path = path.replace(globRegex, sepreator);
console.log(path)
let fragPath: string[]=[];

const handleGlob = (path: string): void =>{
    let currStr = "";
    for (let i=0; i<path.length; i++){
        if (path[i]!== sepreator) currStr+=path[i];
        else {
            if (currStr){
                fragPath.push(currStr);
            } 
            fragPath.push("");
            currStr = "";
        }
    }
    fragPath.push(currStr)
}

handleGlob(path);
console.log(fragPath)

// I am legend
const globRecurse: boolean[] = Array.from(fragPath, (str)=> !str);
console.log(globRecurse)
// tweaks end;
const targetFile = fragPath.pop()?.replace(fileGlobRegex, '');
const startFilePath = process.cwd()+ fragPath[0].replace(/\.+/,'');
console.log(startFilePath)

// list of file at the end
let files: string[] = [];
let currPathLevel = 0;

function recurseToFile (path: string, iterator: number, ending: string): void {
    // console.log(path + "\n")
    if (iterator > 2) {
        iterator = 0;
        currPathLevel--;
        return;
    };

    const availableFilesAndFolder:string[] = fs.readdirSync(path);
    // console.log(availableFilesAndFolder)

    availableFilesAndFolder.map(fNf => {
        fNf = path + (path.endsWith("/")? fNf : `/${fNf}`)
        if (fs.statSync(fNf).isDirectory()){
            if (globRecurse[currPathLevel++]){
                recurseToFile(fNf, ++iterator, ending)
            }
        }
        else {
            // console.log(fNf.endsWith(ending))
            if (fNf.endsWith(ending)) files.push(fNf);
        }
    })

    
}
recurseToFile( startFilePath, currPathLevel, targetFile!);

console.log(files)

// dirs.map(dir=> {
//     // dir+= "/"
//     // console.log(dir)
//     console.log(fs.readdirSync(dir).filter(fNf => {
//         fNf = dir+'/'+ fNf;
//         console.log(fNf)
//         console.log(fs.statSync(fNf).isFile())
//     }))
//     // const file = fs.readdirSync(dir).filter(fNf => fs.statSync(fNf).isFile())
//     // file.map(f => files.push(f))
// })
// console.log(dirs, files)
