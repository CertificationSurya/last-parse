export type Language = "ar"|"ast-ES"|"be-BY"|"br-FR"|"ca-ES"|"ca-ES-valencia"|"ca-ES-balear"|"zh-CN"|"crh-UA"|"da-DK"|"de"|"de-DE"|"de-AT"|"de-CH"|"de-DE-x-simple-language"|"el-GR"|"en"|"en-US"|"en-GB"|"en-AU"|"en-CA"|"en-NZ"|"en-ZA"|"eo"|"es"|"es-AR"|"fa"|"fr"|"fr-CA"|"fr-CH"|"fr-BE"|"ga-IE"|"gl-ES"|"it"|"ja-JP"|"km-KH"|"nl"|"nl-BE"|"pl-PL"|"pt"|"pt-AO"|"pt-PT"|"pt-BR"|"pt-MZ"|"ro-RO"|"ru-RU"|"sk-SK"|"sl-SI"|"sv"|"ta-IN"|"tl-PH"|"uk-UA"

export interface configType {
	files: string[];
	ignoreFolders: string[];
	showUpdate: boolean;
	autoReplace: boolean;
	api_key: string;
	languageConfig: Language;
}

export const defaultConfigs: configType = {
	files: [""],
	ignoreFolders: ["node_modules", ".git", "lib", "test"],
	autoReplace: false,
	api_key: "",
	showUpdate: true,
	languageConfig: "en-US",
};
