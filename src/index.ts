// #!/usr/bin/env ts-node
import {DetailsHolder} from "./detailsHolder/holdDetails";
import {resolvePath} from "./pathHandler/handlePath";
import {handleError} from "./errorHandler/errorHandler";
import {isDirectory, isSupported } from "./pathHandler/handleFileValidity";

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
		let invalidFiles: string[] = [];

		console.log(config.files)
		
		config.files.forEach(filePath => {
			if (!isDirectory(filePath) && isSupported(filePath)){
				validFiles.push(filePath);
			}
			else {
				invalidFiles.push(filePath);
			}
		});
		
		console.log(validFiles)
		console.log(invalidFiles)
		// const a =isDirectory(config.files)
		// console.log(isSupported(config.files))
	}
	// retrieving the file was unsuccessful
	catch (errObj: any) {
		handleError(errObj);
	}
})();


