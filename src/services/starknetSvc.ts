const STARKNET_RPC_URL = process.env.STARKNET_RPC_URL;

export const deployAAWallet = async (userId: string) => {
  console.log(`[StarknetSvc] Request to deploy AA Wallet for user: ${userId}`);
  console.log(`[StarknetSvc] Using RPC endpoint: ${STARKNET_RPC_URL}`);
  //Interact with chipi
};

export const approve = () => {
  console.log("Stub: Approving transaction");
};

export const fundTask = () => {
  console.log("Stub: Funding task");
};

export const transfer = () => {
  console.log("Stub: Transferring tokens");
};

export const verifyMessage = () => {
  console.log("Stub: Verifying message");
};

export const flagDispute = () => {
  console.log("Stub: Flagging dispute");
};

export const resolveDispute = () => {
  console.log("Stub: Resolving dispute");
};

