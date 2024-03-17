export class DetailsHolder {
	private filePath: string;
	private fileName: string;
    private line:number;

	constructor(fullFilePath: string) {
        const fullpath: string[] = fullFilePath.split("/");
        [this.fileName, this.filePath] = [fullpath.pop()!, fullpath.join('/')+'/'];
        this.line=0;

        // console.log(this.fileName, this.filePath)
	}
}
