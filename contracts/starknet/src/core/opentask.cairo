#[starknet::contract]
pub mod OpenTask {
    // Core imports

    // Component imports
    use OwnableComponent::InternalTrait;
    use core::num::traits::Zero;
    use opentask::errors::Errors;

    // OpenTask specific imports
    use opentask::interfaces::Iopentask::IOpenTask;
    use opentask::types::stats::{CreatorStats, ProtocolStats, TokenStats, UserStats};
    use opentask::types::task::{DisputeInfo, TaskDetails, TaskStatus};

    // OpenZeppelin imports
    use openzeppelin::access::ownable::OwnableComponent;
    use openzeppelin::token::erc20::interface::{IERC20Dispatcher, IERC20DispatcherTrait};

    // Starknet imports
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
        TaskUpdated: TaskUpdated,
        TaskClaimed: TaskClaimed,
        TaskPaused: TaskPaused,
        TaskResumed: TaskResumed,
        TaskAssigned: TaskAssigned,
        TaskCancelled: TaskCancelled,
        FundsEscrowed: FundsEscrowed,
        FundsReleased: FundsReleased,
        FundsRefunded: FundsRefunded,
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
    struct FundsEscrowed {
        #[key]
        task_id: felt252,
        #[key]
        token: ContractAddress,
        #[key]
        amount: u256,
    }

    #[derive(Drop, starknet::Event)]
    struct FundsReleased {
        #[key]
        user: ContractAddress,
        #[key]
        token: ContractAddress,
        #[key]
        amount: u256,
    }

    #[derive(Drop, starknet::Event)]
    struct FundsRefunded {
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
        paused: bool,
        reentrant_locked: bool,
        tasks: Map<felt252, TaskDetails>,
        disputes: Map<(felt252, felt252), DisputeInfo>, // (task_id, submission_id) → DisputeInfo
        user_earnings: Map<(ContractAddress, ContractAddress), u256>,
        user_tokens: Map<ContractAddress, Vec<ContractAddress>>,
        // Protocol-level counters
        total_tasks_created: u128,
        total_tasks_active: u128,
        total_tasks_completed: u128,
        total_submissions: u128,
        total_disputes_open: u128,
        total_disputes_resolved: u128,
        total_unique_creators: u128,
        total_unique_workers: u128,
        total_funds_escrowed: u256,
        total_funds_paid_out: u256,
        total_funds_refunded: u256,
        // Per-user (worker) aggregates
        user_stats: Map<ContractAddress, UserStats>,
        // Per-creator aggregates
        creator_stats: Map<ContractAddress, CreatorStats>,
        // Per-token aggregates
        token_stats: Map<ContractAddress, TokenStats>,
        // Uniques tracking (bool flags)
        is_creator_seen: Map<ContractAddress, bool>,
        is_worker_seen: Map<ContractAddress, bool>,
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
            // Paused guard
            assert(!self.paused.read(), Errors::PAUSED);

            // Caller identity must match provided creator for consistency
            let caller = get_caller_address();
            assert(caller == creator, Errors::NOT_CREATOR);
            assert(!creator.is_zero(), Errors::ZERO_ADDRESS);
            assert(!token_address.is_zero(), Errors::ZERO_ADDRESS);
            assert(reward_per_completion > 0, Errors::INVALID_AMOUNT);
            assert(required_completions > 0, Errors::INVALID_AMOUNT);

            let prev_total_tasks = self.total_tasks_created.read();
            let prev_active_tasks = self.total_tasks_active.read();

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
            self.total_tasks_created.write(prev_total_tasks + 1);
            self.total_tasks_active.write(prev_active_tasks + 1);

            let mut prev_creator_stats = self.creator_stats.read(caller);

            if prev_creator_stats.tasks_created == 0 {
                self.is_creator_seen.write(caller, true);
                self.total_unique_creators.write(self.total_unique_creators.read() + 1);
            }

            prev_creator_stats.tasks_created += 1;
            prev_creator_stats.tasks_active += 1;

            self.creator_stats.write(caller, prev_creator_stats);

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
            assert(task.creator.is_non_zero(), Errors::TASK_NOT_EXISTS);
            assert(
                caller == self.ownable.owner() || caller == task.creator, Errors::NOT_AUTHORIZED,
            );
            assert(task.status == TaskStatus::Active, Errors::TASK_NOT_ACTIVE);

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
            assert(task.creator.is_non_zero(), Errors::TASK_NOT_EXISTS);
            assert(
                caller == self.ownable.owner() || caller == task.creator, Errors::NOT_AUTHORIZED,
            );
            assert(task.status == TaskStatus::Paused, Errors::TASK_NOT_PAUSED);

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
            assert(task.creator.is_non_zero(), Errors::TASK_NOT_EXISTS);
            assert(
                caller == self.ownable.owner() || caller == task.creator, Errors::NOT_AUTHORIZED,
            );

