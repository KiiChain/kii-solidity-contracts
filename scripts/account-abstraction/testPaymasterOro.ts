import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  concatHex,
  createPublicClient,
  createWalletClient,
  defineChain,
  encodeAbiParameters,
  encodeFunctionData,
  formatEther,
  getContract,
  http,
  numberToHex,
  parseEther,
  type Address,
  type Hex,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";

import entryPointArtifact from "../../artifacts/contracts/account-abstraction/EntryPoint.sol/EntryPoint.json" with { type: "json" };
import verifyingPaymasterArtifact from "../../artifacts/contracts/account-abstraction/VerifyingPaymaster.sol/VerifyingPaymaster.json" with { type: "json" };
import simpleAccountFactoryArtifact from "../../artifacts/contracts/account-abstraction/SimpleAccountFactory.sol/SimpleAccountFactory.json" with { type: "json" };

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const ORO_RPC =
  process.env.RPC_URL ??
  "https://json-rpc.uno.sentry.testnet.v3.kiivalidator.com";

type OroDeployment = {
  chainId: number;
  name: string;
  entryPoint: string | null;
  verifyingPaymaster: string | null;
  verifyingSigner: string | null;
  simpleAccountFactory?: string | null;
  deployedAt?: string;
};

type PackedUserOperation = {
  sender: Address;
  nonce: bigint;
  initCode: Hex;
  callData: Hex;
  accountGasLimits: Hex;
  preVerificationGas: bigint;
  gasFees: Hex;
  paymasterAndData: Hex;
  signature: Hex;
};

function packUint128Pair(high: bigint, low: bigint): Hex {
  return concatHex([
    numberToHex(high, { size: 16 }),
    numberToHex(low, { size: 16 }),
  ]);
}

function loadDeployment(): OroDeployment {
  const oroPath = path.join(__dirname, "../../deployments/oro.json");
  if (!fs.existsSync(oroPath)) {
    throw new Error(
      "Missing deployments/oro.json — run yarn deploy:paymaster first",
    );
  }
  return JSON.parse(fs.readFileSync(oroPath, "utf8")) as OroDeployment;
}

function saveDeployment(deployment: OroDeployment) {
  const oroPath = path.join(__dirname, "../../deployments/oro.json");
  fs.writeFileSync(oroPath, `${JSON.stringify(deployment, null, 2)}\n`);
}

/**
 * Oro testnet smoke test for EntryPoint + VerifyingPaymaster sponsorship.
 *
 * Prerequisites:
 * - yarn deploy:paymaster (fills deployments/oro.json)
 * - yarn deposit:paymaster (or this script deposits a small amount)
 *
 * Env:
 * - PRIVATE_KEY: funded EOA (pays outer handleOps gas; can also be account owner)
 * - VERIFYING_SIGNER_KEY: key matching paymaster verifyingSigner (defaults to PRIVATE_KEY)
 * - RPC_URL: optional Oro RPC override
 */
