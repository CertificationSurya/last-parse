import * as functionType from "../src/pathHandler/handlePath";
import {CONFIG_NAME} from "../src/pathHandler/handlePath";

// extra fixture to support functionType
const {resolvePath} = jest.requireActual<typeof functionType>("../src/pathHandler/handlePath.ts");

describe("Test user given file name", () => {
	let resultPath: string;
	// beforeEach(() => {
	// 	resultPath = "";
	// });

	it("should automatically add fileName and extension and returns", () => {
		// arrange
		// act
		resultPath = resolvePath("./");
		// assert
		expect(resultPath).toMatch("./" + CONFIG_NAME);
	});

	it("should automatically return config name with current file scope", () => {
        // no path is given
		resultPath = resolvePath();
		expect(resultPath).toMatch('./' + CONFIG_NAME);
	});

	it("should automatically config name with extension and returns", () => {
        const userPath = "./configs/"
		resultPath = resolvePath(userPath);
		expect(resultPath).toMatch(userPath + CONFIG_NAME);
	});

    // when complete path and filename.json is present 
	it("should return user path", () => {
        const userPath = "./configs/data.json";
		resultPath = resolvePath(userPath);
		expect(resultPath).toMatch(userPath);
	});
});
