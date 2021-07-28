export async function getChainId(): Promise<number> {
  const chainIdString = await (window as any).ethereum.request({
    method: 'eth_chainId',
  });

  return parseInt(chainIdString);
}
