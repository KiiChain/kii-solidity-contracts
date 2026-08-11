import "dotenv/config";
import hre from "hardhat";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import VerifyingPaymasterModule from "../../ignition/modules/VerifyingPaymaster";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Deploy EntryPoint v0.7 + VerifyingPaymaster to the configured Hardhat network
 * (default: kiichain / Oro testnet chain id 1336).
 *
 * Env:
 * - VERIFYING_SIGNER (optional): paymaster verifying key address; defaults to deployer
 * - Writes deployments/oro.json when chain id is 1336
 */
async function main() {
  const networkName = process.env.HARDHAT_NETWORK ?? "kiichain";
  const verifyingSigner = process.env.VERIFYING_SIGNER as `0x${string}` | undefined;

  const connection = await hre.network.connect({ network: networkName });
  const parameters = verifyingSigner
    ? { VerifyingPaymasterModule: { verifyingSigner } }
    : undefined;

  const result = await connection.ignition.deploy(VerifyingPaymasterModule, {
    displayUi: true,
    parameters,
  });

  const entryPoint = result.entryPoint.address as string;
  const verifyingPaymaster = result.verifyingPaymaster.address as string;

  console.log("EntryPoint:", entryPoint);
  console.log("VerifyingPaymaster:", verifyingPaymaster);
  if (verifyingSigner) {
    console.log("verifyingSigner:", verifyingSigner);
  }

  const chainId = Number(
    await connection.provider.request({ method: "eth_chainId" }),
  );

  if (chainId === 1336) {
    const outPath = path.join(__dirname, "../../deployments/oro.json");
    const payload = {
      chainId: 1336,
      name: "oro",
      entryPoint,
      verifyingPaymaster,
      verifyingSigner: verifyingSigner ?? null,
      deployedAt: new Date().toISOString(),
    };
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, `${JSON.stringify(payload, null, 2)}\n`);
    console.log("Wrote", outPath);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