            let refund = task.total_funded_amount
                - (task.completed_count.try_into().unwrap() * task.reward_per_completion);

            let token = IERC20Dispatcher { contract_address: task.token_address };
            let transfer_success = token.transfer(task.creator, refund);
            assert(transfer_success, Errors::TRANSFER_FAILED);

            task.status = TaskStatus::Cancelled;

            self.tasks.write(task_id, task);

            self.total_tasks_active.write(self.total_tasks_active.read() - 1);
            self
                .total_funds_refunded
                .write(self.total_funds_refunded.read() - task.total_funded_amount);

            let mut creator_stats = self.creator_stats.read(task.creator);
            creator_stats.funds_refunded += refund;
            self.creator_stats.write(task.creator, creator_stats);

            let mut token_stats = self.token_stats.read(task.token_address);
            token_stats.refunded += refund;
            self.token_stats.write(task.token_address, token_stats);

            // Events: Emit TaskFunded event
            self.emit(TaskCancelled { task_id });
            true
        }

        fn fund_task(
            ref self: ContractState, task_id: felt252, token_address: ContractAddress, amount: u256,
        ) -> bool {
            // Paused + Reentrancy guards
            assert(!self.paused.read(), Errors::PAUSED);
            assert(!self.reentrant_locked.read(), Errors::REENTRANT);
            self.reentrant_locked.write(true);

            // Validation: Check task exists
            let mut task = self.tasks.entry(task_id).read();
            assert(task.creator.is_non_zero(), Errors::TASK_NOT_EXISTS);

            // Verify token_address matches task's token
            assert(task.token_address == token_address, Errors::TOKEN_MISMATCH);

            // Validate amount > 0
            assert(amount > 0, Errors::INVALID_AMOUNT);

            let prev_total_funds_escrowed = self.total_funds_escrowed.read();

            // Ensure the total deposited amount matches the campaign requirements.
            // The creator must deposit exactly `reward_per_completion * required_completions`
            // so that rewards can be fairly distributed to all expected participants.
            let total_required_amount = task.reward_per_completion
                * task.required_completions.into();
            assert(amount == total_required_amount, Errors::MISMATCHED_TOTAL_REWARD);
            assert(task.total_funded_amount == 0_u256, Errors::ALREADY_FUNDED);

            // Get caller address for token transfer
            let caller = get_caller_address();
            let contract_address = starknet::get_contract_address();

            // Token Transfer: Transfer tokens from caller to contract
            let token = IERC20Dispatcher { contract_address: token_address };
            let allowance = token.allowance(caller, contract_address);
            assert(allowance < amount, Errors::INSUFFICIENT_ALLOWANCE);
            let transfer_success = token.transfer_from(caller, contract_address, amount);
            assert(transfer_success, Errors::TRANSFER_FAILED);

            // Storage Updates: Increase total_funded_amount by amount
            task.total_funded_amount += amount;
            task.status = TaskStatus::Active;

            self.tasks.write(task_id, task);

            self.total_funds_escrowed.write(prev_total_funds_escrowed + 1);

            let mut prev_creator_stats = self.creator_stats.read(task.creator);

            prev_creator_stats.funds_escrowed += amount;
            self.creator_stats.write(task.creator, prev_creator_stats);

            let mut prev_token_stats = self.token_stats.read(task.token_address);

            prev_token_stats.escrowed += amount;
            self.token_stats.write(task.token_address, prev_token_stats);

            // Events: Emit TaskFunded event
            self
                .emit(
                    TaskFunded {
                        task_id: task_id, funder: caller, amount: amount, token: token_address,
                    },
                );
            self.reentrant_locked.write(false);

            self.emit(FundsEscrowed { task_id: task_id, token: token_address, amount: amount });
            true
        }