async function main() {
  const privateKey = process.env.PRIVATE_KEY;
  if (!privateKey?.startsWith("0x")) {
    throw new Error("PRIVATE_KEY must be set (0x-prefixed)");
  }
  const verifyingSignerKey = (process.env.VERIFYING_SIGNER_KEY ??
    privateKey) as `0x${string}`;

  const deployment = loadDeployment();
  if (!deployment.entryPoint || !deployment.verifyingPaymaster) {
    throw new Error(
      "deployments/oro.json missing entryPoint/verifyingPaymaster — run yarn deploy:paymaster",
    );
  }

  const entryPointAddress = deployment.entryPoint as Address;
  const paymasterAddress = deployment.verifyingPaymaster as Address;

  const oro = defineChain({
    id: 1336,
    name: "Kiichain Oro",
    nativeCurrency: { name: "Kii", symbol: "KII", decimals: 18 },
    rpcUrls: { default: { http: [ORO_RPC] } },
  });

  const owner = privateKeyToAccount(privateKey as `0x${string}`);
  const verifyingSigner = privateKeyToAccount(verifyingSignerKey);
  const publicClient = createPublicClient({ chain: oro, transport: http(ORO_RPC) });
  const walletClient = createWalletClient({
    account: owner,
    chain: oro,
    transport: http(ORO_RPC),
  });

  console.log("Network: Oro (1336)");
  console.log("Owner / bundler:", owner.address);
  console.log("Verifying signer:", verifyingSigner.address);
  console.log("EntryPoint:", entryPointAddress);
  console.log("VerifyingPaymaster:", paymasterAddress);

  const [epCode, pmCode] = await Promise.all([
    publicClient.getCode({ address: entryPointAddress }),
    publicClient.getCode({ address: paymasterAddress }),
  ]);
  if (!epCode || epCode === "0x") {
    throw new Error("EntryPoint has no code on Oro");
  }
  if (!pmCode || pmCode === "0x") {
    throw new Error("VerifyingPaymaster has no code on Oro");
  }
  console.log("✓ bytecode present for EntryPoint + VerifyingPaymaster");

  const paymaster = getContract({
    address: paymasterAddress,
    abi: verifyingPaymasterArtifact.abi,
    client: { public: publicClient, wallet: walletClient },
  });
  const entryPoint = getContract({
    address: entryPointAddress,
    abi: entryPointArtifact.abi,
    client: { public: publicClient, wallet: walletClient },
  });

  const onchainSigner = (await paymaster.read.verifyingSigner()) as Address;
  if (onchainSigner.toLowerCase() !== verifyingSigner.address.toLowerCase()) {
    throw new Error(
      `VERIFYING_SIGNER_KEY address ${verifyingSigner.address} != on-chain verifyingSigner ${onchainSigner}`,
    );
  }
  console.log("✓ verifyingSigner matches VERIFYING_SIGNER_KEY");

  let deposit = (await entryPoint.read.balanceOf([paymasterAddress])) as bigint;
  console.log("Paymaster deposit:", formatEther(deposit), "native");
  const minDeposit = parseEther(process.env.MIN_DEPOSIT ?? "0.05");
  if (deposit < minDeposit) {
    const topUp = parseEther(process.env.DEPOSIT_AMOUNT ?? "0.2");
    console.log(`Deposit low — topping up ${formatEther(topUp)}…`);
    const hash = await entryPoint.write.depositTo([paymasterAddress], {
      value: topUp,
    });
    await publicClient.waitForTransactionReceipt({ hash });
    deposit = (await entryPoint.read.balanceOf([paymasterAddress])) as bigint;
    console.log("Paymaster deposit after top-up:", formatEther(deposit));
  }
  console.log("✓ paymaster has EntryPoint deposit");

  // Deploy factory if needed (for this smoke test only).
  let factoryAddress = deployment.simpleAccountFactory as Address | null | undefined;
  if (factoryAddress) {
    const code = await publicClient.getCode({ address: factoryAddress });
    if (!code || code === "0x") factoryAddress = null;
  }
  if (!factoryAddress) {
    console.log("Deploying SimpleAccountFactory…");
    const hash = await walletClient.deployContract({
      abi: simpleAccountFactoryArtifact.abi,
      bytecode: simpleAccountFactoryArtifact.bytecode as Hex,
      args: [entryPointAddress],
    });
    const receipt = await publicClient.waitForTransactionReceipt({ hash });
    if (!receipt.contractAddress) {
      throw new Error("SimpleAccountFactory deploy failed");
    }
    factoryAddress = receipt.contractAddress;
    deployment.simpleAccountFactory = factoryAddress;
    saveDeployment(deployment);
    console.log("SimpleAccountFactory:", factoryAddress);
  } else {
    console.log("SimpleAccountFactory:", factoryAddress);
  }

  const factory = getContract({
    address: factoryAddress,
    abi: simpleAccountFactoryArtifact.abi,
    client: { public: publicClient, wallet: walletClient },
  });

  const salt = BigInt(process.env.ACCOUNT_SALT ?? "0");
  const sender = (await factory.read.getAddress([
    owner.address,
    salt,
  ])) as Address;
  const senderCode = await publicClient.getCode({ address: sender });
  const needsInit = !senderCode || senderCode === "0x";

  console.log("Smart account (counterfactual):", sender);
  console.log("Needs initCode:", needsInit);

  const senderBalanceBefore = await publicClient.getBalance({ address: sender });
  console.log(
    "Smart account native balance:",
    formatEther(senderBalanceBefore),
  );

  const initCode: Hex = needsInit
    ? concatHex([
        factoryAddress,
        encodeFunctionData({
          abi: simpleAccountFactoryArtifact.abi,
          functionName: "createAccount",
          args: [owner.address, salt],
        }),
      ])
    : "0x";

  // No-op call: execute(self, 0, empty) — proves sponsorship without transferring value.
  const callData = encodeFunctionData({
    abi: [
      {
        type: "function",
        name: "execute",
        stateMutability: "nonpayable",
        inputs: [
          { name: "dest", type: "address" },
          { name: "value", type: "uint256" },
          { name: "func", type: "bytes" },
        ],
        outputs: [],
      },
    ],
    functionName: "execute",
    args: [sender, 0n, "0x"],
  });

  const verificationGasLimit = 500_000n;
  const callGasLimit = 200_000n;
  const preVerificationGas = 100_000n;
  const maxPriorityFeePerGas = 1_000_000_000n; // 1 gwei
  const maxFeePerGas = 2_000_000_000n; // 2 gwei
  const paymasterVerificationGasLimit = 100_000n;
  const paymasterPostOpGasLimit = 50_000n;

  const accountGasLimits = packUint128Pair(verificationGasLimit, callGasLimit);
  const gasFees = packUint128Pair(maxPriorityFeePerGas, maxFeePerGas);

  const nonce = (await entryPoint.read.getNonce([sender, 0n])) as bigint;

  const validAfter = 0;
  const validUntil = Math.floor(Date.now() / 1000) + 3600;
  const paymasterGasExtents = packUint128Pair(
    paymasterVerificationGasLimit,
    paymasterPostOpGasLimit,
  );
  const timeRange = encodeAbiParameters(
    [{ type: "uint48" }, { type: "uint48" }],
    [validUntil, validAfter],
  );

  // Placeholder paymasterAndData (signature filled after getHash).
  let paymasterAndData: Hex = concatHex([
    paymasterAddress,
    paymasterGasExtents,
    timeRange,
    // 65-byte dummy sig so getHash gas-window slice is stable
    `0x${"00".repeat(65)}` as Hex,
  ]);

  let userOp: PackedUserOperation = {
    sender,
    nonce,
    initCode,
    callData,
    accountGasLimits,
    preVerificationGas,
    gasFees,
    paymasterAndData,
    signature: "0x",
  };

  const paymasterHash = (await paymaster.read.getHash([
    userOp,
    validUntil,
    validAfter,
  ])) as Hex;
  const paymasterSig = await verifyingSigner.signMessage({
    message: { raw: paymasterHash },
  });
  paymasterAndData = concatHex([
    paymasterAddress,
    paymasterGasExtents,
    timeRange,
    paymasterSig,
  ]);
  userOp = { ...userOp, paymasterAndData };

  const userOpHash = (await entryPoint.read.getUserOpHash([userOp])) as Hex;
  const accountSig = await owner.signMessage({
    message: { raw: userOpHash },
  });
  userOp = { ...userOp, signature: accountSig };

  console.log("Submitting handleOps (sponsored UserOp)…");
  const depositBefore = (await entryPoint.read.balanceOf([
    paymasterAddress,
  ])) as bigint;

  const txHash = await entryPoint.write.handleOps([
    [userOp],
    owner.address,
  ]);
  console.log("handleOps tx:", txHash);
  const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash });
  if (receipt.status !== "success") {
    throw new Error(`handleOps failed: ${txHash}`);
  }

  const depositAfter = (await entryPoint.read.balanceOf([
    paymasterAddress,
  ])) as bigint;
  const senderCodeAfter = await publicClient.getCode({ address: sender });
  const senderBalanceAfter = await publicClient.getBalance({ address: sender });

  console.log("✓ handleOps succeeded");
  console.log("Smart account code after:", senderCodeAfter && senderCodeAfter !== "0x" ? "deployed" : "missing");
  console.log(
    "Smart account balance after:",
    formatEther(senderBalanceAfter),
    "(should stay ~0 if fully sponsored)",
  );
  console.log(
    "Paymaster deposit delta:",
    formatEther(depositBefore - depositAfter),
    "native spent from deposit",
  );

  if (!senderCodeAfter || senderCodeAfter === "0x") {
    throw new Error("Smart account was not deployed");
  }
  if (depositAfter >= depositBefore) {
    throw new Error("Paymaster deposit did not decrease — sponsorship may not have paid");
  }

  console.log("\nSmoke test passed on Oro testnet.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
