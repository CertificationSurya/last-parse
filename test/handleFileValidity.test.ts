import * as functionType from "../src/pathHandler/handleFileValidity";

// extra fixture to support functionType
const {isDirectory, isSupported, containsGlob} = jest.requireActual<typeof functionType>(
	"../src/pathHandler/handleFileValidity.ts"
);

describe("Test user given file name", () => {
	let resultantValue: boolean;

	describe("isDirectory Check", () => {
		// no real directory is provided
		it("should return false", () => {
			resultantValue = isDirectory("/hello");
			expect(resultantValue).toBeFalsy();
		});
		// real directory is provided
		it("should return true", () => {
			resultantValue = isDirectory("./src");
			expect(resultantValue).toBeTruthy();
		});
		// file is provided instead of directory
		it("should return false", () => {
			resultantValue = isDirectory("/index.html");
			expect(resultantValue).toBeFalsy();
		});
	});

	describe("isSupported (file) Check", () => {
		// directory is provided instead of filename
		it("should return false", () => {
			resultantValue = isSupported("/hello");
			expect(resultantValue).toBeFalsy();
		});
		// valid file format is provided
		it("should return true", () => {
			resultantValue = isSupported("/src/test.html");
			expect(resultantValue).toBeTruthy();
		});
		// invalid file format is provided
		it("should return false", () => {
			resultantValue = isSupported("/index.ts");
			expect(resultantValue).toBeFalsy();
		});
	});

	describe("does path contains glob or not", ()=> {
		it("should return true", ()=>{
			expect(containsGlob("/src/*.html")).toBeTruthy();
		})
		it("should return false", ()=>{
			expect(containsGlob("/src/index.html")).toBeFalsy();;
		})
		it("should return true", ()=>{
			expect(containsGlob("/src/**/*.html")).toBeTruthy();
		})
	})
});
