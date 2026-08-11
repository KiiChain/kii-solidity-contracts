// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {IEntryPoint} from "@account-abstraction/contracts/interfaces/IEntryPoint.sol";
import {SimpleAccountFactory as SimpleAccountFactoryV07} from "@account-abstraction/contracts/samples/SimpleAccountFactory.sol";

/// @dev Deployable SimpleAccountFactory for Oro paymaster smoke tests.
contract SimpleAccountFactory is SimpleAccountFactoryV07 {
    constructor(IEntryPoint entryPoint) SimpleAccountFactoryV07(entryPoint) {}
}