        fn create_and_fund_task(
            ref self: ContractState,
            task_id: felt252,
            creator: ContractAddress,
            token_address: ContractAddress,
            description: felt252,
            reward_per_completion: u256,
            required_completions: u32,
        ) -> bool {
            let caller = get_caller_address();
            assert(caller == creator, 'NOT_CREATOR');

            let existing_task = self.tasks.entry(task_id).read();
            assert(existing_task.creator.is_zero(), 'TASK_ALREADY_EXISTS');

            assert(reward_per_completion > 0, 'INVALID_REWARD_AMOUNT');

            assert(required_completions > 0, 'INVALID_COMPLETION_COUNT');

            let total_amount = reward_per_completion
                * required_completions.try_into().expect('failed to convert');

            let contract_address = starknet::get_contract_address();
            let token = IERC20Dispatcher { contract_address: token_address };

            let balance = token.balance_of(caller);
            assert(balance > total_amount, 'INSUFFICIENT BALANCE');

            let allowance = token.allowance(caller, contract_address);
            assert(allowance >= total_amount, 'INSUFFICIENT_ALLOWANCE');

            let transfer_success = token.transfer_from(caller, contract_address, total_amount);
            assert(transfer_success, 'TRANSFER_FAILED');

            let details = TaskDetails {
                creator: creator,
                token_address: token_address,
                description: description,
                reward_per_completion: reward_per_completion,
                total_funded_amount: total_amount,
                required_completions: required_completions,
                completed_count: 0_u32,
                status: TaskStatus::Active,
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

            self
                .emit(
                    TaskFunded {
                        task_id: task_id,
                        funder: caller,
                        amount: total_amount,
                        token: token_address,
                    },
                );

            true
        }

        fn dispute_task(ref self: ContractState, task_id: felt252, submission_id: felt252) -> bool {
            let caller = get_caller_address();

            let task: TaskDetails = self.tasks.read(task_id);
            assert(!task.creator.is_zero(), Errors::TASK_NOT_FOUND);
            assert(task.status != TaskStatus::Disputed, Errors::TASK_ALREADY_DISPUTED);

            // Create dispute record
            let dispute_info = DisputeInfo {
                task_id, completer_address: caller, submission_id, resolved: false,
            };
            self.disputes.entry((task_id, submission_id)).write(dispute_info);

            // Update task status to Disputed
            let mut updated_task = task;
            updated_task.status = TaskStatus::Disputed;
            self.tasks.write(task_id, updated_task);

            self.total_disputes_open.write(self.total_disputes_open.read() + 1);

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

            assert(!dispute.completer_address.is_zero(), Errors::DISPUTE_NOT_FOUND);
            assert(!dispute.resolved, Errors::DISPUTE_ALREADY_RESOLVED);

            dispute.resolved = true;
            self.disputes.write((task_id, submission_id), dispute);

            let mut task = self.tasks.read(task_id);
            let mut token_stats = self.token_stats.read(task.token_address);
            task
                .status =
                    if status {
                        // add process payment here !

                        self
                            .total_funds_paid_out
                            .write(self.total_funds_paid_out.read() + task.reward_per_completion);
                        token_stats.paid_out += task.reward_per_completion;
                        self.token_stats.write(task.token_address, token_stats);

                        self.emit(FundsRefunded { task_id });

                        TaskStatus::Active
                    } else {
                        TaskStatus::Cancelled
                    };
            self.tasks.write(task_id, task);

            self.total_disputes_open.write(self.total_disputes_open.read() - 1);
            self.total_disputes_resolved.write(self.total_disputes_resolved.read() + 1);

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
            assert(!self.paused.read(), Errors::PAUSED);
            assert(!self.reentrant_locked.read(), Errors::REENTRANT);
            self.reentrant_locked.write(true);
            let caller = get_caller_address();
            assert(caller == user_address, Errors::NOT_OWNER_OF_FUNDS);

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

                    let mut user_stats = self.user_stats.read(caller);

                    if user_stats.earnings_withdrawn == 0 {
                        self.is_worker_seen.write(caller, true);
                        self.total_unique_workers.write(self.total_unique_workers.read() + 1);
                    }

                    user_stats.earnings_withdrawn += earnings;

                    self.emit(EarningsWithdrawn { user: user_address, token, amount: earnings });

                    self.emit(FundsReleased { user: user_address, token, amount: earnings });
                }

                i += 1;
            }

            assert(any_funds, Errors::NO_FUNDS);
            self.reentrant_locked.write(false);
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
             //Validation: check task exists
           let mut task = self.tasks.entry(task_id).read();
            assert(task.creator.is_non_zero(), 'Task does not exit');

            //Authorization: only the task creator can update
            let caller = get_caller_address();
            assert(task.creator == caller, 'Only creator can update task');

            //Verify task is active
            assert(task.status == TaskStatus::Active, 'Task is not active');
            assert(task.token_address ==token_address, 'Token mismatch');
            assert(required_completions >= task.completed_count, 'Cannot reduce below completed');
            
            //Handle funding/refund logic
            let old_total_required = task.reward_per_completion * task.required_completions.into();
            let new_total_required = reward_per_completion * required_completions.into();
            
            if new_total_required > old_total_required {
                // Need additional funding
                let additional  = new_total_required - old_total_required;
                
                let contract_address = starknet::get_contract_address();
                let token = IERC20Dispatcher { contract_address: token_address };

                let allowance = token.allowance(caller, contract_address);
                assert(allowance >= additional, 'insufficient allowance');
                
                let transfer_success= token.transfer_from( caller, contract_address, additional );
                assert(transfer_success, 'Additional funding failed');

                task.total_funded_amount += additional;
                }else if new_total_required < old_total_required {
                // Refund excess funding
                let refund = old_total_required - new_total_required;

                let token = IERC20Dispatcher { contract_address: token_address };

                let refund_success = token.transfer( caller, refund );
                assert(refund_success, 'Refund transfer failed');

                task.total_funded_amount -= refund;
                }

