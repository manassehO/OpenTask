use starknet::ContractAddress;

#[starknet::interface]
pub trait IOpenTask<TContractState> {
    fn create_task(
        ref self: TContractState,
        task_id: felt252,
        creator: ContractAddress,
        token_address: ContractAddress,
        reward_per_completion: u256,
        total_funded_amount: u256,
        required_completions: u32,
    ) -> bool;

}
