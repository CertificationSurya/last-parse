export interface configType {
	files: string[];
	ignoreFolders: string[];
    autoReplace: boolean
}

export const defaultConfigs: configType = {
	files: [''],
	ignoreFolders: ["node_modules", ".git", "lib", "test"],
	autoReplace: false,
}