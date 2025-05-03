use starknet::ContractAddress;

#[derive(Drop, starknet::Event)]
pub struct RewardPaid {
    // id of the task
    #[key]
    pub task_id: felt252,
    #[key]
    pub completer: ContractAddress, // address of the user that trigger the event
    pub submission_id: Option<felt252>, // id of the submission
    pub amount: u256, // amount involved with the reward
    pub token: ContractAddress, // address of the token used for the reward
}