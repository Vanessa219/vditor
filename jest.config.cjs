/** @type {import("jest").Config} */
module.exports = {
    coveragePathIgnorePatterns: ["/src/js/"],
    testTimeout: 30000,
    transform: {
        "^.+\\.tsx?$": ["ts-jest", {
            tsconfig: "tsconfig.test.json",
        }],
    },
};
