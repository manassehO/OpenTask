

pub mod dispute_module {

    use starknet::{ContractAddress};
    use crate::events::dispute_event::{DisputeEvent, DisputeFlagged, DisputeResolved};

    #[external]
    pub fn flag_dispute(task_id: felt252, completer: ContractAddress, submission_id: felt252) {
        DisputeEvent::DisputeFlagged(
            DisputeFlagged {
                task_id,
                completer,
                submission_id,
            }
        );
    }

    #[external]
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