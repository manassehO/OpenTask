use starknet::ContractAddress;

/// Enum representing the various states a task can be in
#[derive(Copy, Drop, Serde, PartialEq, starknet::Store)]
#[allow(starknet::store_no_default_variant)]
pub enum TaskStatus {
    Draft,
    Active, // Task is active and can receive submissions
    Disputed, // Task has a disputed submission
    Completed, // All required submissions completed
    Cancelled, // Task was cancelled
    Paused //Task was paused
}

/// Core data structure for storing task information
#[derive(Copy, Drop, Serde, PartialEq, starknet::Store)]
pub struct TaskDetails {
    // Creator's address who funded the task
    pub creator: ContractAddress,
    // Token address used for payment (STRK, USDC, etc.)
    pub token_address: ContractAddress,
    // Description of what the task entails
    pub description: felt252,
    // Reward amount per individual task completion
    pub reward_per_completion: u256,
    // Total amount initially funded for the task
    pub total_funded_amount: u256,
    // Number of completions required for the task
    pub required_completions: u32,
    // Current number of completed and approved submissions
    pub completed_count: u32,
    // Current status of the task
    pub status: TaskStatus,
}

/// Structure used for dispute tracking
#[derive(Copy, Drop, Serde, PartialEq, starknet::Store)]
pub struct DisputeInfo {
    // Task ID the dispute is related to
    pub task_id: felt252,
    // Address of the completer whose submission is disputed
    pub completer_address: ContractAddress,
    // Optional ID linking to the off-chain submission
    pub submission_id: felt252,
    // Whether the dispute has been resolved
    pub resolved: bool,
}
