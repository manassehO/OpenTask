
use crate::events::rewards_events::RewardPaid;
use starknet::ContractAddress;

pub mod reward_module {

    use super:: *;

    #[external]
    fn approve_submission(task_id: felt252, completer: ContractAddress, submission_id: Option<felt252>, amount: u256, token: ContractAddress) {

        // TODO:
        
        RewardPaid {
            task_id,
            completer,
            submission_id,
            amount,
            token
        };
    }
}