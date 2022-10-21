// this file compiles our solidity contract and generated abi and bytecode
// abi helps to interact with contract through our javascript in web page
// byte code is used to deploy our contract to network

const path = require("path"); // used to build path from current compile.js file to Campaign contract
const solc = require("solc"); // file system used to access files
const fs = require("fs-extra");

const buildPath = path.resolve(__dirname, "build");
fs.removeSync(buildPath); // delete folder

const campaignPath = path.resolve(__dirname, "contracts", "Campaign.sol"); // generate path to campaign.sol
const source = fs.readFileSync(campaignPath, "utf8"); // read reaw contents of file

const input = {
  language: "Solidity",
  sources: {
    "Campaign.sol": {
      content: source,
    },
  },
  settings: {
    outputSelection: {
      "*": {
        "*": ["*"],
      },
    },
  },
};

const output = JSON.parse(solc.compile(JSON.stringify(input))).contracts[
  "Campaign.sol"
];

fs.ensureDirSync(buildPath); // make folder


for (let contract in output) { // for in loop is used to iterate through keys of objects
  fs.outputJsonSync( // output jsonsync make json file
    path.resolve(buildPath, contract.replace(":", "") + ".json"),
    output[contract]
  );
}
