// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Cosmos} from "./libraries/Cosmos.sol";

/**
 * @dev This contract uses types in the Cosmos library.
 */
contract CosmosTypes {
    function coin(Cosmos.Coin calldata) public pure {}

    function pageRequest(Cosmos.PageRequest calldata) public pure {}

    function pageResponse(Cosmos.PageResponse calldata) public pure {}

    function codecAny(Cosmos.CodecAny calldata) public pure {}
}
