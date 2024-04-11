// #!/usr/bin/env node
import {DetailsHolder} from "./detailsHolder/holdDetails";
import {resolvePath} from "./pathHandler/handlePath";
import {
	handleError,
	handleInvalidFileFormat,
} from "./errorHandler/errorHandler";
import {
	FileInvalidityType,
	fileInvalidityObjType,
} from "./errorHandler/errorTypes";
import {
	isDirectory,
	isSupported,
	handleGlobFiles,
} from "./pathHandler/handleFileValidity";
import {configType, defaultConfigs} from "./configTypeAndDefaults";
import {updateFile} from "./fileUpdater/updateFile";
import {Beautify, Gap, Properties} from "cli-beautifier";

if (process.argv.length > 3) {
	console.log("Incorrect Command.\nCommand Available: ");
	console.log("last-parse [filePath_to_last.config.js (default=./)]");
	process.exit();
}
const user_path = resolvePath(process.argv[2] || "./");
let details: DetailsHolder;

// Helpers
// strip Dot in path
const stripDotInPath = (path: string) => {
	if (path.startsWith(".")) {
		path = path.slice(1);
	}
	return path;
};
const loadJson = async(path: string): Promise<configType> => {
	try{
		return require(path);
	}
	catch(err){
		return {} as configType;
	}
}

const paintFileName = (filePath: string): string => {
	return (
		Beautify.pass("\nGoing Through: ", false, 1) +
		Beautify.pass(filePath, true, Gap.Tab, Properties.bold)
	);
};

// Implementation
(async () => {
	// getting file successfully
	try {
		const completePath = process.cwd() + stripDotInPath(user_path);
		const userConfig: configType = await loadJson(completePath) ;
		// including others default config files if not given
		const config: configType = {
			...defaultConfigs,
			...userConfig,
		};
		const ignoreFolders = config.ignoreFolders.map((igFolder) =>
			stripDotInPath(igFolder)
		);

		// details holder to handle future parsing and whatnot
		details = new DetailsHolder(user_path, config);

		let validFiles: string[] = [];
		let invalidFiles: fileInvalidityObjType[] = [];

		config.files.forEach((filePath) => {
			filePath = process.cwd() + stripDotInPath(filePath);

			if (!isDirectory(filePath) && isSupported(filePath)) {
				validFiles.push(filePath);
			} else {
				if (isDirectory(filePath)) {
					invalidFiles.push({
						filePath,
						invalidityType: FileInvalidityType.DIRECTORY,
					});
				} else
					invalidFiles.push({
						filePath,
						invalidityType: FileInvalidityType.SUPPORT,
					});
			}
		});

		// final check for the path. Checks if the path is accessible or not.
		[validFiles, invalidFiles] = handleGlobFiles(
			validFiles,
			invalidFiles,
			ignoreFolders
		);
		// Basically display my invalid File format
		handleInvalidFileFormat(invalidFiles);
		// console.clear();

		for (const file of validFiles) {
			console.log(paintFileName(file.replace(process.cwd(), ".")));
			await updateFile(file, details.userConfig);
		}
	} catch (errObj: unknown) {
		// retrieving the file was unsuccessful
		handleError(errObj);
	}
})();
