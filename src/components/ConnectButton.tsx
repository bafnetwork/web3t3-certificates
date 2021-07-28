import { connect } from '../utils/connect';

export function ConnectButton() {
  const available = 'ethereum' in window;

  return (
    <>
      {available && <button onClick={() => connect()}>Connect</button>}
      {!available && (
        <p>
          Please{' '}
          <a
            href="https://metamask.io/download"
            target="_blank"
            rel="noreferrer"
          >
            install MetaMask
          </a>{' '}
          to use this application.
        </p>
      )}
    </>
  );
}
