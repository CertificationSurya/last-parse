import { Language } from "../configTypeAndDefaults";


type params = {
    language: Language,
    text: string
}


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
    const url = encodeURI("https://languagetool.org/api/v2/check" + query(params));
    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    };
    
    try {
        const res = await fetch(url, options);
        const data = await res.json(); // Assuming the response is JSON
        return data;
    } catch (error) {
        console.error('Error:', error);
    }
}


export const handleCorrection = async(text: string, language: Language) : Promise<string> => {
    const params = {language, text};
    const res = await corrector(params);
    
    let tempText = text;
    for (const match of res.matches){
        const errText = tempText.substring(match.offset, match.offset+match.length)
        text = text.replace(errText, match.replacements[0].value)
    }

    return text;
}
