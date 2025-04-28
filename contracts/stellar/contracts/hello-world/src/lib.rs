#![no_std]
use soroban_sdk::{contract, contractimpl, vec, Env, String, Vec};

#[contract]
pub struct Contract;

#[contractimpl]
impl Contract {
    pub fn hello(env: Env, to: String) -> Vec<String> {
        // Example: Use safe addition if arithmetic is introduced
        // let result = safe_add(10, 20);
        vec![&env, String::from_str(&env, "Hello"), to]
    }
}

// Safe addition function to prevent overflows
fn safe_add(x: u32, y: u32) -> u32 {
    let result = x + y;
    assert!(result >= x, "Overflow detected");
    result
}

mod test;
