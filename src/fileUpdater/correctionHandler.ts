import {Language} from "../configTypeAndDefaults";

// Types
type params = {
	language: Language;
	text: string;
};
export type correctorRetType = {
    // consoleText: string,
    // consoleErr: string,
	text: string;
};

// Implementations
const query = function (args: params) {
	return (
		"?" +
		Object.entries(args)
			.map(([key, value]) => {
				return key + "=" + (Array.isArray(value) ? value.join(",") : value);
			})
			.join("&")
	);
};

async function corrector(params: params) {
	const url = encodeURI(
		"https://languagetool.org/api/v2/check" + query(params)
	);
	const options = {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		},
	};

	try {
		const res = await fetch(url, options);
		const data = await res.json(); // Assuming the response is JSON
		return data;
	} catch (error) {
		console.error("Error:", error);
	}
}


export const handleCorrection = async (
	text: string,
	language: Language
): Promise<correctorRetType> => {
	const params:params = {language, text};
	const res = await corrector(params);
	const errorText = text;
    let shiftAfterUpdate = 0;

	for (const match of res.matches) {
        const [stIdx, endIndex, replacement] = [match.offset+shiftAfterUpdate, match.offset+match.length + shiftAfterUpdate, match.replacements[0]?.value||""];

        if (replacement){
            text = replaceText(text, stIdx, endIndex, replacement);
        }
        shiftAfterUpdate = text.length - errorText.length;
	}

	return {text};
};

const replaceText = (
	sentence: string,
	offset: number,
	endIndex: number,
	replacement: string,
): string => {
	return sentence.substring(0, offset) +
		replacement +
		sentence.substring(endIndex);
};
