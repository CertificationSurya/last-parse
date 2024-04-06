import * as fs from "fs";
import {SentenceDetails} from "../../src/detailsHolder/sentenceDetails";
import confirm from "@inquirer/confirm";
import {handleCorrection} from "./correctionHandler";
import {configType} from "../configTypeAndDefaults";

export async function updateFile(fileName: string, userConfig: configType) {
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

	for (const sentence of chunkSentence) {
		// TODO: Checking of each sentence and words and provide feedback accordingly
		const replacer: string = await handleCorrection(
			sentence.content,
			userConfig.languageConfig
		);

		console.log(sentence.content + "  =>  " + replacer);
		if (!userConfig.autoReplace) {
			// asks user to can i replace.
			const canReplace: boolean = await confirm({
				message: "Contradict the sentence? ",
			});

			if (canReplace) {
				fileContent[sentence.lineNum - 1] = fileContent[
					sentence.lineNum - 1
				].replace(sentence.content, replacer);
			}
			console.clear();
		} else {
			fileContent[sentence.lineNum - 1] = fileContent[
				sentence.lineNum - 1
			].replace(sentence.content, replacer);
		}
	}

	fs.writeFile(fileName, fileContent.join("\n"), (err) => {
		if (err) {
			console.log(err);
		}
	});
}

// updateFile(process.cwd() + "/test.html", {} as DetailsHolder);
