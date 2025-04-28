
use starknet::ContractAddress;

#[event]
#[derive(Drop, starknet::Event)]
pub enum DisputeEvent {
    DisputeFlagged: DisputeFlagged,
    DisputeResolved: DisputeResolved
}

#[derive(Drop, starknet::Event)]
pub struct DisputeFlagged {
    #[key]
    pub task_id: felt252,
    #[key]
    pub completer: ContractAddress,
    pub submission_id: felt252
}

#[derive(Drop, starknet::Event)]
pub struct DisputeResolved {
    #[key]
    pub task_id: felt252,
    #[key]
    pub completer: ContractAddress,
    #[key]
    pub submission_id: felt252,
    pub resolver: ContractAddress,
    pub approved: bool
}