import { configType } from "../configTypeAndDefaults";

export class DetailsHolder {
	private filePath: string;
	private fileName: string;
    private line:number;
    public userConfig: configType;

	constructor(fullFilePath: string, config: configType) {
        const fullpath: string[] = fullFilePath.split("/");
        [this.fileName, this.filePath] = [fullpath.pop()!, fullpath.join('/')+'/'];
        this.line=0;
        this.userConfig = config;

        // console.log(this.fileName, this.filePath, this.userConfig)
	}
}
