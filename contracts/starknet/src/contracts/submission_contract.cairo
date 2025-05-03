


// the instruction was to emit it in approve submission function
pub mod Submission_Contract {

    use starknet::ContractAddress;
    use crate::events::reward_events::RewardPaid;

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
}