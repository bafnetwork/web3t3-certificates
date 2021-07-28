import { ethers } from 'ethers';
import { createContext, useContext, useEffect, useState } from 'react';

export interface IConnectionContext {
  provider: null | ethers.providers.Web3Provider;
  isConnected: boolean;
  address: string | null;
  chainId: number;
}

const connectionContext = createContext<IConnectionContext>({
  provider: null,
  isConnected: false,
  address: '',
  chainId: -1,
});

export function useConnection() {
  return useContext(connectionContext);
}

export function ConnectionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const connection = useConnectionContext();

  return (
    <connectionContext.Provider value={connection}>
      {children}
    </connectionContext.Provider>
  );
}

export const ConnectionConsumer = connectionContext.Consumer;

function useConnectionContext(): IConnectionContext {
  const [provider, setProvider] = useState(
    null as null | ethers.providers.Web3Provider,
  );
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState(null as null | string);
  const [chainId, setChainId] = useState(-1);

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

    (window as any).ethereum
      .request({ method: 'eth_chainId' })
      .then((chainIdString: string) => setChainId(parseInt(chainIdString)));
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

  return { provider, isConnected, address, chainId };
}
