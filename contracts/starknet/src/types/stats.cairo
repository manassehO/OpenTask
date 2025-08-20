use starknet::ContractAddress;

#[derive(Drop, Serde, Copy)]
pub struct ProtocolStats {
    pub total_tasks_created: u128,
    pub total_tasks_active: u128,
    pub total_tasks_completed: u128,
    pub total_submissions: u128,
    pub total_disputes_open: u128,
    pub total_disputes_resolved: u128,
    pub total_unique_creators: u128,
    pub total_unique_workers: u128,
    pub total_funds_escrowed: u256,
    pub total_funds_paid_out: u256,
    pub total_funds_refunded: u256,
}

#[derive(Drop, Serde, Copy)]
pub struct UserStats {
    pub active_tasks: u128,
    pub completed_tasks: u128,
    pub rejected_submissions: u128,
    pub earnings_accrued: u256,
    pub earnings_withdrawn: u256,
}

#[derive(Drop, Serde, Copy)]
pub struct CreatorStats {
    pub tasks_created: u128,
    pub tasks_active: u128,
    pub tasks_completed: u128,
    pub funds_escrowed: u256,
    pub funds_refunded: u256,
}

#[derive(Drop, Serde, Copy)]
pub struct TokenStats {
    pub escrowed: u256,
    pub paid_out: u256,
    pub refunded: u256,
}
