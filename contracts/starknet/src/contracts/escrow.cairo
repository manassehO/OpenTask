use starknet::ContractAddress;
pub trait IEscrow<TContractState> {
    fn get_balance(
        self: @TContractState, token_address: ContractAddress, account: ContractAddress,
    ) -> u256;
    fn transfer_tokens(
        ref self: TContractState,
        token_address: ContractAddress,
        recipient: ContractAddress,
        amount: u256,
    ) -> bool;
    fn transfer_from_tokens(
        ref self: TContractState,
        token_address: ContractAddress,
        sender: ContractAddress,
        recipient: ContractAddress,
        amount: u256,
    ) -> bool;
    fn approve_spender(
        ref self: TContractState,
        token_address: ContractAddress,
        spender: ContractAddress,
        amount: u256,
    ) -> bool;
}


#[starknet::contract]
mod Escrow {
    use core::num::traits::Zero;
    use core::num::traits::OverflowingMul;
    use starknet::{
        ContractAddress, get_caller_address, get_contract_address,
    };
    use openzeppelin::token::erc20::interface::{IERC20Dispatcher, IERC20DispatcherTrait};
    use starknet::storage::{
        Map, StorageMapReadAccess, StorageMapWriteAccess
    };
    use opentask_contract::types::task::{TaskDetails, TaskStatus};
    use opentask_contract::interfaces::Ierc20::{IERC20Dispatcher, IERC20DispatcherTrait};
    use super::IEscrow;
   //Storage
    #[storage]
    struct Storage {
        tasks: Map<felt252, TaskDetails>,
    }

    impl Escrow of IEscrow<ContractState> {
        fn get_balance(
            self: @ContractState, token_address: ContractAddress, account: ContractAddress,
        ) -> u256 {
            IERC20Dispatcher { contract_address: token_address }.balanceOf(account)
        }

        fn transfer_tokens(
            ref self: ContractState,
            token_address: ContractAddress,
            recipient: ContractAddress,
            amount: u256,
        ) -> bool {
            IERC20Dispatcher { contract_address: token_address }.transfer(recipient, amount)
        }

        fn transfer_from_tokens(
            ref self: ContractState,
            token_address: ContractAddress,
            sender: ContractAddress,
            recipient: ContractAddress,
            amount: u256,
        ) -> bool {
            IERC20Dispatcher { contract_address: token_address }
                .transferFrom(sender, recipient, amount)
        }

        fn approve_spender(
            ref self: ContractState,
            token_address: ContractAddress,
            spender: ContractAddress,
            amount: u256,
        ) -> bool {
            IERC20Dispatcher { contract_address: token_address }.approve(spender, amount)
        }
    }

    // Functions
    #[external(v0)]
    fn fund_task(
        ref self: ContractState,
        task_id: felt252, 
        required_completions: u32, 
        reward_per_completion: u256, 
        token_address: ContractAddress
    ) {

        let existing_task = self.tasks.read(task_id);
        assert(!existing_task.creator.is_zero(), 'Task already exists');

        let creator = get_caller_address();
        let escrow_address = get_contract_address();

        let (total_funded_amount, is_overflow) = reward_per_completion.overflowing_mul(reward_per_completion);
        assert!(!is_overflow);

        // Transfer funds from the caller to the contract
        let transfer_successful = IERC20Dispatcher { contract_address: token_address }
            .transfer_from(creator, escrow_address, total_funded_amount);
        assert(transfer_successful, 'Token transfer failed');

        // Store task details
        let task_details = TaskDetails {
            creator,
            token_address,
            reward_per_completion,
            total_funded_amount,
            required_completions,
            completed_count: 0,
            status: TaskStatus::Active,
        };

        self.tasks.write(task_id, task_details);
    }
}