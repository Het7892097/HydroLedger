import hre from "hardhat";

async function main() {
  console.log("🛠️  Compiling contracts...");
  await hre.run("compile");

  // 1. Get the contract factory
  const Factory = await hre.ethers.getContractFactory("GreenHydrogenCredit");

  console.log("🚀 Deploying GreenHydrogenCredit...");

  // 2. Deploy the contract
  const instance = await Factory.deploy(
    /* constructor args if any, e.g. "arg1", 123 */
  );

  // 3. Wait for deployment to finish
  await instance.deployed();

  console.log(`🎉 Deployed at address: ${instance.address}`);

  // 4. Print the deployment transaction hash
  const tx = instance.deployTransaction;
  if (tx) {
    console.log(`📄 Deployment tx hash: ${tx.hash}`);
  } else {
    console.log("Could not get deployment transaction hash.");
  }
}

main().catch((error) => {
  console.error("❌ Deployment failed:", error);
  process.exitCode = 1;
});

