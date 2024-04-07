import {
	BackgroundColors,
	Beautifier,
	Beautify,
	Colors,
	Gap,
	Properties,
} from "cli-beautifier";
import {
	ErrorType,
	FileInvalidityType,
	MyError,
	fileInvalidityObjType,
} from "./errorTypes";

// types
type lookUpErrorType = {
	[K in ErrorType]: string;
};
type Property = "\x1b[1m" | "\x1b[3m" | "\x1b[4m" | "\x1b[9m" | "\x1b[0m" | "";
type Color = "\x1b[31m" | "\x1b[32m" | "\x1b[33m" | "\x1b[34m" | "";

type PainterType = (
	text: string,
	applyBg?: boolean,
	indentationLength?: number | Gap,
	font_style?: Property
) => string;

// codes
const lookUpError: lookUpErrorType = {
	0: "File-Error:",
	1: "Output-Error:",
};

export class RuntimeError {
	private errorObj: MyError;

	constructor(
		message: string,
		errType: ErrorType,
		nodeGenErrObj: Error,
		exitable: boolean = false
	) {
		this.errorObj = {message, errType, nodeGenErrObj, exitable} as MyError;
	}

	InvalidFile() {
		let errorType = lookUpError[this.errorObj.errType];
		const [paintedErrType, painterErrMsg] = this.Paint1(
			Beautify.error,
			errorType,
			this.errorObj.message,
			Properties.italic
		);
		this.Format1(paintedErrType, painterErrMsg);
	}
	noFileAccess() {
		let errorType = lookUpError[this.errorObj.errType];
		const [paintedErrType, painterErrMsg] = this.Paint1(
			Beautify.error,
			errorType,
			this.errorObj.message,
			Properties.underline
		);
		this.Format1(paintedErrType, painterErrMsg);
	}
	invalidFileFormat() {
		let errorType = lookUpError[this.errorObj.errType];
		const [paintedErrType, painterErrMsg] = this.Paint1(
			Beautify.error,
			errorType,
			this.errorObj.message,
			Properties.strikethrough
		);
		this.Format1(paintedErrType, painterErrMsg);
	}

	// Painters
	private Paint1(
		Painter: PainterType,
		OperationType: string,
		Message: string,
		messageProperty: Property = Properties.none
	): [string, string] {
		OperationType = Painter(OperationType, true, Gap.Space, Properties.bold);
		Message = Painter(Message, false, Gap.Space, messageProperty);

		return [OperationType, Message];
	}
	private Format1(
		OperationType: string,
		Message: string,
		display: boolean = true
	): string {
		const formattedOutput = `${OperationType} ${Message}`;
		if (display) {
			console.log(formattedOutput);
			console.error(this.errorObj.nodeGenErrObj, "\n");
		}

		if (this.errorObj.exitable) process.exit(0);
		return formattedOutput;
	}
}

// Error Handler
export const handleError = (errObj: any) => {
	if (errObj.code === "ENOENT") {
		console.log("d");
		new RuntimeError(
			"No Such File or directory",
			ErrorType.FileError,
			errObj,
			false
		).noFileAccess();
	} else if (errObj.code === "MODULE_NOT_FOUND") {
		new RuntimeError(
			"File does not exist!",
			ErrorType.FileError,
			errObj,
			true
		).InvalidFile();
	} else {
		console.error("Error accessing file:", errObj);
	}
};

export const handleInvalidFileFormat = (
	invalidFiles: fileInvalidityObjType[]
): void => {
	invalidFiles.map((invalidFileObj) => {
		switch (invalidFileObj.invalidityType) {
			case FileInvalidityType.DIRECTORY:
				showInvalidFileFormatErr(
					invalidFileObj.filePath,
					ErrorType.FileError,
					"Directory only Provided without any file format to look for"
				);
				break;

			case FileInvalidityType.SUPPORT:
				showInvalidFileFormatErr(
					invalidFileObj.filePath,
					ErrorType.FileError,
					"Non-Supporting file format/error Format provided"
				);
				break;

			case FileInvalidityType.NON_EXISTING:
				showInvalidFileFormatErr(
					invalidFileObj.filePath,
					ErrorType.FileError,
					"File Doesn't Exist or can't be accessed"
				);
				break;

			default:
				break;
		}
	});
};

const showInvalidFileFormatErr = (
	filePath: string,
	errType: ErrorType,
	message: string,
	exitable: boolean = false
) => {
	new RuntimeError(
		filePath,
		errType,
		{message} as Error,
		exitable
	).invalidFileFormat();
};

// Error Text Squiggle line & green line painter in text

const paintSquiggleText = (
	sentence: string,
	color: Color
): string => {
	return  Beautifier(	sentence, color, BackgroundColors.none,	0, Properties.underline)
};
export class SentencePainter {
	static redSquiggleText(sentence: string): string {
		return paintSquiggleText(sentence, Colors.error);
	}
	static greenSquiggleText(sentence: string): string {
		return paintSquiggleText(sentence, Colors.pass);
	}
}
