use starknet::ContractAddress;
use crate::types::stats::{CreatorStats, ProtocolStats, TokenStats, UserStats};
use crate::types::task::TaskDetails;

#[starknet::interface]
pub trait IOpenTask<TContractState> {
    /// Create a task on-chain without immediately funding it.
    ///
    /// (draft creation). Funding is done separately.
    /// - Computes `total_funded_amount` internally as `reward_per_completion *
    /// required_completions` when needed.
    /// - Authorization: caller must be the `creator` (enforced in implementation).
    /// - Emits: TaskCreated(task_id, creator, token_address, reward_per_completion,
    /// required_completions)
    /// - State: initializes storage entry for the task in `Active` or `DRAFT` equivalent depending
    /// on design.
    fn create_task(
        ref self: TContractState,
        task_id: felt252,
        creator: ContractAddress,
        token_address: ContractAddress,
        description: felt252,
        reward_per_completion: u256,
        required_completions: u32,
    ) -> bool;
    /// Create and fund a task in a single flow.
    ///
    /// create and fund a task in a single flow.
    /// - Transfers/escrows total amount equivalent to `reward_per_completion *
    /// required_completions` (plus fees off-chain if applicable).
    /// - Emits: TaskCreated, TaskFunded(task_id, amount)
    // fn create_and_fund_task(
    //     ref self: TContractState,
    //     task_id: felt252,
    //     creator: ContractAddress,
    //     token_address: ContractAddress,
    //     description: felt252,
    //     reward_per_completion: u256,
    //     required_completions: u32,
    // ) -> bool;

    /// Update editable task parameters before all completions are approved.
    ///
    /// Mirrors backend `task.createTask` + potential future update endpoint.
    /// - Only `creator` can update.
    /// - Cannot reduce below already approved/in-progress counts.
    /// - Emits: TaskUpdated(task_id, token_address, reward_per_completion, required_completions)
    // fn update_task(
    //     ref self: TContractState,
    //     task_id: felt252,
    //     creator: ContractAddress,
    //     token_address: ContractAddress,
    //     description: felt252,
    //     reward_per_completion: u256,
    //     required_completions: u32,
    // ) -> bool;

    // /// Fund an existing task escrow with additional tokens.
    // ///
    // /// Mirrors backend `task.initiateFunding` self-custody path (ERC20 approve + fund_task).
    // /// - Requires prior ERC20 `approve(escrow, amount)` by the funder.
    // /// - Emits: TaskFunded(task_id, amount, token_address)
    // fn fund_task(
    //     ref self: TContractState, task_id: felt252, token_address: ContractAddress, amount: u256,
    // ) -> bool;

    // /// Get full task details from on-chain storage.
    // ///
    // /// Mirrors backend `task.getTaskById` enriched with on-chain funding and status.
    // /// - Returns: `TaskDetails` struct from `crate::types::task`.
    // fn get_task(self: @TContractState, task_id: felt252) -> TaskDetails;

    // /// Claim a spot to work on a task.
    // ///
    // /// Mirrors backend `task.claimTask` which checks capacity and sets `IN_PROGRESS`.
    // /// - Implementation should track claims on-chain if enforced on-chain; otherwise emit
    // reference /// event.
    // /// - Emits: TaskClaimed(task_id, application_id)
    // fn claim_task(ref self: TContractState, task_id: felt252, application_id: felt252) -> bool;

    // /// Pause a task, preventing new claims or submissions.
    // /// - Only creator/admin can pause.
    // /// - Emits: TaskPaused(task_id)
    // fn pause_task(ref self: TContractState, task_id: felt252) -> bool;

    // /// Resume a paused task.
    // /// - Only creator/admin can resume.
    // /// - Emits: TaskResumed(task_id)
    // fn resume_task(ref self: TContractState, task_id: felt252) -> bool;

