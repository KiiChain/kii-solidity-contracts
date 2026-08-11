import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

/**
 * Deploys EntryPoint v0.7 and a VerifyingPaymaster for Oro / Kiichain EVM.
 *
 * Parameters (via Ignition):
 * - verifyingSigner: address whose ECDSA signatures the paymaster accepts
 *   (the hot key held by the paymaster RPC). Defaults to the deployer.
 */
const VerifyingPaymasterModule = buildModule("VerifyingPaymasterModule", (m) => {
  const verifyingSigner = m.getParameter("verifyingSigner", m.getAccount(0));

  const entryPoint = m.contract("EntryPoint");
  const verifyingPaymaster = m.contract("VerifyingPaymaster", [
    entryPoint,
    verifyingSigner,
  ]);

  return { entryPoint, verifyingPaymaster };
});

export default VerifyingPaymasterModule;
