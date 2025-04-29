// RewardPaid event using #[starknet::event].
//  It should contain task_id (felt252), completer (ContractAddress), submission_id (felt252,
//  optional),
//   amount (u256), and token (ContractAddress). Mark task_id and completer as indexed keys
//   (#[key]).

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
