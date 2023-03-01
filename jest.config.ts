import type { Config } from "@jest/types";

// Sync object
const config: Config.InitialOptions = {
  verbose: true,
  testEnvironment: "node",
  preset: "ts-jest",
  transform: {
    "^.+\\.(t|j)sx?$": "@swc/jest",
    // "^.+\\.(ts|tsx)?$": "ts-jest",
    // "^.+\\.(js|jsx)$": "babel-jest",
  },
  transformIgnorePatterns: ["/server/node_modules"],
  moduleFileExtensions: [
    "ts",
    "tsx",
    "d.ts",
    "json",
    "js",
    "mjs",
    "cjs",
    "jsx",
    "node",
  ],
};
export default config;
