use starknet::ContractAddress;

#[starknet::interface]
pub trait IEscrow<TContractState> {
    fn fund_task(
        ref self: TContractState,
        task_id: felt252, 
        required_completions: u32, 
        reward_per_completion: u256, 
        token_address: ContractAddress
    ) ;
}

#[starknet::interface]
trait IERC20<TContractState> {
    fn transfer(ref self: TContractState, to: ContractAddress, amount: u256);
    fn transfer_from(
        ref self: TContractState, from: ContractAddress, to: ContractAddress, amount: u256
    );
}


#[starknet::contract]
mod Escrow {
    use starknet::{
        ContractAddress, get_caller_address, get_contract_address,
    };
    use openzeppelin::token::erc20::interface::{IERC20Dispatcher, IERC20DispatcherTrait};
    use opentask_contract::types::task::{TaskDetails, TaskStatus};
    use starknet::storage::{
        Map, StorageMapReadAccess, StorageMapWriteAccess
    };
    use core::num::traits::Zero;
    use core::num::traits::OverflowingMul;

    #[storage]
    struct Storage {
        tasks: Map<felt252, TaskDetails>,
    }

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