export async function connect() {
  await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
}
