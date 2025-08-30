const fs = require("fs");
const path = require("path");

async function main() {
  const artifactPath = path.join(__dirname, "artifacts/contracts/GreenHydrogenCredit.sol/GreenHydrogenCredit.json");
  const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));

  const contractData = {
    abi: artifact.abi,
    bytecode: artifact.bytecode
  };

  fs.writeFileSync("contract.json", JSON.stringify(contractData, null, 2));
  console.log("✅ Exported ABI + Bytecode to contract.json");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
