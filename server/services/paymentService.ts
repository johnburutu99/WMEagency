// Check Bitcoin address balance
export async function checkPayment(address: string, expectedAmount: string) {
  const url = `https://blockstream.info/api/address/${address}`;
  const res = await fetch(url);
  const data = await res.json();

  // Total received in BTC
  const totalReceived = (data as any).chain_stats.funded_txo_sum / 1e8;

  return totalReceived >= parseFloat(expectedAmount);
}
