#[starknet::contract]
pub mod OpenTask {

    use OwnableComponent::InternalTrait;
    use core::num::traits::zero;
    use opentask::interfaces::Iopentask::IOpenTask;
    use opentask::types::task::{TaskDetails, TaskStatus,DisputeInfo};
    use openzeppelin::access::ownable::OwnableComponent;
    use openzeppelin::token::erc20::interface::{IERC20Dispatcher, IERC20DispatcherTrait};
    use starknet::storage::{*, StoragePointerReadAccess};
    use starknet::{ContractAddress, get_caller_address};


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
        EarningsWithdrawn: EarningsWithdrawn,
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


    #[derive(Drop, starknet::Event)]
    struct EarningsWithdrawn {
        #[key]
        user: ContractAddress,
        #[key]
        token: ContractAddress,
        amount: u256,
    }


    ///////////////  STORAGE /////////////////
    #[storage]
    struct Storage {
        #[substorage(v0)]
        ownable: OwnableComponent::Storage,
        tasks: Map<felt252, TaskDetails>,
        disputes: Map<(felt252, felt252), DisputeInfo>, // (task_id, submission_id) → DisputeInfo
        user_earnings: Map<(ContractAddress, ContractAddress), u256>,
        user_tokens: Map<ContractAddress, Vec<ContractAddress>>,

    }
    ///////////////  CONSTRUCTOR  ///////////////
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
            description: felt252,
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
                description,
                reward_per_completion: reward_per_completion,
                total_funded_amount: 0_u256,
                required_completions: required_completions,
                completed_count: 0_u32,
                status: TaskStatus::Draft,
            };

            self.tasks.write(task_id, details);

            self
                .emit(
                    TaskCreated {
                        task_id: task_id,
                        creator: creator,
                        token: token_address,
                        reward_per_completion: reward_per_completion,
                        required_completions: required_completions,
                    },
                );

            true
        }


        fn dispute_task(ref self: ContractState, task_id: felt252, submission_id: felt252) -> bool {
            let caller = get_caller_address();

            let task: TaskDetails = self.tasks.read(task_id);
            assert(!task.creator.is_zero(), 'TASK_NOT_FOUND');
            assert(task.status != TaskStatus::Disputed, 'TASK_ALREADY_DISPUTED');

            // Create dispute record
            let dispute_info = DisputeInfo {
                task_id, completer_address: caller, submission_id, resolved: false,
            };
            self.disputes.entry((task_id, submission_id)).write(dispute_info);

            // Update task status to Disputed
            let mut updated_task = task;
            updated_task.status = TaskStatus::Disputed;
            self.tasks.write(task_id, updated_task);

            self.emit(DisputeFlagged { task_id, completer: caller, submission_id });

            true
        }

        fn resolve_dispute(
            ref self: ContractState,
            task_id: felt252,
            submission_id: felt252,
            status: bool,
            verdict: felt252,
        ) -> bool {
            let caller = get_caller_address();
            self.ownable.assert_only_owner();

            let mut dispute = self.disputes.read((task_id, submission_id));

            assert(!dispute.completer_address.is_zero(), 'DISPUTE_NOT_FOUND');
            assert(!dispute.resolved, 'DISPUTE_ALREADY_RESOLVED');

            dispute.resolved = true;
            self.disputes.write((task_id, submission_id), dispute);

            let mut task = self.tasks.read(task_id);
            task.status = if status {
                // add process payment here !

                TaskStatus::Active
            } else {
                TaskStatus::Cancelled
            };
            self.tasks.write(task_id, task);

            self
                .emit(
                    DisputeResolved {
                        task_id,
                        completer: dispute.completer_address,
                        submission_id,
                        resolver: caller,
                        approved: status,
                    },
                );


        fn get_users_earning(self: @ContractState, user_address: ContractAddress) -> u256 {
            let mut total_earnings = 0_u256;

            let tokens_vec = self.user_tokens.entry(user_address);

            let len = tokens_vec.len();
            let mut i = 0;

            while i != len {
               
                let token = tokens_vec.at(i).read(); 
                let key = (user_address, token);
                let earning = self.user_earnings.read(key);
                total_earnings += earning;

                i += 1;
            }

            total_earnings
        }


        fn withdraw_earnings(ref self: ContractState, user_address: ContractAddress) -> bool {
            let caller = get_caller_address();
            assert(caller == user_address, 'NOT_OWNER_OF_FUNDS');

            let tokens = self.user_tokens.entry(user_address);

            let mut any_funds = false;

            let mut i = 0;
            let len = tokens.len();

            while i != len {
                let token = tokens.at(i).read();
                let key = (user_address, token);
                let earnings = self.user_earnings.read(key);

                if earnings > 0_u256 {
                    any_funds = true;

                    self.user_earnings.write(key, 0_u256);

                    let client = IERC20Dispatcher { contract_address: token };
                    client.transfer(user_address, earnings);

                    self.emit(EarningsWithdrawn { user: user_address, token, amount: earnings });
                }

                i += 1;
            }

            assert(any_funds, 'NO_FUNDS');

            true
        }
    }
}
