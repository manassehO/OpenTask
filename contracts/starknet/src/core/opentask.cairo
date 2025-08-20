#[starknet::contract]
pub mod OpenTask {
    // Core imports

    // Component imports
    use OwnableComponent::InternalTrait;
    use core::num::traits::Zero;

    // OpenTask specific imports
    use opentask::interfaces::Iopentask::IOpenTask;
    use opentask::types::stats::{CreatorStats, ProtocolStats, TokenStats, UserStats};
    use opentask::types::task::{DisputeInfo, TaskDetails, TaskStatus};

    // OpenZeppelin imports
    use openzeppelin::access::ownable::OwnableComponent;
    use openzeppelin::token::erc20::interface::{IERC20Dispatcher, IERC20DispatcherTrait};

    // Starknet imports
    use starknet::storage::{*, StoragePointerReadAccess};
    use starknet::storage::{
        Map, MutableVecTrait, StorageMapReadAccess, StoragePathEntry,
        StoragePointerWriteAccess, Vec, VecTrait,
    };
    use starknet::{ContractAddress, get_caller_address, get_contract_address};
    
    // Component imports
    use OwnableComponent::InternalTrait;

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
        TaskUpdated: TaskUpdated,
        TaskClaimed: TaskClaimed,
        TaskPaused: TaskPaused,
        TaskResumed: TaskResumed,
        TaskAssigned: TaskAssigned,
        TaskCancelled: TaskCancelled,
        TaskApplicationCancelled: TaskApplicationCancelled,
        SubmissionReceived: SubmissionReceived,
        SubmissionApproved: SubmissionApproved,
        SubmissionRejected: SubmissionRejected,
        TaskCompleted: TaskCompleted,
        ApplicationSubmitted: ApplicationSubmitted,
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
    struct TaskUpdated {
        #[key]
        task_id: felt252,
        #[key]
        creator: ContractAddress,
        token_address: ContractAddress,
        description: felt252,
        reward_per_completion: u256,
        required_completions: u32,
    }

    #[derive(Drop, starknet::Event)]
    struct TaskClaimed {
        #[key]
        task_id: felt252,
        #[key]
        application_id: felt252,
        #[key]
        claimant: ContractAddress,
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
    struct SubmissionRejected {
        #[key]
        task_id: felt252,
        #[key]
        submission_id: felt252,
        #[key]
        completer: ContractAddress,
        reason: felt252,
    }

    #[derive(Drop, starknet::Event)]
    struct TaskCompleted {
        #[key]
        task_id: felt252,
        #[key]
        creator: ContractAddress,
        total_completions: u32,
        total_rewards_paid: u256,
    }

    #[derive(Drop, starknet::Event)]
    struct ApplicationSubmitted {
        #[key]
        task_id: felt252,
        #[key]
        application_id: felt252,
        #[key]
        applicant: ContractAddress,
        timestamp: u64,
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
        task_submissions: Map<felt252, Vec<felt252>>, // Tracks submission IDs per task
        task_disputes: Map<felt252, Vec<felt252>>, // Tracks dispute submission IDs per task


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

        fn pause_task(ref self: ContractState, task_id: felt252) -> bool {
            // Validation: Check task exists
            let mut task = self.tasks.entry(task_id).read();
            let caller = get_caller_address();
            assert(task.creator.is_non_zero(), 'TASK_NOT_EXISTS');
            assert(caller == self.ownable.owner() || caller == task.creator, 'INVALID_CALLER');
            assert(task.status == TaskStatus::Active, 'TASK_NOT_ACTIVE');

            task.status = TaskStatus::Paused;

            self.tasks.write(task_id, task);

            // Events: Emit TaskFunded event
            self.emit(TaskPaused { task_id });
            true
        }

        fn resume_task(ref self: ContractState, task_id: felt252) -> bool {
            // Validation: Check task exists
            let mut task = self.tasks.entry(task_id).read();
            let caller = get_caller_address();
            assert(task.creator.is_non_zero(), 'TASK_NOT_EXISTS');
            assert(caller == self.ownable.owner() || caller == task.creator, 'INVALID_CALLER');
            assert(task.status == TaskStatus::Paused, 'TASK_NOT_PAUSED');

            task.status = TaskStatus::Active;

            self.tasks.write(task_id, task);

            // Events: Emit TaskFunded event
            self.emit(TaskResumed { task_id });
            true
        }

