const STARKNET_RPC_URL = process.env.STARKNET_RPC_URL;


export const deployAAWallet = async (userId: string) => {
  console.log(`[StarknetSvc] Request to deploy AA Wallet for user: ${userId}`);
  console.log(`[StarknetSvc] Using RPC endpoint: ${STARKNET_RPC_URL}`);
  //Interact with chipi
};

export const approve = () => {
  console.log('Stub: Approving transaction');
};

export const fundTask = () => {
  console.log('Stub: Funding task');
};

export const transfer = () => {
  console.log('Stub: Transferring tokens');
};

export const verifyMessage = () => {
  console.log('Stub: Verifying message');
};

export const flagDispute = () => {
  console.log('Stub: Flagging dispute');
};

export function resolveDispute(params: {
  taskId: string;
  completerUserId: string;
  resolution: "APPROVE" | "REJECT";
}) {
  const { taskId, completerUserId, resolution } = params;

  console.log("Resolving dispute on-chain", {
    taskId,
    completerUserId,
    resolution,
  });

  // TODO: interact with Starknet contract
}

export const fundTaskWithManagedWallet = async ({
  taskId,
  totalFunding,
  walletAddress,
}: {
  taskId: string;
  totalFunding: bigint;
  walletAddress: string;
}) => {
  console.log('[StarknetSvc] Funding task with managed wallet');
  console.log('Task ID:', taskId);
  console.log('Total Funding (wei):', totalFunding.toString());
  console.log('Wallet Address:', walletAddress);

  // Simulate Starknet contract interactions here (ERC20.approve & Escrow.fund_task)
  // Later, this will interact with Chipi or your own Starknet contract wrapper

  return { status: 'success' };
};