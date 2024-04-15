import * as functionType from "../src/pathHandler/globImplementation";

const {recurseToFileMain} = jest.requireActual<typeof functionType>(
	"../src/pathHandler/globImplementation.ts"
);

describe("Test user given file name", () => {
	const ignoreFolders = ["node_modules", "lib", "test", ".git"];

	describe("globImplementation Check", () => {
		const prependCwd = (inputPaths: string[], expectedFiles: string[]) => {
			const rootPath = process.cwd();
			inputPaths = inputPaths.map((paths) => rootPath + paths);
			expectedFiles = expectedFiles.map((paths) => rootPath + paths);
			return [inputPaths, expectedFiles];
		};

		test.each([
			// add root Path to the input and expected files
			prependCwd(
				["/**/*.html"],
				["/pathTest/layer-1.html", "/pathTest/layer-1A.html", "/pathTest/test.html"]
			),
			prependCwd(["/*.html"], []),
			prependCwd(["/**/invalidFolder/*.html"], []),
			prependCwd(
				["/**/layer2/**/*.html"],
				[
					"/pathTest/layer2/layer-2.html",
					"/pathTest/layer2/layer-2A.html",
					"/pathTest/layer2/layer3/layer-3.html",
					"/pathTest/layer2/layer3/layer-3A.html",
				]
			),
		])(
			"should return matching HTML files for path: %s",
			(inputPaths, expectedFiles) => {
				expect(recurseToFileMain(inputPaths)).toEqual(
					expectedFiles
				);
			}
		);
	});
});
