// File: contracts/starknet/src/core/tests/opentask_tests.cairo

use snforge_std::{start_cheat_caller_address_global, stop_cheat_caller_address_global};
use starknet::ContractAddress;
use crate::core::opentask::IOpenTaskImpl;

#[cfg(test)]
mod create_task_tests {
    use super::*;

    // Helper to deploy the contract
    fn deploy_contract() -> IOpenTaskImpl {
        IOpenTaskImpl::new()
    }

    #[test]
    fn success() {
        let creator = starknet::contract_address_const::<'creator'>();
        start_cheat_caller_address_global(creator);

        let mut contract = deploy_contract();

        let task_id: felt252 = 1.into();
        let token_address: ContractAddress = 100.into();
        let description: felt252 = 42.into();
        let reward: u256 = 10.into();
        let required_completions: u32 = 5;

        let result = contract
            .create_task(
                task_id, creator, token_address, description, reward, required_completions,
            );

        assert_eq!(result, true);

        // Optionally: assert storage
        let stored_task = contract.get_task(task_id);
        assert_eq!(stored_task.creator, creator);
        assert_eq!(stored_task.reward_per_completion, reward);
        assert_eq!(stored_task.required_completions, required_completions);

        stop_cheat_caller_address_global();
    }

    #[test]
    fn unauthorized() {
        let creator = starknet::contract_address_const::<'creator'>();
        let other_user = starknet::contract_address_const::<'other'>();
        start_cheat_caller_address_global(other_user);

        let mut contract = deploy_contract();

        let task_id: felt252 = 2.into();
        let token_address: ContractAddress = 100.into();
        let description: felt252 = 42.into();
        let reward: u256 = 10.into();
        let required_completions: u32 = 5;

        // Should panic because caller is not creator
        contract
            .create_task(
                task_id, creator, token_address, description, reward, required_completions,
            );

        stop_cheat_caller_address_global();
    }

    #[test]
    #[should_panic]
    fn duplicate_task_id_should_fail() {
        let creator = starknet::contract_address_const::<'creator'>();
        start_cheat_caller_address_global(creator);

        let mut contract = deploy_contract();
        let task_id: felt252 = 99.into();
        let token_address: ContractAddress = 123.into();

        // first creation
        contract.create_task(task_id, creator, token_address, 42.into(), 10.into(), 5);

        // second creation with same ID -> should panic
        contract.create_task(task_id, creator, token_address, 77.into(), 20.into(), 3);

        stop_cheat_caller_address_global();
    }

    #[test]
    fn zero_reward_should_work_or_fail() {
        let creator = starknet::contract_address_const::<'creator'>();
        start_cheat_caller_address_global(creator);

        let mut contract = deploy_contract();
        let task_id: felt252 = 100.into();
        let token_address: ContractAddress = 123.into();

        let result = contract.create_task(task_id, creator, token_address, 55.into(), 0.into(), 5);
        assert_eq!(result, true); // or #[should_panic] if you forbid it

        stop_cheat_caller_address_global();
    }

    #[test]
    fn event_is_emitted() {
        let creator = starknet::contract_address_const::<'creator'>();
        start_cheat_caller_address_global(creator);

        let mut contract = deploy_contract();
        let task_id: felt252 = 200.into();
        let token_address: ContractAddress = 321.into();
        let reward: u256 = 10.into();
        let required_completions: u32 = 3;

        contract
            .create_task(task_id, creator, token_address, 11.into(), reward, required_completions);

        // Example event check
        // (depending on your testing framework)
        snforge_std::assert_event_emitted!(
            contract,
            TaskCreated {
                task_id: task_id,
                creator: creator,
                token: token_address,
                reward_per_completion: reward,
                required_completions: required_completions,
            },
        );

        stop_cheat_caller_address_global();
    }
}