        fn cancel_task(ref self: ContractState, task_id: felt252) -> bool {
            // Validation: Check task exists
            let mut task = self.tasks.entry(task_id).read();
            let caller = get_caller_address();
            assert(task.creator.is_non_zero(), 'TASK_NOT_EXISTS');
            assert(caller == self.ownable.owner() || caller == task.creator, 'INVALID_CALLER');

            let refund = task.total_funded_amount
                - (task.completed_count.try_into().unwrap() * task.reward_per_completion);

            let token = IERC20Dispatcher { contract_address: task.token_address };
            let transfer_success = token.transfer(task.creator, refund);
            assert(transfer_success, 'TRANSFER_FAILED');

            task.status = TaskStatus::Cancelled;

            self.tasks.write(task_id, task);

            // Events: Emit TaskFunded event
            self.emit(TaskCancelled { task_id });
            true
        }

        fn fund_task(
            ref self: ContractState, task_id: felt252, token_address: ContractAddress, amount: u256,
        ) -> bool {
            // Validation: Check task exists
            let mut task = self.tasks.entry(task_id).read();
            assert(task.creator.is_non_zero(), 'TASK_NOT_EXISTS');

            // Verify token_address matches task's token
            assert(task.token_address == token_address, 'TOKEN_MISMATCH');

            // Validate amount > 0
            assert(amount > 0, 'INVALID_AMOUNT');

            // Ensure the total deposited amount matches the campaign requirements.
            // The creator must deposit exactly `reward_per_completion * required_completions`
            // so that rewards can be fairly distributed to all expected participants.
            let total_required_amount = task.reward_per_completion
                * task.required_completions.into();
            assert(amount == total_required_amount, 'MISMATCHED_TOTAL_REWARD');
            assert(task.total_funded_amount == 0_u256, 'ALREADY_FUNDED');

            // Get caller address for token transfer
            let caller = get_caller_address();
            let contract_address = starknet::get_contract_address();

            // Token Transfer: Transfer tokens from caller to contract
            let token = IERC20Dispatcher { contract_address: token_address };
            let allowance = token.allowance(caller, contract_address);
            assert(allowance < amount, 'INSUFFICIENT_ALLOWANCE');
            let transfer_success = token.transfer_from(caller, contract_address, amount);
            assert(transfer_success, 'TRANSFER_FAILED');

            // Storage Updates: Increase total_funded_amount by amount
            task.total_funded_amount += amount;
            task.status = TaskStatus::Active;

            self.tasks.write(task_id, task);

            // Events: Emit TaskFunded event
            self
                .emit(
                    TaskFunded {
                        task_id: task_id, funder: caller, amount: amount, token: token_address,
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

            // Store the submission ID in the `task_disputes` mapping for iteration
            self.task_disputes.entry(task_id).push(submission_id);

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
            true
        }

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

        fn update_task(
            ref self: ContractState,
            task_id: felt252,
            creator: ContractAddress,
            token_address: ContractAddress,
            description: felt252,
            reward_per_completion: u256,
            required_completions: u32,
        ) -> bool {
            // TODO: Implement update task logic

            // Emit TaskUpdated event
            self
                .emit(
                    TaskUpdated {
                        task_id: task_id,
                        creator: creator,
                        token_address: token_address,
                        description: description,
                        reward_per_completion: reward_per_completion,
                        required_completions: required_completions,
                    },
                );

            true
        }

        fn get_task(self: @ContractState, task_id: felt252) -> TaskDetails {
            // TODO: Implement get task logic
            self.tasks.read(task_id)
        }

        fn claim_task(ref self: ContractState, task_id: felt252, application_id: felt252) -> bool {
            // TODO: Implement claim task logic

            let caller = get_caller_address();

            // Emit TaskClaimed event
            self
                .emit(
                    TaskClaimed {
                        task_id: task_id, application_id: application_id, claimant: caller,
                    },
                );

            true
        }

        fn assign_task(ref self: ContractState, task_id: felt252, application_id: felt252) -> bool {
            // TODO: Implement assign task logic

            // Emit TaskAssigned event
            self.emit(TaskAssigned { task_id: task_id, application_id: application_id });

            true
        }

        fn submit_completion(
            ref self: ContractState,
            task_id: felt252,
            submission_id: felt252,
            submission_data: felt252,
        ) -> bool {
            // TODO: Implement submit completion logic

            let caller = get_caller_address();

            // Update task_submissions
            self.task_submissions.entry(task_id).push(submission_id);

            // Emit SubmissionReceived event
            self
                .emit(
                    SubmissionReceived {
                        task_id: task_id, submission_id: submission_id, completer: caller,
                    },
                );

            true
        }

        fn approve_completion(
            ref self: ContractState, task_id: felt252, submission_id: felt252, status: bool,
        ) -> bool {
            // TODO: Implement approve completion logic

            let caller = get_caller_address();

            if status {
                // Emit SubmissionApproved event
                self
                    .emit(
                        SubmissionApproved {
                            task_id: task_id, submission_id: submission_id, completer: caller,
                        },
                    );
                // TODO: Emit RewardPaid event when payment is processed
            // TODO: Check if task is completed and emit TaskCompleted
            } else {
                // Emit SubmissionRejected event
                self
                    .emit(
                        SubmissionRejected {
                            task_id: task_id,
                            submission_id: submission_id,
                            completer: caller,
                            reason: 0 // TODO: Add proper reason code
                        },
                    );
            }

            true
        }

        fn cancel_task_application(
            ref self: ContractState, task_id: felt252, application_id: felt252,
        ) -> bool {
            // Validate that the task exists before attempting to cancel an application for it.
            let task = self.tasks.read(task_id);
            assert(!task.creator.is_zero(), 'TASK_NOT_FOUND');

            // TODO: claim_task mapping
            // there is no explicit storage for applications/claims in the contract's Storage struct
            
            // Emit TaskApplicationCancelled event
            self
                .emit(
                    TaskApplicationCancelled { task_id: task_id, application_id: application_id },
                );

            true
        }

        fn get_submissions(self: @ContractState, task_id: felt252) -> Array<felt252> {
            let submissions_vec = self.task_submissions.entry(task_id);
            let mut all_submissions = ArrayTrait::new();
            let len = submissions_vec.len();
            for i in 0..len {
                all_submissions.append(submissions_vec.at(i).read());
            };
            all_submissions
            
        }

        fn get_disputes(self: @ContractState, task_id: felt252) -> Array<felt252> {
            let disputes_vec = self.task_disputes.entry(task_id);
            let mut all_disputes = ArrayTrait::new();
            let len = disputes_vec.len();
            for i in 0..len {
                all_disputes.append(disputes_vec.at(i).read());
            };
            all_disputes
        }

        fn get_protocol_stats(self: @ContractState) -> ProtocolStats {
            // TODO: Implement get protocol stats logic
            ProtocolStats {
                total_tasks_created: 0_u128,
                total_tasks_active: 0_u128,
                total_tasks_completed: 0_u128,
                total_submissions: 0_u128,
                total_disputes_open: 0_u128,
                total_disputes_resolved: 0_u128,
                total_unique_creators: 0_u128,
                total_unique_workers: 0_u128,
                total_funds_escrowed: 0_u256,
                total_funds_paid_out: 0_u256,
                total_funds_refunded: 0_u256,
            }
        }

        fn get_user_stats(self: @ContractState, user: ContractAddress) -> UserStats {
            // TODO: Implement get user stats logic
            UserStats {
                active_tasks: 0_u128,
                completed_tasks: 0_u128,
                rejected_submissions: 0_u128,
                earnings_accrued: 0_u256,
                earnings_withdrawn: 0_u256,
            }
        }

        fn get_creator_stats(self: @ContractState, creator: ContractAddress) -> CreatorStats {
            // TODO: Implement get creator stats logic
            CreatorStats {
                tasks_created: 0_u128,
                tasks_active: 0_u128,
                tasks_completed: 0_u128,
                funds_escrowed: 0_u256,
                funds_refunded: 0_u256,
            }
        }

        fn get_token_stats(self: @ContractState, token: ContractAddress) -> TokenStats {
            // TODO: Implement get token stats logic
            TokenStats { escrowed: 0_u256, paid_out: 0_u256, refunded: 0_u256 }
        }
    }
}
