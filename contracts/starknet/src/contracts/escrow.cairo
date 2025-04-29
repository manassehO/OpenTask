use starknet::ContractAddress;

pub trait IEscrow<TContractState> {
    fn get_balance(
        self: @TContractState, token_address: ContractAddress, account: ContractAddress,
    ) -> u256;
    fn transfer_tokens(
        ref self: TContractState,
        token_address: ContractAddress,
        recipient: ContractAddress,
        amount: u256,
    ) -> bool;
    fn transfer_from_tokens(
        ref self: TContractState,
        token_address: ContractAddress,
        sender: ContractAddress,
        recipient: ContractAddress,
        amount: u256,
    ) -> bool;
    fn approve_spender(
        ref self: TContractState,
        token_address: ContractAddress,
        spender: ContractAddress,
        amount: u256,
    ) -> bool;
}

#[starknet::contract]
pub mod Escrow {
    use opentask_starknet::interface::erc20::{IERC20Dispatcher, IERC20DispatcherTrait};
    use starknet::ContractAddress;
    use super::IEscrow;

    #[storage]
    struct Storage {}

    impl Escrow of IEscrow<ContractState> {
        fn get_balance(
            self: @ContractState, token_address: ContractAddress, account: ContractAddress,
        ) -> u256 {
            IERC20Dispatcher { contract_address: token_address }.balance_of(account)
        }

        fn transfer_tokens(
            ref self: ContractState,
            token_address: ContractAddress,
            recipient: ContractAddress,
            amount: u256,
        ) -> bool {
            IERC20Dispatcher { contract_address: token_address }.transfer(recipient, amount)
        }

        fn transfer_from_tokens(
            ref self: ContractState,
            token_address: ContractAddress,
            sender: ContractAddress,
            recipient: ContractAddress,
            amount: u256,
        ) -> bool {
            IERC20Dispatcher { contract_address: token_address }
                .transfer_from(sender, recipient, amount)
        }

        fn approve_spender(
            ref self: ContractState,
            token_address: ContractAddress,
            spender: ContractAddress,
            amount: u256,
        ) -> bool {
            IERC20Dispatcher { contract_address: token_address }.approve(spender, amount)
        }
    }
}
