#[starknet::contract]
pub mod OpenTask {
    use starknet::ContractAddress;
    use starknet::get_caller_address;
    use starknet::storage::*;

    use opentask::interfaces::Iopentask::IOpenTask;
    use opentask::types::task::{TaskDetails, TaskStatus};

    use openzeppelin::access::ownable::OwnableComponent;
    use openzeppelin::token::erc20::interface::{IERC20Dispatcher, IERC20DispatcherTrait};
    
    component!(path: OwnableComponent, storage: ownable, event: OwnableEvent);

    #[abi(embed_v0)]
    impl OwnableImpl = OwnableComponent::OwnableImpl<ContractState>;
    impl OwnableInternalImpl = OwnableComponent::InternalImpl<ContractState>;

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        #[flat]
        OwnableEvent: OwnableComponent::Event,
        TaskCreated: TaskCreated,
        TaskFunded: TaskFunded,
        TaskPaused: TaskPaused,
        TaskResumed: TaskResumed,
        TaskAssigned: TaskAssigned,
        TaskCancelled: TaskCancelled,
        TaskApplicationCancelled: TaskApplicationCancelled,
        SubmissionReceived: SubmissionReceived,
        SubmissionApproved: SubmissionApproved,
        DisputeFlagged: DisputeFlagged,
        DisputeResolved: DisputeResolved,
        RewardPaid: RewardPaid,
    }

    #[derive(Drop, starknet::Event)]
    struct TaskCreated {
        #[key]
        task_id: felt252,
        #[key]
        creator: ContractAddress,
        token: ContractAddress,
        reward_per_completion: u256,
        required_completions: u32,
    }

    #[derive(Drop, starknet::Event)]
    struct TaskFunded {
        #[key]
        task_id: felt252,
        #[key]
        funder: ContractAddress,
        amount: u256,
        token: ContractAddress,
    }

    #[derive(Drop, starknet::Event)]
    struct TaskPaused {
        #[key]
        task_id: felt252,
    }

    #[derive(Drop, starknet::Event)]
    struct TaskResumed {
        #[key]
        task_id: felt252,
    }

    #[derive(Drop, starknet::Event)]
    struct TaskAssigned {
        #[key]
        task_id: felt252,
        #[key]
        application_id: felt252,
    }

    #[derive(Drop, starknet::Event)]
    struct TaskCancelled {
        #[key]
        task_id: felt252,
    }

    #[derive(Drop, starknet::Event)]
    struct TaskApplicationCancelled {
        #[key]
        task_id: felt252,
        #[key]
        application_id: felt252,
    }

    #[derive(Drop, starknet::Event)]
    struct SubmissionReceived {
        #[key]
        task_id: felt252,
        #[key]
        submission_id: felt252,
        #[key]
        completer: ContractAddress,
    }

    #[derive(Drop, starknet::Event)]
    struct SubmissionApproved {
        #[key]
        task_id: felt252,
        #[key]
        submission_id: felt252,
        #[key]
        completer: ContractAddress,
    }

    #[derive(Drop, starknet::Event)]
    struct DisputeFlagged {
        #[key]
        task_id: felt252,
        #[key]
        completer: ContractAddress,
        submission_id: felt252,
    }

    #[derive(Drop, starknet::Event)]
    struct DisputeResolved {
        #[key]
        task_id: felt252,
        #[key]
        completer: ContractAddress,
        #[key]
        submission_id: felt252,
        resolver: ContractAddress,
        approved: bool,
    }

    // Reward-related events
    #[derive(Drop, starknet::Event)]
    struct RewardPaid {
        #[key]
        task_id: felt252,
        #[key]
        completer: ContractAddress,
        submission_id: Option<felt252>,
        amount: u256,
        token: ContractAddress,
    }

    #[storage]
    struct Storage {
        #[substorage(v0)]
        ownable: OwnableComponent::Storage,
        tasks: Map<felt252, TaskDetails>,
    }

    #[constructor]
    fn constructor(ref self: ContractState, admin: ContractAddress) {
        self.ownable.initializer(admin);
    }

    #[abi(embed_v0)]
    impl OpenTaskImpl of IOpenTask<ContractState> {
        fn create_task(
            ref self: ContractState,
            task_id: felt252,
            creator: ContractAddress,
            token_address: ContractAddress,
            reward_per_completion: u256,
            required_completions: u32,
        ) -> bool {
            // Caller identity must match provided creator for consistency
            let caller = get_caller_address();
            assert(caller == creator, 'NOT_CREATOR');

            // Initialize task storage entry
            let details = TaskDetails {
                creator: creator,
                token_address: token_address,
                reward_per_completion: reward_per_completion,
                total_funded_amount: 0_u256,
                required_completions: required_completions,
                completed_count: 0_u32,
                status: TaskStatus::Draft,
            };

            self.tasks.write(task_id, details);

            self.emit(TaskCreated {
                task_id: task_id,
                creator: creator,
                token: token_address,
                reward_per_completion: reward_per_completion,
                required_completions: required_completions,
            });

            true
        }
    }
}
