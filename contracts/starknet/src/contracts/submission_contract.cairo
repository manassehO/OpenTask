use starknet::ContractAddress;

#[starknet::interface]
pub trait ISubmission<TContractState> {
    fn approve_submission(
        ref self: TContractState,
        task_id: felt252,
        completer: ContractAddress,
        submission_id: Option<felt252>,
        amount: u256,
        token: ContractAddress,
    );
    fn flag_dispute(
        ref self: TContractState,
        task_id: felt252,
        completer: ContractAddress,
        submission_id: felt252,
    );
    fn resolve_dispute(
        ref self: TContractState,
        task_id: felt252,
        completer: ContractAddress,
        submission_id: felt252,
        resolver: ContractAddress,
        approved: bool,
    );

}


// the instruction was to emit it in approve submission function
#[starknet::contract]
pub mod Submission_Contract {
    use super::ISubmission;
    use starknet::ContractAddress;
    use crate::events::{reward_events::RewardPaid , dispute_events::{DisputeEvent, DisputeFlagged, DisputeResolved}};
    use crate::types::task::DisputeInfo;
    use starknet::storage::{Map, StorageMapReadAccess, StorageMapWriteAccess};

    #[storage]
    pub struct Storage {
        // Mapping from task ID to dispute information
        disputes: Map<felt252, DisputeInfo>,
    }

impl Submission of ISubmission<ContractState> {
    fn approve_submission(
        ref self: ContractState,
        task_id: felt252,
        completer: ContractAddress,
        submission_id: Option<felt252>,
        amount: u256,
        token: ContractAddress,
    ) {
        // TODO:
        let dispute = self.disputes.read(task_id);
        assert!(dispute.resolved, "Dispute must be resolved before approval");
        RewardPaid { task_id, completer, submission_id, amount, token };
    }

    fn flag_dispute(ref self: ContractState, task_id: felt252, completer: ContractAddress, submission_id: felt252) {
        DisputeEvent::DisputeFlagged(
            DisputeFlagged {
                task_id,
                completer,
                submission_id,
            }
        );
    }
    
    fn resolve_dispute(ref self: ContractState, task_id: felt252, completer: ContractAddress, submission_id: felt252, resolver: ContractAddress, approved: bool) {
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
}