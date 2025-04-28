
use starknet::ContractAddress;

#[event]
#[derive(Drop, starknet::Event)]
pub enum DisputeEvent {
    DisputeFlagged: DisputeFlagged,
    DisputeResolved: DisputeResolved
}

#[derive(Drop, starknet::Event)]
pub struct DisputeFlagged {
    pub task_id: felt252,
    pub completer: ContractAddress,
    pub submission_id: felt252
}

#[derive(Drop, starknet::Event)]
pub struct DisputeResolved {
    pub task_id: felt252,
    pub completer: ContractAddress,
    pub submission_id: felt252,
    pub resolver: ContractAddress,
    pub approved: bool
}