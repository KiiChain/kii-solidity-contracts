import { defineConfig } from "@wagmi/cli";
import NFTRegistrationAbi from "./artifacts/contracts/NFTRegistration.sol/NFTRegistration.json";
import { Abi } from "viem";
import { react } from "@wagmi/cli/plugins";

export default defineConfig({
  out: "src/generated.ts",
  contracts: [
    {
      name: "NFTRegistration",
      abi: NFTRegistrationAbi.abi as Abi,
    },
  ],
  plugins: [react()],
});
