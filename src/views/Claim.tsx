import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import abi from '../abi.json';
import useContract from '../hooks/Contract';
import { useConnection } from '../providers/Connection';
import { decodeTokenClaim } from '../utils/tokenClaim';

export function Claim() {
  const location = useLocation();
  const { provider } = useConnection();
  const contract = useContract({
    abi,
    address: process.env.REACT_APP_CONTRACT_ADDRESS!,
    provider: provider!,
  });

  const [inputValue, setInputValue] = useState(() => {
    const parsed = new URLSearchParams(location.search);
    const claim = parsed.get('t');
    if (claim) {
      return claim;
    } else {
      return '';
    }
  });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [claimedTokenId, setClaimedTokenId] = useState(null as null | number);

  const run = async () => {
    setError('');
    setMessage('');
    setClaimedTokenId(null);

    let decoded;
    try {
      decoded = decodeTokenClaim(inputValue);
    } catch (e) {
      console.log(e);
      setError('Could not parse token claim.');
      return;
    }

    if (decoded.claim.expires * 1000 <= Date.now()) {
      setError('Token claim is expired.');
      return;
    }

    try {
      await contract.ownerOf(decoded.claim.tokenId);
      setError('Certificate has already been claimed.');
      return;
    } catch (e) {}

    try {
      await contract.claimToken(
        decoded.signature,
        decoded.claim.tokenId,
        decoded.claim.tokenUri,
        decoded.claim.expires,
      );
    } catch (e) {
      console.log(e);
      setError('Could not claim token.');
      return;
    }

    setMessage('Successfully claimed token.');
    setClaimedTokenId(decoded.claim.tokenId);
  };

  return (
    <>
      <h1>Claim</h1>
      <p>
        <label htmlFor="tokenClaimInput">
          <strong>Signed Token Claim</strong>
        </label>
      </p>
      <p>
        <input
          type="text"
          id="tokenClaimInput"
          placeholder="Signed token claim&hellip;"
          value={inputValue}
          onInput={(e) => setInputValue((e.target as HTMLInputElement).value)}
        />
      </p>
      <p>
        <button onClick={run}>Claim</button>
      </p>
      {error.length > 0 && (
        <p style={{ backgroundColor: 'rgba(255, 0, 0, 0.1)' }}>{error}</p>
      )}
      {message.length > 0 && <p>{message}</p>}
      {claimedTokenId !== null && (
        <p>
          <a href={'/certificate/' + claimedTokenId}>
            View Certificate #{claimedTokenId}
          </a>
          <br />
          <small>Note: There may be a small delay before the certificate is available, since the claim transaction must first be confirmed by the network.</small>
        </p>
      )}
    </>
  );
}
