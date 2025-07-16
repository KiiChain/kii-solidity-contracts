import "dotenv/config";
import {
  defineChain,
  http,
  createPublicClient,
  createWalletClient,
  parseGwei
} from "viem";
import bankAbi from "./abi/bank.json";
import { privateKeyToAccount } from "viem/accounts";
import * as fs from "fs";

const testnet = defineChain({
  id: 123454321,
  name: "Kiichain Tesnet",
  nativeCurrency: { name: "kii", symbol: "kii", decimals: 18 },
  rpcUrls: {
    default: {
      http: ["https://a.sentry.testnet.kiivalidator.com:8645"],
    },
  },
  blockExplorers: {
    default: {
      name: "Kiichain Testnet",
      url: "https://app.kiiglobal.io/kiichain",
      apiUrl: "",
    },
  },
  contracts: {},
});

const publicClient = createPublicClient({
  chain: testnet,
  transport: http(),
});

export const walletClient = createWalletClient({
  chain: testnet,
  transport: http(),
});

const account = privateKeyToAccount(
  (process.env.PRIVATE_KEY as `0x${string}`) || ""
);

async function main() {
  try {
    const { request } = await publicClient.simulateContract({
      account: account,
      address: "0x4381dC2aB14285160c808659aEe005D51255adD7",
      abi: bankAbi,
      functionName: "send",
      args: [
        "0xF948f57612E05320A6636a965cA4fbaed3147A0f",
        [
          {
            denom: "tkii",
            amount: 1699900000 * 10 ** 6,
          },
        ],
      ],
      gasPrice: parseGwei('50'),  
    });
    const hash = await walletClient.writeContract(request);
    const transaction = await publicClient.waitForTransactionReceipt({
      hash: hash,
    });
    return transaction;
  } catch (err) {
    console.log(err);
  }
}

main()
  .then((transaction) => console.log(transaction))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
