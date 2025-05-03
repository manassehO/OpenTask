


// the instruction was to emit it in approve submission function
pub mod Submission_Contract {

    use starknet::ContractAddress;
    use crate::events::{reward_events::RewardPaid , dispute_events::{DisputeEvent, DisputeFlagged, DisputeResolved}};

    fn approve_submission(
        task_id: felt252,
        completer: ContractAddress,
        submission_id: Option<felt252>,
        amount: u256,
        token: ContractAddress,
    ) {
        // TODO:
        RewardPaid { task_id, completer, submission_id, amount, token };
    }

    pub fn flag_dispute(task_id: felt252, completer: ContractAddress, submission_id: felt252) {
        DisputeEvent::DisputeFlagged(
            DisputeFlagged {
                task_id,
                completer,
                submission_id,
            }
        );
    }
    
    pub fn resolve_dispute(task_id: felt252, completer: ContractAddress, submission_id: felt252, resolver: ContractAddress, approved: bool) {
        DisputeEvent::DisputeResolved(
            DisputeResolved {
                task_id,
                completer,
                submission_id,
                resolver,
                approved,
            }
        );
    }
}