import { provider } from "starknet";

interface StarknetProvider {
  verifyMessageInStarknet: (
    originalMessage: string,
    signedMessage: string,
    address: string,
  ) => Promise<boolean>;
}

const provider: StarknetProvider = provider;

export async function verifyStarknetSignature(
  originalMessage: string,
  signedMessage: string,
  address: string,
): Promise<boolean> {
  try {
    const isValid: boolean = await provider.verifyMessageInStarknet(
      originalMessage,
      signedMessage,
      address,
    );
    return isValid;
  } catch (err) {
    if (err instanceof Error) {
      console.error(err.message);
    } else {
      console.error("An unknown error occurred during signature verification.");
    }
    return false;
  }
}
