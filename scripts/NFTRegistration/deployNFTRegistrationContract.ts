import hre from "hardhat";
import NFTRegistrationModule from "../../ignition/modules/NFTRegistration";

async function main() {
  const connection = await hre.network.connect({ network: "kiichain" });
  await connection.ignition.deploy(NFTRegistrationModule, { displayUi: true });
}

main().catch(console.error);
