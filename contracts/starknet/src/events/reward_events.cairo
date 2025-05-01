use starknet::ContractAddress;

#[derive(Drop, starknet::Event)]
pub struct RewardPaid {
    #[key]
    pub task_id: felt252,
    #[key]
    pub completer: ContractAddress,
    pub submission_id: Option<felt252>,
    pub amount: u256,
    pub token: ContractAddress,
}