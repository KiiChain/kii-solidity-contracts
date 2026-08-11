// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {IEntryPoint} from "@account-abstraction/contracts/interfaces/IEntryPoint.sol";
import {VerifyingPaymaster as VerifyingPaymasterV07} from "@account-abstraction/contracts/samples/VerifyingPaymaster.sol";

/// @dev Local deployable VerifyingPaymaster (ERC-4337 v0.7) for Kiichain / Oro.
/// Sponsorship policy (kill switch, blocklist) is enforced off-chain by the paymaster RPC
/// that holds `verifyingSigner`; this contract only checks that signature + deposit.
contract VerifyingPaymaster is VerifyingPaymasterV07 {
    constructor(
        IEntryPoint entryPoint,
        address verifyingSigner
    ) VerifyingPaymasterV07(entryPoint, verifyingSigner) {}
}
