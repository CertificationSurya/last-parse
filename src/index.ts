// #!/usr/bin/env ts-node
import {DetailsHolder} from "./detailsHolder/holdDetails";
import {resolvePath} from "./pathHandler/handlePath";
import {handleError, handleInvalidFileFormat} from "./errorHandler/errorHandler";
import {FileInvalidityType, fileInvalidityObjType} from './errorHandler/errorTypes'
import {isDirectory, isSupported, handleGlobFiles } from "./pathHandler/handleFileValidity";



if (process.argv.length > 3) {
	process.exit();
}

const path = resolvePath(process.argv[2]);
const details = new DetailsHolder(path); // TODO-other implementation

// strip Dot in path
const stripDotInPath = (path: string) => {
	if (path.startsWith(".")) {
		path = path.slice(1);
	}
	return path;
};



(async () => {
	// getting file successfully
	try {
		const completePath = process.cwd() + stripDotInPath(path);
		const config: {files: string[]} = await import(completePath);

		let validFiles: string[] = [];
		let invalidFiles: fileInvalidityObjType[] = [];

		console.log(config.files)
		
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
		[validFiles, invalidFiles] = handleGlobFiles(validFiles, invalidFiles);
		// Basically display my invalid File format
		handleInvalidFileFormat(invalidFiles);

		console.log(validFiles)
		console.log(invalidFiles)
	}
	// retrieving the file was unsuccessful
	catch (errObj: any) {
		handleError(errObj);
	}
})();


