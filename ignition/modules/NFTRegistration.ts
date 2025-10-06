import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("NFTRegistrationModule", (m) => {
  // Constructor parameters for NFTRegistration
  // You should set these in your .env file or modify them here

  // The ORO token address (required)
  const oroTokenAddress = m.getParameter(
    "oroTokenAddress",
    "0x5a47EF9C19dae206e99382955eb9eD5ca510A7Fa"
  );

  // Initial price in ORO tokens (with 18 decimals)
  // Example: 1000000000000000000 = 1 ORO token
  const initialPrice = m.getParameter("initialPrice", "45000000000000000000");

  // Price increase percentage in basis points (e.g., 500 = 5%)
  const priceIncreasePercentage = m.getParameter(
    "priceIncreasePercentage",
    "50"
  );

  // Start date as Unix timestamp
  // Example: Date.now() / 1000 for current time
  const startDate = m.getParameter(
    "startDate",
    Math.floor(new Date("2025-10-06T15:00:00Z").getTime() / 1000).toString()
  );

  // Maximum number of registration spots
  const maxSpots = m.getParameter("maxSpots", "250");

  const nftRegistration = m.contract("NFTRegistration", [
    oroTokenAddress,
    initialPrice,
    priceIncreasePercentage,
    startDate,
    maxSpots,
  ]);

  return { nftRegistration };
});
