use starknet::ContractAddress;

/// Enum representing the various states a task can be in
#[derive(Copy, Drop, Serde, PartialEq)]
pub enum TaskStatus {
    Active, // Task is active and can receive submissions
    Disputed, // Task has a disputed submission
    Completed, // All required submissions completed
    Cancelled // Task was cancelled
}

/// Core data structure for storing task information
#[derive(Copy, Drop, Serde, PartialEq)]
pub struct TaskDetails {
    // Creator's address who funded the task
    creator: ContractAddress,
    // Token address used for payment (STRK, USDC, etc.)
    token_address: ContractAddress,
    // Reward amount per individual task completion
    reward_per_completion: u256,
    // Total amount initially funded for the task
    total_funded_amount: u256,
    // Number of completions required for the task
    required_completions: u32,
    // Current number of completed and approved submissions
    completed_count: u32,
    // Current status of the task
    status: TaskStatus,
}

/// Structure used for dispute tracking
#[derive(Copy, Drop, Serde, PartialEq)]
pub struct DisputeInfo {
    // Task ID the dispute is related to
    task_id: felt252,
    // Address of the completer whose submission is disputed
    completer_address: ContractAddress,
    // Optional ID linking to the off-chain submission
    submission_id: felt252,
    // Whether the dispute has been resolved
    resolved: bool,
}
