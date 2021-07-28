import { useEffect, useState } from 'react';
import * as ethers from 'ethers';

export default function useContract({
  provider,
  address,
  abi,
}: {
  provider: ethers.providers.Web3Provider;
  address: string;
  abi: any;
}) {
  const [contract, setContract] = useState(
    new ethers.Contract(address, abi, provider.getSigner(0)),
  );

  useEffect(() => {
    setContract(new ethers.Contract(address, abi, provider.getSigner(0)));
  }, [provider, address, abi]);

  return contract;
}
