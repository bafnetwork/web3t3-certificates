import { DateTime } from 'luxon';
import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import abi from '../abi.json';
import useContract from '../hooks/Contract';
import { useConnection } from '../providers/Connection';
import { TokenMetadata } from '../utils/tokenMetadata';

export function View() {
  const history = useHistory();
  const { tokenId } = useParams<{ tokenId: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [metadata, setMetadata] = useState(null as null | TokenMetadata);
  const [owner, setOwner] = useState(null as null | string);
  const [tokenIdInput, setTokenIdInput] = useState(
    tokenId !== undefined ? tokenId : '',
  );
  const { provider } = useConnection();
  const contract = useContract({
    provider: provider!,
    address: process.env.REACT_APP_CONTRACT_ADDRESS!,
    abi,
  });

  useEffect(() => {
    setError(false);
    setLoading(true);
    setMetadata(null);

    const loadMetadata = async () => {
      const tokenUri: string = await contract.tokenURI(tokenId);

      const url = tokenUri.startsWith('ipfs://')
        ? tokenUri.replace(/^ipfs:\/\//, 'https://ipfs.io/ipfs/')
        : tokenUri;

      const result = await (await fetch(url)).json();

      setMetadata(result);
    };

    const loadOwner = async () => {
      const owner: string = await contract.ownerOf(tokenId);
      setOwner(owner);
    };

    Promise.all([loadOwner(), loadMetadata()])
      .then(() => {
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        setError(true);
      });
  }, [contract, tokenId]);

  const findTrait = (traitName: string) => {
    if (metadata) {
      return metadata.attributes.find((a) => a.trait_type === traitName);
    } else {
      return undefined;
    }
  };

  const cohort = findTrait('Cohort');
  const issueDate = findTrait('Issue Date');
  const distinction = findTrait('Distinction');
  const recipient = findTrait('Recipient');

  return (
    <>
      <p>
        <input
          type="text"
          placeholder="Token ID&hellip;"
          value={tokenIdInput}
          onInput={(e) => {
            setTokenIdInput(
              (e.target as HTMLInputElement).value.replaceAll(/\D/g, ''),
            );
          }}
        />
      </p>
      <p>
        <button
          type="button"
          onClick={() => {
            history.push('/certificate/' + tokenIdInput);
          }}
        >
          View
        </button>
      </p>
      {tokenId !== undefined && (
        <>
          {error && <p>Unable to display token information.</p>}
          {loading && <p>Loading...</p>}
          {metadata && (
            <table>
              <tbody>
                <tr>
                  <td>
                    <strong>Token ID</strong>
                  </td>
                  <td>
                    <code>{tokenId}</code>
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong>Owner</strong>
                  </td>
                  <td>
                    <code>{owner}</code>
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong>Name</strong>
                  </td>
                  <td>{metadata.name}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Description</strong>
                  </td>
                  <td>{metadata.description}</td>
                </tr>
                {recipient !== undefined && (
                  <tr>
                    <td>
                      <strong>Recipient</strong>
                    </td>
                    <td>{recipient.value}</td>
                  </tr>
                )}
                {distinction !== undefined && (
                  <tr>
                    <td>
                      <strong>Distinction</strong>
                    </td>
                    <td>{distinction.value}</td>
                  </tr>
                )}
                {cohort !== undefined && (
                  <tr>
                    <td>
                      <strong>Cohort</strong>
                    </td>
                    <td>{cohort.value}</td>
                  </tr>
                )}
                {issueDate !== undefined && (
                  <tr>
                    <td>
                      <strong>Issue Date</strong>
                    </td>
                    <td>{DateTime.fromMillis(+issueDate.value).toRFC2822()}</td>
                  </tr>
                )}
                <tr>
                  <td>
                    <strong>External URL</strong>
                  </td>
                  <td>
                    <a
                      href={metadata.external_url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {metadata.external_url}
                    </a>
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong>Image</strong>
                  </td>
                  <td>
                    <img alt="Certificate" src={metadata.image} />
                  </td>
                </tr>
              </tbody>
            </table>
          )}
        </>
      )}
    </>
  );
}
