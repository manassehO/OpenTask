use starknet::ContractAddress;

#[derive(Drop, Serde, Copy)]
struct ProtocolStats {
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
}

#[derive(Drop, Serde, Copy)]
struct UserStats {
    active_tasks: u128,
    completed_tasks: u128,
    rejected_submissions: u128,
    earnings_accrued: u256,
    earnings_withdrawn: u256,
}

#[derive(Drop, Serde, Copy)]
struct CreatorStats {
    tasks_created: u128,
    tasks_active: u128,
    tasks_completed: u128,
    funds_escrowed: u256,
    funds_refunded: u256,
}

#[derive(Drop, Serde, Copy)]
struct TokenStats {
    escrowed: u256,
    paid_out: u256,
    refunded: u256,
}
