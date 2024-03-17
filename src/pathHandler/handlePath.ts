export const CONFIG_NAME = "config.last.json";

export const resolvePath = (path: string = "./"): string => {
	if (/^[a-zA-Z]/.test(path)) path = './'+path;
	if (path.endsWith(".json")) {}
    else if (path.endsWith("/")) path += CONFIG_NAME;
	else path += `/${CONFIG_NAME}`;

	return path;
};
