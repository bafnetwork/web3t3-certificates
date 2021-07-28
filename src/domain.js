import { getChainId } from './utils/chainId';
import contract from './contract.json';

export default async function domain() {
  const currentChainId = await getChainId();
  if (currentChainId !== contract.chainId) {
    throw new Error('Incorrect chain id');
  }

  return {
    chainId: currentChainId,
    name: 'Web3T3 Certificate',
    version: '1',
    verifyingContract: contract.address,
  };
}
