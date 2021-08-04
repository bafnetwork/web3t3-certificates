import { DateTime } from 'luxon';
import React, { useEffect, useState } from 'react';
import abi from '../abi.json';
import useContract from '../hooks/Contract';
import { useConnection } from '../providers/Connection';
import { encodeTokenClaim, signTokenClaim } from '../utils/tokenClaim';

export function Sign() {
  const { provider } = useConnection();
  const contract = useContract({
    abi,
    address: process.env.REACT_APP_CONTRACT_ADDRESS!,
    provider: provider!,
  });

  const [tokenId, setTokenId] = useState(0);
  const [tokenAvailable, setTokenAvailable] = useState(false);
  const [tokenUri, setTokenUri] = useState('');
  const [expiresInDays, setExpiresInDays] = useState(30);
  const [output, setOutput] = useState('');

  useEffect(() => {
    contract
      .ownerOf(tokenId)
      .then(() => setTokenAvailable(false))
      .catch(() => setTokenAvailable(true));
  }, [tokenId, contract]);

  return (
    <>
      <h2>Sign</h2>
      <p>
        Token ID:{' '}
        <input
          type="number"
          value={tokenId}
          min="0"
          onInput={(e) =>
            setTokenId(parseInt((e.target as HTMLInputElement).value))
          }
        />{' '}
        {tokenAvailable ? (
          <span style={{ borderBottom: '2px solid green' }}>Available</span>
        ) : (
          <span style={{ borderBottom: '2px solid red' }}>Unavailable</span>
        )}
      </p>
      <p>
        Token URI:{' '}
        <input
          type="text"
          value={tokenUri}
          onInput={(e) => setTokenUri((e.target as HTMLInputElement).value)}
        />{' '}
        <a href={tokenUri} target="_blank" rel="noreferrer">
          test link
        </a>
      </p>
      <p>
        Expires in{' '}
        <input
          type="number"
          value={expiresInDays}
          min="1"
          max="365"
          onInput={(e) =>
            setExpiresInDays(parseInt((e.target as HTMLInputElement).value))
          }
        />{' '}
        day{expiresInDays === 1 ? '' : 's'}
      </p>
      <p>
        <button
          onClick={async () => {
            const signed = await signTokenClaim(provider!.getSigner(0), {
              expires:
                DateTime.now().plus({ days: expiresInDays }).toSeconds() | 0,
              tokenId,
              tokenUri,
            });

            const encoded = encodeTokenClaim(signed);

            setOutput(encoded);
          }}
        >
          Generate Claim
        </button>
      </p>
      {output.length > 0 && (
        <>
          <p>
            <strong>Signed Token Claim</strong>
          </p>
          <p>
            <textarea
              readOnly
              value={output}
              style={{ width: '400px', height: '180px' }}
            ></textarea>
          </p>
          <p>
            <a href={'/claim?t=' + encodeURIComponent(output)}>
              Pre-filled link
            </a> (right click &rarr; "Copy link address")
          </p>
        </>
      )}
    </>
  );
}
