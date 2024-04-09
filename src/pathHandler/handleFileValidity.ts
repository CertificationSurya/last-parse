import * as fs from "fs";
import {
	FileInvalidityType,
	fileInvalidityObjType,
} from "../errorHandler/errorTypes";
import {recurseToFileMain} from "./globImplementation";

const supportedFiles = [".html", ".jsx", ".tsx", "*.ejs", ".txt"];
// const userPath = "./src/index.ts";

export const isDirectory = (path: string): boolean => {
	try {
		return fs.statSync(path).isDirectory();
	} catch (err: unknown) {
		return false;
	}
};
export const isSupported = (path: string): boolean => {
	return supportedFiles.some((supTypes) => path.endsWith(supTypes));
};

export const containsGlob = (path: string): boolean => {
	const pathContainsGlob = /[*?[\]]/;
	return pathContainsGlob.test(path);
};

const isIgnored = (ignoreFolders: string[], path: string): boolean => {
	return ignoreFolders.some((ignoreFolder) => path.startsWith(ignoreFolder));
};

const isFileAccessible = (path: string): boolean => {
	try {
		fs.statSync(path);
		console.log(path);
		return true;
	} catch {
		return false;
	}
};

export const handleGlobFiles = (
	validFilePaths: string[],
	invalidFiles: fileInvalidityObjType[],
	ignoreFolders: string[]
): [string[], fileInvalidityObjType[]] => {
	let filteredValidFiles: string[] = [];
	let allGlobFiles: string[] = [];

	validFilePaths.map((validFilePath) => {
		// if we don't have glob, check if file is present & accessible, yes? add to valid, no? push to invalid with errtype of non-existing
		if (!containsGlob(validFilePath)) {
			if (isFileAccessible(validFilePath)) {
				filteredValidFiles.push(validFilePath);
			} else {
				invalidFiles.push({
					filePath: validFilePath,
					invalidityType: FileInvalidityType.NON_EXISTING,
				});
			}
		}

		// oopsi, we got files with glob
		else {
			// console.log(validFilePath);
			allGlobFiles.push(validFilePath);
		}
	});

	// sends all possible globPaths and ignore folders and push to filteredValidFiles
	const tempAllPossibleFiles = recurseToFileMain(allGlobFiles);
	tempAllPossibleFiles.forEach((validPath) => {
		const tempValidPath = validPath.replace(process.cwd(), "");
        // check if file is ignored or not
		if (!isIgnored(ignoreFolders, tempValidPath)) {
			filteredValidFiles.push(validPath);
		}
	});

	return [filteredValidFiles, invalidFiles];
};
