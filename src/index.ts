// #!/usr/bin/env ts-node
import {DetailsHolder} from "./detailsHolder/holdDetails";
import {resolvePath} from "./pathHandler/handlePath";
import {handleError, handleInvalidFileFormat} from "./errorHandler/errorHandler";
import {FileInvalidityType, fileInvalidityObjType} from './errorHandler/errorTypes'
import {isDirectory, isSupported, handleGlobFiles } from "./pathHandler/handleFileValidity";
import { configType, defaultConfigs } from "./configTypeAndDefaults";
import {  updateFile } from "./fileUpdater/updateFile";
import { Beautify, Gap, Properties } from "cli-beautifier";


if (process.argv.length > 3) {
	process.exit();
}

const path = resolvePath(process.argv[2]);
let details: DetailsHolder; // TODO-other implementation

// Helpers
// strip Dot in path
const stripDotInPath = (path: string) => {
	if (path.startsWith(".")) {
		path = path.slice(1);
	}
	return path;
};
const paintFileName = (filePath: string): string => {
	return Beautify.pass("\nGoing Through: ", false, 1) + Beautify.pass(filePath, true, Gap.Tab, Properties.bold)
}


// Implementation
(async () => {
	// getting file successfully
	try {
		const completePath = process.cwd() + stripDotInPath(path);
		const userConfig: configType= await import(completePath);
		// including others default config files if not given
		const config: configType = {
			...defaultConfigs,
			...userConfig
		}

		// details holder to handle future parsing and whatnot
		details = new DetailsHolder(path, config);

		let validFiles: string[] = [];
		let invalidFiles: fileInvalidityObjType[] = [];
		
		config.files.forEach(filePath => {
			filePath = process.cwd() + stripDotInPath(filePath)

			if (!isDirectory(filePath) && isSupported(filePath)){
				validFiles.push(filePath);
			}
			else {
				if (isDirectory(filePath)){
					invalidFiles.push({filePath, invalidityType: FileInvalidityType.DIRECTORY})
				}
				else invalidFiles.push({filePath, invalidityType: FileInvalidityType.SUPPORT})
			}
		});

		// final check for the path. Checks if the path is accessible or not.
		[validFiles, invalidFiles] = handleGlobFiles(validFiles, invalidFiles, config.ignoreFolders);
		// Basically display my invalid File format
		handleInvalidFileFormat(invalidFiles);
		console.clear();

		for (const file of validFiles){
			console.log(paintFileName(file.replace(process.cwd(), ".")))
			await updateFile(file, details.userConfig)
		}
	}
	// retrieving the file was unsuccessful
	catch (errObj: any) {
		handleError(errObj);
	}
})();
