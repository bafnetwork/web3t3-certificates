import { ethers } from 'ethers';
import { useEffect, useState } from 'react';

export default function useConnection() {
  const [provider, setProvider] = useState(null as null | ethers.providers.Web3Provider);
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState(null as null | string);

  // Update state variables from list of accounts
  const handler = (accounts: string[]) => {
    const connected = accounts && accounts.length > 0;
    setIsConnected(connected);
    if (connected) {
      setAddress(accounts[0]);
    } else {
      setAddress(null);
    }
  };

  if ('ethereum' in window && provider === null) {
    // Initialize state variables
    setProvider(new ethers.providers.Web3Provider((window as any).ethereum));

    (window as any).ethereum
      .request({
        method: 'eth_accounts',
      })
      .then(handler);
  }

  // Event listener for when a user logs in/out or switches accounts
  useEffect(() => {
    if ('ethereum' in window) {
      (window as any).ethereum.addListener('accountsChanged', handler);

      return () => {
        (window as any).ethereum.removeListener('accountsChanged', handler);
      };
    }
  }, []);

  return { provider, isConnected, address };
}
