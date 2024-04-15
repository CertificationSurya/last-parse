# Last-Parse
Last-parse is a versatile package designed to view, suggest corrections, and perform corrections on text content within HTML, EJS, and TXT files. Whether you're dealing with grammatical errors, spelling mistakes, or other textual issues, last-parse provides a seamless solution for enhancing your text content.

# 🔥Disclaimer🔥:
### This package will update your file and there is no going back. Thus, snapshot(git) of all file contents is advised 

## Installation
```node
npm i last-parse
```
---
## Usage
- Create a config.last.json file anywhere, preferred root of your project, and modify following properties as you like. Properties not given are taken from default setting.
- Change package.json. Add script for parse with appropriate destination
- Execute using npm run parse

### config.last.json (default)
```node
// config.last.json
{
    "files": [""],
	"ignoreFolders": ["node_modules", ".git", "lib", "test"],
	"autoReplace": false,
	"languageConfig": "en-US"
}
```

### Config Details:
- #### files : Array  containing file path. /directory/filePath from current working directory. E.g: files: ["./src/*.html", "/**.txt"]
- #### ignoreFolders (doesn't work on glob path) : Array containing file path. /directory/filePath from current working directory. E.g: files: ["./src", "/src/noparse.txt"]
- #### autoReplace: boolean value for, well, autoReplacing content without user confirmation.
- #### languageConfig: String value representing language to parse. [Available-Language](https://api.languagetoolplus.com/v2/languages) [requires longCode]

## Changes to package.json
```node
// package.json
    "scripts" : {
           "parse" : "last-parse pathToYourConfig.last.json"
     }

     // E.g:
     "scripts" : {
           "parse" : "last-parse ./"
     }
``` 


## To Execute: (locally)
```node
npm run parse
```
## To Execute: (globally)
```node
npm i -g last-parse
last-parse [filePath]
```
---


## Features
- Use the package manager [npm](https://www.npmjs.com/) to install last-parse.
- Supports parsing and correction of text content within HTML, EJS, and TXT files.
- Identifies grammatical errors, spelling mistakes, and other textual issues.
- Provides suggestions for correcting identified errors.
- Allows for easy integration into your existing projects.
- Simple to use, with intuitive functions for parsing and correcting text.

## Contributing
*** Star to the Repo is highly appreciated. ***

Provide suggestion by opening an issue.
Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[MIT](https://choosealicense.com/licenses/mit/)