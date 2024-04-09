import { configType } from "../configTypeAndDefaults";

export class DetailsHolder {
	private filePath: string;
	private fileName: string;
    public userConfig: configType;

	constructor(fullFilePath: string, config: configType) {
        const fullpath: string[] = fullFilePath.split("/");
        this.fileName = fullpath.pop()!;
        this.filePath =  fullpath.join('/')+'/';
        this.userConfig = config;

        // console.log(this.fileName, this.filePath, this.userConfig)
	}
}
