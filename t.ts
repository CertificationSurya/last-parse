import * as fs from "fs";
import * as readline from "node:readline";
import languageTool from "languagetool-api"

async function processLineByLine(fileName: string) {
	const fileStream = fs.createReadStream(fileName);
	const readLine = readline.createInterface({
		input: fileStream,
		crlfDelay: Infinity,
	});

	let count = 0;
	for await (const line of readLine) {
		const currLine = line.split("");

		let textContent = "";
		let brackets = false;
		for (let char of currLine) {
			if (char === "<") brackets = true;
			else if (char === ">") {
				brackets = false;
				continue;
			}
			if (!brackets) {
				if (textContent != "") {
					textContent += char;
				} else textContent += /\s/.test(char) ? "" : char;
			}
		}

		// language processor: TODO

		// let params = {
		// 	language: "en-US",
		// 	text: "I go to shcool",
		// };

		// languageTool.check(params, function (err:unknown, res:object) {
		// 	if (err) {
		// 		console.log(err);
		// 	} else {
		// 		const response = res.matches[0];
		// 		let replacableText = response.context.text.substring(
		// 			response.context.offset,
		// 			response.context.offset + response.context.length
		// 		);
		// 		console.log("Replaceable text:", replacableText);
		// 		console.log("Replacement:", response.replacements[0].value);
		// 		const correctedText = response.context.text.replace(
		// 			replacableText,
		// 			response.replacements[0].value
		// 		);
		// 		console.log("Corrected text:", correctedText);
		// 	}
		// });

		console.log(textContent, count++);
	}
}

processLineByLine(process.cwd() + "/test.html");
