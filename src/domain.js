import { getChainId } from './utils/chainId';

export default async function domain() {
  const currentChainId = parseInt(await getChainId());
  if (currentChainId !== parseInt(process.env.REACT_APP_CHAIN_ID)) {
    throw new Error('Incorrect chain id');
  }

  return {
    chainId: currentChainId,
    name: 'Web3T3 Certificate',
    version: '1',
    verifyingContract: process.env.REACT_APP_CONTRACT_ADDRESS,
  };
}
