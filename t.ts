import * as fs from "fs";
import * as readline from "node:readline";
import {SentenceDetails} from "./src/detailsHolder/sentenceDetails";
// import languageTool from "languagetool-api";
// import Textgears, * as textgears from "textgears-api";

const chunkSentence: SentenceDetails[] = [];

async function processLineByLine(fileName: string) {
	const fileStream = fs.createReadStream(fileName);
	const readLine = readline.createInterface({
		input: fileStream,
		crlfDelay: Infinity,
	});

	let currLineNum = 0;
	let currPos: number;
	let inBrackets = false;
	let storeStartPos = true;
	let contentStPos: number;
	let contentEndPos: number;

	let fileContent: string = "";

	for await (const line of readLine) {
		// preset each line
		fileContent += line + "\n";
		contentStPos = -1;
		contentEndPos = -1;
		currPos = 0;
		++currLineNum;
		const currLine = line.split("");

		let textContent = "";
		for (let char of currLine) {
			currPos++;
			if (char === "<") {
				inBrackets = true;
				contentEndPos = currPos - 1;
				if (textContent) {
					chunkSentence.push(
						new SentenceDetails(
							textContent,
							contentStPos,
							contentEndPos,
							currLineNum
						)
					);
					textContent = "";
				}
			} else if (char === ">") {
				inBrackets = false;
				storeStartPos = true;
				continue;
			}
			if (!inBrackets) {
				if (storeStartPos) {
					if (/\s/.test(char)) continue;
					contentStPos = currPos;
					storeStartPos = false;
				}
				if (textContent != "") {
					textContent += char;
				} else textContent += /\s/.test(char) ? "" : char;
			}
		}

		// language processor: TODO
		// Available Tools: languageToolAPI, textgearsapi

		// currLineNum = 0;
		// let currentSentence = chunkSentence.pop()!;
		// fs.readFile(fileName, (err, data) => {
		// 	if (err) return;
		// 	currLineNum++;

		// 	const fileContent = data.toString().split("\n");

		// 	fileContent.map((line) => {
		// 		if (currLineNum != currentSentence.lineNum) return;
		// 	});
		// });

		// console.log(`text: ${textContent}, line: ${currLineNum}, pos: ${currPos}`)
		// console.log(`startPos: ${contentStPos}, endPos: ${contentEndPos}`)
	}

	let replacedText = false;
	chunkSentence.map((sentence) => {
		let replacer = "I am the replacer";
		if (replacedText) {
			fileContent = fileContent.replace(sentence.content, replacer);
		}

		replacedText = !replacedText;
	});

	// console.log(fileContent);

	fs.writeFile(fileName, fileContent, (err)=>{
		if (err) {
			console.log(err);
			return
		}
	})
}

// oyoPB5cHgtdqqOwlljUG

processLineByLine(process.cwd() + "/test.html");
