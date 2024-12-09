/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require("fs");
const path = require("path");

const typesFilePath = path.resolve("node_modules/@types/autosuggest-highlight/index.d.ts");

const dtsFakeContent = `
declare module 'autosuggest-highlight' {
  // Declare a dummy function to let ts compile the module
  export function dummyFunction(): void;
}
`;

// Check if the file exists, and write new content if it does
fs.writeFileSync(typesFilePath, dtsFakeContent, "utf8");
