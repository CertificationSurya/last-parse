import {Beautify, Gap, Properties} from "cli-beautifier";
import {ErrorType, MyError} from "./errorTypes";

// types
type lookUpErrorType = {
	[K in ErrorType]: string;
};
type Property = "\x1b[1m" | "\x1b[3m" | "\x1b[4m" | "\x1b[9m" | "\x1b[0m" | "";
type PainterType = (
	text: string,
	applyBg?: boolean,
	indentationLength?: number | Gap,
	font_style?: Property
) => string;

// codes
const lookUpError: lookUpErrorType = {
	0: "File-Error:",
    1: "Output-Error:"
};

export class RuntimeError {
	private errorObj: MyError;

	constructor(message: string, errType: ErrorType, nodeGenErrObj: Error, exitable: boolean = false) {
		this.errorObj = {message, errType, nodeGenErrObj, exitable} as MyError;
	}

	InvalidFile() {
		let errorType = lookUpError[this.errorObj.errType];
		const [paintedErrType, painterErrMsg] = this.Paint1(Beautify.error,	errorType, this.errorObj.message, Properties.italic	);
		this.Format1(paintedErrType, painterErrMsg);
	}
	noFileAccess() {
		let errorType = lookUpError[this.errorObj.errType];
		const [paintedErrType, painterErrMsg] = this.Paint1(Beautify.error,	errorType, this.errorObj.message, Properties.underline);
		this.Format1(paintedErrType, painterErrMsg);
	}

	// Painters
	private Paint1(	Painter: PainterType, OperationType: string, Message: string, messageProperty: Property = Properties.none): [string, string] {
		OperationType = Painter(OperationType, true, Gap.Space, Properties.bold);
		Message = Painter(Message, false, Gap.Space, messageProperty);

		return [OperationType, Message];
	}
	private Format1(OperationType: string, Message: string, display: boolean = true	): string {
		const formattedOutput = `${OperationType} ${Message}`;
		if (display) {
            console.log(formattedOutput+'\n')
            console.error(this.errorObj.nodeGenErrObj);
        };

        if (this.errorObj.exitable) process.exit(0);
		return formattedOutput;
	}
}


// Error Handler
export const handleError = (errObj: any) => {
	if (errObj.code === "ENOENT"){
		console.log('d')
		new RuntimeError("No Such File or directory", ErrorType.FileError, errObj, false).noFileAccess();
	}
	else if (errObj.code === "MODULE_NOT_FOUND") {
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