    // /// Assign a task to a specific application/user if workflow is assignment-based.
    // /// - Emits: TaskAssigned(task_id, application_id)
    // fn assign_task(ref self: TContractState, task_id: felt252, application_id: felt252) -> bool;

    // /// Submit a completion reference for review.
    // ///
    // /// Mirrors backend `task.submitTask`, where `submission_data` can be an off-chain reference
    // /// (CID/URL/hash).
    // /// - Emits: SubmissionReceived(task_id, submission_id, submission_data)
    // fn submit_completion(
    //     ref self: TContractState,
    //     task_id: felt252,
    //     submission_id: felt252,
    //     submission_data: felt252,
    // ) -> bool;

    // /// Approve a completion and trigger payout.
    // ///
    // /// Mirrors backend `task.approveSubmission` with `txHash` recorded off-chain.
    // /// - On success, implementation should transfer `reward_per_completion` from escrow to
    // /// completer and emit RewardPaid.
    // /// - `status = true` means approve; if `false`, treat as rejection without payout (or use
    // /// reject path off-chain).
    // /// - Emits: SubmissionApproved(task_id, submission_id), RewardPaid(task_id, completer,
    // /// submission_id, amount, token)
    // fn approve_completion(
    //     ref self: TContractState, task_id: felt252, submission_id: felt252, status: bool,
    // ) -> bool;

    // /// Flag a dispute for a rejected submission.
    // ///
    // /// Mirrors backend `task.initiateDispute` with `txHash` stored off-chain.
    // /// - Emits: DisputeFlagged(task_id, submission_id)
    // fn dispute_task(ref self: TContractState, task_id: felt252, submission_id: felt252) -> bool;

    // /// Resolve a dispute with a verdict.
    // ///
    // /// - `status = true` means approve (payout), `false` means reject (no payout).
    // /// - `verdict` can encode reason code or reference id.
    // /// - Emits: DisputeResolved(task_id, submission_id, status, verdict)
    // fn resolve_dispute(
    //     ref self: TContractState,
    //     task_id: felt252,
    //     submission_id: felt252,
    //     status: bool,
    //     verdict: felt252,
    // ) -> bool;

    // /// Cancel a task and allow creator to reclaim unused escrow.
    // /// - Emits: TaskCancelled(task_id)
    // fn cancel_task(ref self: TContractState, task_id: felt252) -> bool;

    // /// Cancel a previously created application/claim.
    // /// - Emits: TaskApplicationCancelled(task_id, application_id)
    // fn cancel_task_application(
    //     ref self: TContractState, task_id: felt252, application_id: felt252,
    // ) -> bool;

    // /// Get submission ids for a task.
    // /// - Off-chain submission payloads are referenced by these ids.
    // fn get_submissions(self: @TContractState, task_id: felt252) -> Array<felt252>;

    // /// Get dispute ids for a task.
    // fn get_disputes(self: @TContractState, task_id: felt252) -> Array<felt252>;

    // /// Get total accrued earnings available for withdrawal for a user.
    // ///
    /// Mirrors backend earnings views that aggregate on-chain events/balances.
    fn get_users_earning(self: @TContractState, user_address: ContractAddress) -> u256;

    /// Withdraw available earnings for a user.
    /// - Transfers user balance from escrow to `user_address`.
    /// - Emits: EarningsWithdrawn(user_address, amount, token)
    fn withdraw_earnings(ref self: TContractState, user_address: ContractAddress) -> bool;
    // /// Get aggregated protocol-level statistics.
// fn get_protocol_stats(self: @TContractState) -> ProtocolStats;

    // /// Get aggregated worker/user statistics.
// fn get_user_stats(self: @TContractState, user: ContractAddress) -> UserStats;

    // /// Get aggregated creator statistics.
// fn get_creator_stats(self: @TContractState, creator: ContractAddress) -> CreatorStats;

    // /// Get aggregated per-token escrow/payments statistics.
// fn get_token_stats(self: @TContractState, token: ContractAddress) -> TokenStats;
}
