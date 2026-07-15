export type ZcashNetwork = "main" | "test";

export function parseZcashNetwork(value?: string): ZcashNetwork {
  const network = (value?.trim() || "main").toLowerCase();
  if (network !== "main" && network !== "test") {
    throw new Error('ZINK_NETWORK must be either "main" or "test"');
  }
  return network;
}

export function networkLabel(network: ZcashNetwork): "mainnet" | "testnet" {
  return network === "main" ? "mainnet" : "testnet";
}

export function networkTicker(network: ZcashNetwork): "ZEC" | "TAZ" {
  return network === "main" ? "ZEC" : "TAZ";
}

export function unifiedAddressPrefix(network: ZcashNetwork): "u1" | "utest1" {
  return network === "main" ? "u1" : "utest1";
}