                //Storage updates: apply new parameters
                let updated_task = TaskDetails {
                creator: task.creator,
                token_address: task.token_address,
                description: description,
                reward_per_completion: reward_per_completion,
                required_completions: required_completions,
                completed_count: task.completed_count,
                total_funded_amount: new_total_required, 
                status: task.status,
    };

                self.tasks.write(task_id, updated_task);

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
            let mut task = self.tasks.read(task_id);

            // set default values for non-existent tasks
            if task.creator.is_zero() {
                task.creator = 0.try_into().unwrap();
                task.token_address = 0.try_into().unwrap();
                task.description = 0;
                task.reward_per_completion = 0;
                task.total_funded_amount = 0;
                task.required_completions = 0;
                task.completed_count = 0;
                task.status = TaskStatus::Draft;
            }

            task
        }

        fn claim_task(ref self: ContractState, task_id: felt252, application_id: felt252) -> bool {
            // TODO: Implement claim task logic

            let caller = get_caller_address();
            let mut user_stats = self.user_stats.read(caller);

            user_stats.active_tasks += 1;

            self.user_stats.write(caller, user_stats);

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

            self.total_submissions.write(self.total_submissions.read() + 1);

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
            let task: TaskDetails = self.tasks.read(task_id);

            // TODO: Get the submission completer and replace
            let user = caller;
            let mut user_stats = self.user_stats.read(user);

            if status {
                let mut token_stats = self.token_stats.read(task.token_address);

                token_stats.paid_out += task.reward_per_completion;

                self.token_stats.write(task.token_address, token_stats);

                self
                    .total_funds_paid_out
                    .write(self.total_funds_paid_out.read() + task.reward_per_completion);

                user_stats.active_tasks -= 1;
                user_stats.completed_tasks += 1;
                user_stats.earnings_accrued += task.reward_per_completion;

                self.user_stats.write(user, user_stats);

                let mut creator_stats = self.creator_stats.read(task.creator);
                creator_stats.tasks_completed += 1;
                creator_stats.tasks_active -= 1;

                user_stats.completed_tasks += 1;
                user_stats.earnings_accrued += task.reward_per_completion;

                self.user_stats.write(user, user_stats);

                self.total_tasks_completed.write(self.total_tasks_completed.read() + 1);

                self.total_tasks_active.write(self.total_tasks_active.read() - 1);

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
                user_stats.rejected_submissions += 1;
                self.user_stats.write(user, user_stats);

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
            let mut task = self.tasks.read(task_id);
            let caller = get_caller_address();
            let mut user_stats = self.user_stats.read(caller);
            // TODO: Implement cancel task application logic

            user_stats.active_tasks -= 1;
            self.user_stats.write(caller, user_stats);

            self.total_tasks_active.write(self.total_tasks_active.read() - 1);
            self
                .total_funds_refunded
                .write(self.total_funds_refunded.read() + task.total_funded_amount);

            self.total_tasks_active.write(self.total_tasks_active.read() - 1);

            // Emit TaskApplicationCancelled event
            self
                .emit(
                    TaskApplicationCancelled { task_id: task_id, application_id: application_id },
                );

            true
        }

        fn get_submissions(self: @ContractState, task_id: felt252) -> Array<felt252> {
            // TODO: Implement get submissions logic
            ArrayTrait::new()
        }

        fn get_disputes(self: @ContractState, task_id: felt252) -> Array<felt252> {
            // TODO: Implement get disputes logic
            ArrayTrait::new()
        }

        fn get_protocol_stats(self: @ContractState) -> ProtocolStats {
            ProtocolStats {
                total_tasks_created: self.total_tasks_created.read(),
                total_tasks_active: self.total_tasks_active.read(),
                total_tasks_completed: self.total_tasks_completed.read(),
                total_submissions: self.total_submissions.read(),
                total_disputes_open: self.total_disputes_open.read(),
                total_disputes_resolved: self.total_disputes_resolved.read(),
                total_unique_creators: self.total_unique_creators.read(),
                total_unique_workers: self.total_unique_workers.read(),
                total_funds_escrowed: self.total_funds_escrowed.read(),
                total_funds_paid_out: self.total_funds_paid_out.read(),
                total_funds_refunded: self.total_funds_refunded.read(),
            }
        }

        fn get_user_stats(self: @ContractState, user: ContractAddress) -> UserStats {
            self.user_stats.read(user)
        }

        fn get_creator_stats(self: @ContractState, creator: ContractAddress) -> CreatorStats {
            self.creator_stats.read(creator)
        }

        fn get_token_stats(self: @ContractState, token: ContractAddress) -> TokenStats {
            self.token_stats.read(token)
        }
    }
}
