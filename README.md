# OpenTask

![Starknet](https://img.shields.io/badge/Starknet-Powered-blue)
![License](https://img.shields.io/badge/License-MIT-green)
![Status](https://img.shields.io/badge/Status-MVP%20in%20Progress-orange)

## What is OpenTask?

OpenTask is an open-source platform designed to streamline micro-task management
for development teams using blockchain technology. Built on Starknet's Layer 2
solution, it enables:

- **Create tasks**: Post small jobs (e.g., bug fixes, code reviews,
  documentation) with transparent rewards in cryptocurrency.
- **Complete tasks**: Submit work and receive instant payment via secure smart
  contracts.
- **Track tasks**: Monitor progress through a clean, intuitive dashboard.

By leveraging blockchain technology, OpenTask eliminates payment friction,
ensures transparent work agreements, and creates an efficient marketplace for
development tasks—whether you're managing an open-source project or coordinating
development work across teams.

---

## Why OpenTask?

- **Trustless Collaboration**: No intermediaries or escrow services needed,
  reducing costs and friction
- **Transparent Incentives**: Clear rewards and requirements visible to all
  participants
- **Instant Payments**: Automatic payment upon task approval with no invoicing
  or payment delays
- **Ownership Records**: Complete history of contributions stored permanently on
  the blockchain
- **Borderless Participation**: Global talent pool with no currency exchange or
  banking limitations
- **Lower Transaction Costs**: Starknet's Layer 2 technology provides minimal
  gas fees compared to other blockchain solutions

---

## Features

- **Task Management**: Create, submit, and approve micro-tasks with ease
- **Smart Contract Payouts**: Cairo-based escrow contract locks and releases
  rewards securely
- **Wallet Integration**: Connects with Starknet wallets (Argent X, Braavos) for
  seamless transactions
- **Responsive UI**: Built with Tailwind CSS for a modern, mobile-friendly
  experience

---

## Tech Stack

- **Frontend**: [Next.js T3 App](https://create.t3.gg/) (TypeScript, Tailwind
  CSS, tRPC)
- **Smart Contract**: [Cairo](https://www.cairo-lang.org/) on Starknet
- **Backend**: tRPC within Next.js API routes
- **Blockchain**: Starknet (Ethereum Layer 2)
- **Tools**: Starknet.js, Hardhat-Starknet, Starknet Foundry

For full technical details, see [details.md](./details.md).

---

## Getting Started

### Prerequisites

- Node.js v18+
- Rust (for Cairo tooling)
- Starknet wallet (Argent X or Braavos)
- STRK testnet tokens (via Starknet faucet)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/opentask.git
   cd opentask
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Visit `http://localhost:3000` in your browser

### Smart Contract Setup

1. Install Cairo tooling:
   ```bash
   curl -L https://get.starknet.io | sh
   # Follow prompts to install Scarb and other tools
   ```

2. Compile the smart contract:
   ```bash
   cd contracts
   scarb build
   ```

3. Deploy to testnet (requires testnet tokens):
   ```bash
   starknet-deploy --network testnet ./target/OpenTask.json
   ```

## Usage

### Creating a Task

1. Connect your Starknet wallet by clicking "Connect Wallet" in the top right
2. Navigate to "Create Task" and fill in:
   - Task title and description
   - Reward amount in STRK
   - Deadline (optional)
3. Submit the task, which will require a wallet confirmation
4. Your task will appear in the task list once confirmed on the blockchain

### Completing a Task

1. Browse available tasks on the dashboard
2. Select a task and click "Accept"
3. Complete the work according to the task description
4. Submit your work with proof (link, description, etc.)
5. Once approved by the task creator, payment is automatically released to your
   wallet

### Managing Tasks

- Use the dashboard to view tasks you've created or accepted
- Filter by status (open, in progress, completed)
- Approve submissions for tasks you've created

## Development

### Running Tests

```bash
# Frontend tests
npm test

# Smart contract tests
cd contracts
scarb test
```

### Building for Production

```bash
npm run build
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for
details.

## Acknowledgments

- The Starknet community for their excellent documentation and tools
- [T3 Stack](https://create.t3.gg/) for the application boilerplate
