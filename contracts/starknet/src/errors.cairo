pub mod Errors {
    // Generic
    pub const REENTRANT: felt252 = 'Reentrancy call detected';
    pub const PAUSED: felt252 = 'Contract is paused';
    pub const ZERO_ADDRESS: felt252 = 'Zero address not allowed';
    pub const NOT_AUTHORIZED: felt252 = 'Not authorized';
    pub const INVALID_AMOUNT: felt252 = 'Invalid amount';

    // Tasks
    pub const NOT_CREATOR: felt252 = 'Caller is not the creator';
    pub const TASK_NOT_FOUND: felt252 = 'Task not found';
    pub const TASK_NOT_EXISTS: felt252 = 'Task does not exist';
    pub const TASK_NOT_ACTIVE: felt252 = 'Task is not active';
    pub const TASK_ALREADY_DISPUTED: felt252 = 'Task already disputed';
    pub const TASK_FULL: felt252 = 'Task already full';

    // Tokens/funding
    pub const TOKEN_MISMATCH: felt252 = 'Token address mismatch';
    pub const MISMATCHED_TOTAL_REWARD: felt252 = 'Mismatched total reward';
    pub const ALREADY_FUNDED: felt252 = 'Already funded';
    pub const INSUFFICIENT_ALLOWANCE: felt252 = 'Insufficient allowance';
    pub const TRANSFER_FAILED: felt252 = 'Transfer failed';
    pub const INSUFFICIENT_BALANCE: felt252 = 'Insufficient balance';
    pub const NO_FUNDS: felt252 = 'No funds available';

    // Submissions/applications
    pub const APPLICATION_NOT_FOUND: felt252 = 'Application not found';
    pub const ALREADY_ASSIGNED: felt252 = 'Already assigned to another';
    pub const SUBMISSION_EXISTS: felt252 = 'Submission already exists';
    pub const SUBMISSION_NOT_FOUND: felt252 = 'Submission not found';
    pub const ALREADY_APPROVED: felt252 = 'Already approved';
    pub const NOT_CLAIMED_OR_ASSIGNED: felt252 = 'Not claimed or assigned';

    // Earnings
    pub const NOT_OWNER_OF_FUNDS: felt252 = 'Not owner of funds';
}

