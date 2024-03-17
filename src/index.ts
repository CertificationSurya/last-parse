// #!/usr/bin/env ts-node
import {DetailsHolder} from "./detailsHolder/holdDetails";
import {resolvePath} from "./pathHandler/handlePath";
import {ErrorType} from "./errorHandler/errorTypes";
import {RuntimeError} from "./errorHandler/errorHandler";

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
	// get files
	try {
		const completePath = process.cwd() + stripDotInPath(path);
		const config = await import(completePath);
		console.log(config);
	} catch (errObj: any) {
		// console.log(errObj.code);
		if (errObj.code === "MODULE_NOT_FOUND") {
			new RuntimeError(
				"File does not exist!",
				ErrorType.FileError,
				errObj,
				true,
			).InvalidFile();
		} else {
			console.error("Error accessing file:", errObj);
		}
	}


})();
