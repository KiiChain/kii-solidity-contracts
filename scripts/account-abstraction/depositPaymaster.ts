import "dotenv/config";
import {
  createPublicClient,
  createWalletClient,
  defineChain,
  formatEther,
  http,
  parseEther,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const entryPointAbi = [
  {
    type: "function",
    name: "depositTo",
    stateMutability: "payable",
    inputs: [{ name: "account", type: "address" }],
    outputs: [],
  },
  {
    type: "function",
    name: "balanceOf",
    stateMutability: "view",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
] as const;

/**
 * Fund the VerifyingPaymaster's EntryPoint deposit so it can sponsor UserOps.
 *
 * Env:
 * - PRIVATE_KEY (required)
 * - RPC_URL (optional; defaults to Oro uno sentry)
 * - DEPOSIT_AMOUNT (optional; default "1" native token)
 * - ENTRY_POINT / VERIFYING_PAYMASTER (optional overrides; else read deployments/oro.json)
 */
async function main() {
  const privateKey = process.env.PRIVATE_KEY;
  if (!privateKey || !privateKey.startsWith("0x")) {
    throw new Error("PRIVATE_KEY must be set (0x-prefixed)");
  }

  const rpcUrl =
    process.env.RPC_URL ??
    "https://json-rpc.uno.sentry.testnet.v3.kiivalidator.com";
  const depositAmount = parseEther(process.env.DEPOSIT_AMOUNT ?? "1");

  const oroPath = path.join(__dirname, "../../deployments/oro.json");
  const deployed = fs.existsSync(oroPath)
    ? (JSON.parse(fs.readFileSync(oroPath, "utf8")) as {
        entryPoint?: string;
        verifyingPaymaster?: string;
      })
    : {};

  const entryPoint = (process.env.ENTRY_POINT ??
    deployed.entryPoint) as `0x${string}` | undefined;
  const verifyingPaymaster = (process.env.VERIFYING_PAYMASTER ??
    deployed.verifyingPaymaster) as `0x${string}` | undefined;

  if (!entryPoint || !verifyingPaymaster) {
    throw new Error(
      "Set ENTRY_POINT and VERIFYING_PAYMASTER or deploy first (deployments/oro.json)",
    );
  }

  const oro = defineChain({
    id: 1336,
    name: "Kiichain Oro",
    nativeCurrency: { name: "Kii", symbol: "KII", decimals: 18 },
    rpcUrls: { default: { http: [rpcUrl] } },
  });

  const account = privateKeyToAccount(privateKey as `0x${string}`);
  const publicClient = createPublicClient({ chain: oro, transport: http(rpcUrl) });
  const walletClient = createWalletClient({
    account,
    chain: oro,
    transport: http(rpcUrl),
  });

  const before = await publicClient.readContract({
    address: entryPoint,
    abi: entryPointAbi,
    functionName: "balanceOf",
    args: [verifyingPaymaster],
  });
  console.log("Deposit before:", formatEther(before), "native");

  const hash = await walletClient.writeContract({
    address: entryPoint,
    abi: entryPointAbi,
    functionName: "depositTo",
    args: [verifyingPaymaster],
    value: depositAmount,
  });
  console.log("depositTo tx:", hash);

  const receipt = await publicClient.waitForTransactionReceipt({ hash });
  console.log("status:", receipt.status);

  const after = await publicClient.readContract({
    address: entryPoint,
    abi: entryPointAbi,
    functionName: "balanceOf",
    args: [verifyingPaymaster],
  });
  console.log("Deposit after:", formatEther(after), "native");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
