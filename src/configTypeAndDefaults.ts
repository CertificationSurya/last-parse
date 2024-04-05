export interface configType {
	files: string[];
	ignoreFolders: string[];
	showUpdate: boolean,
    autoReplace: boolean,
	api_key: string;
}

export const defaultConfigs: configType = {
	files: [''],
	ignoreFolders: ["node_modules", ".git", "lib", "test"],
	autoReplace: false,
	api_key: '',
	showUpdate: true
}