import { TypedDataSigner } from '@ethersproject/abstract-signer';
import domain from '../domain';

export interface ITokenClaimRaw {
  tokenId: number;
  tokenUri: string;
  expires: number;
}

export interface ITokenClaimSigned {
  claim: ITokenClaimRaw;
  signature: string;
}

export async function signTokenClaim(
  signer: TypedDataSigner,
  claim: ITokenClaimRaw,
): Promise<ITokenClaimSigned> {
  const d = await domain();
  const signRequest = signer._signTypedData(
    d,
    {
      TokenClaim: [
        {
          name: 'tokenId',
          type: 'uint256',
        },
        {
          name: 'tokenUri',
          type: 'string',
        },
        {
          name: 'expires',
          type: 'uint256',
        },
      ],
    },
    claim,
  );

  const signature = await signRequest;

  return { claim: { ...claim }, signature };
}

export function encodeTokenClaim(claim: ITokenClaimSigned): string {
  return btoa(JSON.stringify(claim));
}

export function isTokenClaim(x: any): x is ITokenClaimRaw {
  return (
    'tokenId' in x &&
    'tokenUri' in x &&
    'expires' in x &&
    typeof x.tokenId === 'number' &&
    typeof x.tokenUri === 'string' &&
    typeof x.expires === 'number'
  );
}

export function isSignedTokenClaim(x: any): x is ITokenClaimSigned {
  return (
    'claim' in x &&
    'signature' in x &&
    isTokenClaim(x.claim) &&
    typeof x.signature === 'string'
  );
}

export function decodeTokenClaim(claimString: string): ITokenClaimSigned {
  const obj = JSON.parse(atob(claimString));
  if (isSignedTokenClaim(obj)) {
    return obj;
  } else {
    throw new Error('Invalid token claim format');
  }
}
