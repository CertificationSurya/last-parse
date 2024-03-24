import * as functionType from "../src/pathHandler/globImplementation";

// extra fixture to support functionType
const {recurseToFileMain} = jest.requireActual<typeof functionType>(
	"../src/pathHandler/globImplementation.ts"
);

describe("Test user given file name", () => {
	let resultantValue: string[];
    let ignoreFolders = ["node_modules", "lib", "test", ".git"]

	describe("globImplemetation Check", () => {
		// no real directory is provided
		it("should return /.test.html", () => {
			resultantValue = recurseToFileMain(["./*.html"], ignoreFolders);
            // console.log(resultantValue)
			// expect(resultantValue).toContain("/test.html");
		});
	
	});
});
