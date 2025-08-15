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

#[event]
#[derive(Drop, starknet::Event)]
pub enum TaskEvent {
    TaskCreated: TaskCreated,
    TaskFunded: TaskFunded,
    TaskPaused: TaskPaused,
    TaskResumed: TaskResumed,
    TaskAssigned: TaskAssigned,
    TaskCancelled: TaskCancelled,
    TaskApplicationCancelled: TaskApplicationCancelled,
    SubmissionReceived: SubmissionReceived,
    SubmissionApproved: SubmissionApproved,
}

#[derive(Drop, starknet::Event)]
pub struct TaskCreated {
    #[key]
    pub task_id: felt252,
    #[key]
    pub creator: ContractAddress,
    pub token: ContractAddress,
    pub reward_per_completion: u256,
    pub required_completions: u32,
}

#[derive(Drop, starknet::Event)]
pub struct TaskFunded {
    #[key]
    pub task_id: felt252,
    #[key]
    pub funder: ContractAddress,
    pub amount: u256,
    pub token: ContractAddress,
}

#[derive(Drop, starknet::Event)]
pub struct TaskPaused {
    #[key]
    pub task_id: felt252,
}

#[derive(Drop, starknet::Event)]
pub struct TaskResumed {
    #[key]
    pub task_id: felt252,
}

#[derive(Drop, starknet::Event)]
pub struct TaskAssigned {
    #[key]
    pub task_id: felt252,
    #[key]
    pub application_id: felt252,
}

#[derive(Drop, starknet::Event)]
pub struct TaskCancelled {
    #[key]
    pub task_id: felt252,
}

#[derive(Drop, starknet::Event)]
pub struct TaskApplicationCancelled {
    #[key]
    pub task_id: felt252,
    #[key]
    pub application_id: felt252,
}

#[derive(Drop, starknet::Event)]
pub struct SubmissionReceived {
    #[key]
    pub task_id: felt252,
    #[key]
    pub submission_id: felt252,
    pub submitter: ContractAddress,
}

#[derive(Drop, starknet::Event)]
pub struct SubmissionApproved {
    #[key]
    pub task_id: felt252,
    #[key]
    pub submission_id: felt252,
}