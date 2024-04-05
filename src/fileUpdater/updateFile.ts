import * as fs from "fs";
import * as readline from "node:readline";
import {SentenceDetails} from "../../src/detailsHolder/sentenceDetails";
import {DetailsHolder} from "../detailsHolder/holdDetails";
import confirm from "@inquirer/confirm"

async function updateFile(fileName: string, details: DetailsHolder) {
	const chunkSentence: SentenceDetails[] = [];
	const fileContent: string[] = [];

	const fileDatas = fs.readFileSync(fileName).toString().split("\n");

	let inBrackets = false;
	let storeStartPos = true;
	let contentStPos = -1;
	let contentEndPos = -1;
	let lineNum = 0;

	for await (const line of fileDatas) {
		lineNum++;
		const currLine = line.split("");
		let textContent = "";
		fileContent.push(line);

		for (let currPos = 0; currPos < currLine.length; currPos++) {
			const char = currLine[currPos];

			if (char === "<") {
				inBrackets = true;
				contentEndPos = currPos - 1;
				if (textContent) {
					chunkSentence.push(
						new SentenceDetails(
							textContent,
							contentStPos,
							contentEndPos,
							lineNum
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
	}

	chunkSentence.forEach(async (sentence) => {
		// TODO: Checking of each sentence and words and provide feedback accordingly
		const replacer = "I am the replacer";
		const canReplace = true;
		// if (!details.userConfig.autoReplace){
		// 	// asks user to can i replace.
		// }

		if (canReplace) {
			fileContent[sentence.lineNum - 1] = fileContent[
				sentence.lineNum - 1
			].replace(sentence.content, replacer);
		}
		// console.log(sentence)
		// console.log(sentence.content)
		// console.log(fileContent[sentence.lineNum-1].replace(sentence.content, replacer))
	});

	// console.log(fileContent)

	fs.writeFile(fileName, fileContent.join("\n"), (err) => {
		if (err) {
			console.log(err);
		}
	});
}

export {updateFile};

updateFile(process.cwd() + "/test.html", {} as DetailsHolder);
