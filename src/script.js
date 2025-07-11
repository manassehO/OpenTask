import readline from "readline";
import { ec, hash } from "starknet";

const privateKey =
  "0x04becb72c701a19366d0055d7428beb5c918d7e941c4ab281172ed0abf55ee0a";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question(
  "Enter comma-separated numbers for the message array: ",
  (input) => {
    // Parse the input into an array of BigNumberish
    const message = input
      .split(",")
      .map((x) => x.trim())
      .map((x) => (isNaN(Number(x)) ? x : Number(x)));

    // Compute the hash of the message array
    const msgHash = hash.computeHashOnElements(message);

    // Sign the hash
    const signature = ec.starkCurve.sign(msgHash, privateKey);

    // Output the signature and the message hash
    console.log("Message array:", message);
    console.log("Message hash:", msgHash);
    console.log("Signature (r, s):", [
      signature.r.toString(16),
      signature.s.toString(16),
    ]);
    rl.close();
  },
);
