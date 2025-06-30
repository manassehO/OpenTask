'use client';

import { useState } from 'react';
import { Contract, CallData, cairo } from 'starknet';
import { useWallet } from './useWallet.tsx';

// Contract addresses (these would be set after deployment)
const ESCROW_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_ESCROW_CONTRACT_ADDRESS || '';
const SUBMISSION_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_SUBMISSION_CONTRACT_ADDRESS || '';
const ERC20_TOKEN_ADDRESS = process.env.NEXT_PUBLIC_ERC20_TOKEN_ADDRESS || '';

// Placeholder ABIs for development (these would be replaced with actual contract ABIs)
const ESCROW_ABI = [
  {
    "name": "transfer_tokens",
    "type": "function",
    "inputs": [
      {"name": "recipient", "type": "felt"},
      {"name": "amount", "type": "felt"}
    ],
    "outputs": []
  }
];

const SUBMISSION_ABI = [
  {
    "name": "approve_submission",
    "type": "function",
    "inputs": [
      {"name": "task_id", "type": "felt"},
      {"name": "submission_id", "type": "felt"}
    ],
    "outputs": []
  }
];

interface TaskContractHook {
  createTask: (taskDetails: CreateTaskParams) => Promise<string | null>;
  submitTask: (taskId: string, submissionData: string) => Promise<string | null>;
  approveSubmission: (taskId: string, submissionId: string, completer: string, amount: string) => Promise<string | null>;
  flagDispute: (taskId: string, submissionId: string, completer: string) => Promise<string | null>;
  resolveDispute: (taskId: string, submissionId: string, completer: string, approved: boolean) => Promise<string | null>;
  getTaskDetails: (taskId: string) => Promise<any>;
  isLoading: boolean;
  error: string | null;
}

interface CreateTaskParams {
  title: string;
  description: string;
  reward: string;
  deadline: number;
  requirements: string;
}

export const useTaskContract = (): TaskContractHook => {
  const { account, provider, isConnected } = useWallet();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createTask = async (taskDetails: CreateTaskParams): Promise<string | null> => {
    if (!account || !provider || !isConnected) {
      setError('Wallet not connected');
      return null;
    }

    if (!ESCROW_CONTRACT_ADDRESS || !SUBMISSION_CONTRACT_ADDRESS) {
      setError('Contract addresses not configured. Please check environment variables.');
      return null;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      // For development, return a mock transaction hash
       const mockTxHash = `0x${Math.random().toString(16).substr(2, 64)}`;
       
       // Simulate async operation
       await new Promise(resolve => setTimeout(resolve, 2000));
       
       return mockTxHash;

       // TODO: Uncomment when contracts are deployed
       // const escrowContract = new Contract(
       //   ESCROW_ABI,
       //   ESCROW_CONTRACT_ADDRESS,
       //   provider
       // );
       // escrowContract.connect(account);
       // const taskId = cairo.felt(Date.now().toString());
       // const callData = CallData.compile({
       //   task_id: taskId,
       //   creator: account.address,
       //   title: cairo.felt(taskDetails.title),
       //   description: cairo.felt(taskDetails.description),
       //   reward: cairo.uint256(taskDetails.reward),
       //   deadline: cairo.felt(taskDetails.deadline.toString()),
       //   requirements: cairo.felt(taskDetails.requirements),
       //   token_address: ERC20_TOKEN_ADDRESS
       // });
       // const result = await escrowContract.invoke('create_task', callData);
       // await provider.waitForTransaction(result.transaction_hash);
       // return result.transaction_hash;
    } catch (err) {
      console.error('Failed to create task:', err);
      setError('Failed to create task. Please try again.');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const submitTask = async (taskId: string, submissionData: string): Promise<string | null> => {
    if (!account || !provider || !isConnected) {
      setError('Wallet not connected');
      return null;
    }

    if (!SUBMISSION_CONTRACT_ADDRESS) {
      setError('Contract addresses not configured.');
      return null;
    }

    try {
      setIsLoading(true);
      setError(null);

      // For development, return a mock transaction hash
      const mockTxHash = `0x${Math.random().toString(16).substr(2, 64)}`;
      
      // Simulate async operation
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      return mockTxHash;

      // TODO: Uncomment when contracts are deployed
      // const submissionContract = new Contract(
      //   SUBMISSION_ABI,
      //   SUBMISSION_CONTRACT_ADDRESS,
      //   provider
      // );
      // submissionContract.connect(account);
      // const submissionId = cairo.felt(Date.now().toString());
      // const callData = CallData.compile({
      //   task_id: cairo.felt(taskId),
      //   submission_id: submissionId,
      //   completer: account.address,
      //   submission_data: cairo.felt(submissionData)
      // });
      // const result = await submissionContract.invoke('submit_task', callData);
      // await provider.waitForTransaction(result.transaction_hash);
      // return result.transaction_hash;
    } catch (err) {
      console.error('Failed to submit task:', err);
      setError('Failed to submit task. Please try again.');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const approveSubmission = async (
    taskId: string, 
    submissionId: string, 
    completer: string, 
    amount: string
  ): Promise<string | null> => {
    if (!account || !provider || !isConnected) {
      setError('Wallet not connected');
      return null;
    }

    if (!SUBMISSION_CONTRACT_ADDRESS) {
      setError('Contract addresses not configured.');
      return null;
    }

    try {
      setIsLoading(true);
      setError(null);

      // For development, return a mock transaction hash
      const mockTxHash = `0x${Math.random().toString(16).substr(2, 64)}`;
      
      // Simulate async operation
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      return mockTxHash;

      // TODO: Uncomment when contracts are deployed
      // const submissionContract = new Contract(
      //   SUBMISSION_ABI,
      //   SUBMISSION_CONTRACT_ADDRESS,
      //   provider
      // );
      // submissionContract.connect(account);
      // const callData = CallData.compile({
      //   task_id: cairo.felt(taskId),
      //   completer: completer,
      //   submission_id: cairo.felt(submissionId),
      //   amount: cairo.uint256(amount),
      //   token: ERC20_TOKEN_ADDRESS
      // });
      // const result = await submissionContract.invoke('approve_submission', callData);
      // await provider.waitForTransaction(result.transaction_hash);
      // return result.transaction_hash;
    } catch (err) {
      console.error('Failed to approve submission:', err);
      setError('Failed to approve submission. Please try again.');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const flagDispute = async (
    taskId: string, 
    submissionId: string, 
    completer: string
  ): Promise<string | null> => {
    if (!account || !provider || !isConnected) {
      setError('Wallet not connected');
      return null;
    }

    if (!SUBMISSION_CONTRACT_ADDRESS) {
      setError('Contract addresses not configured.');
      return null;
    }

    try {
      setIsLoading(true);
      setError(null);

      // For development, return a mock transaction hash
      const mockTxHash = `0x${Math.random().toString(16).substr(2, 64)}`;
      
      // Simulate async operation
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      return mockTxHash;

      // TODO: Uncomment when contracts are deployed
      // const submissionContract = new Contract(
      //   SUBMISSION_ABI,
      //   SUBMISSION_CONTRACT_ADDRESS,
      //   provider
      // );
      // submissionContract.connect(account);
      // const callData = CallData.compile({
      //   task_id: cairo.felt(taskId),
      //   completer: completer,
      //   submission_id: cairo.felt(submissionId)
      // });
      // const result = await submissionContract.invoke('flag_dispute', callData);
      // await provider.waitForTransaction(result.transaction_hash);
      // return result.transaction_hash;
    } catch (err) {
      console.error('Failed to flag dispute:', err);
      setError('Failed to flag dispute. Please try again.');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const resolveDispute = async (
    taskId: string, 
    submissionId: string, 
    completer: string, 
    approved: boolean
  ): Promise<string | null> => {
    if (!account || !provider || !isConnected) {
      setError('Wallet not connected');
      return null;
    }

    if (!SUBMISSION_CONTRACT_ADDRESS) {
      setError('Contract addresses not configured.');
      return null;
    }

    try {
      setIsLoading(true);
      setError(null);

      // For development, return a mock transaction hash
      const mockTxHash = `0x${Math.random().toString(16).substr(2, 64)}`;
      
      // Simulate async operation
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      return mockTxHash;

      // TODO: Uncomment when contracts are deployed
      // const submissionContract = new Contract(
      //   SUBMISSION_ABI,
      //   SUBMISSION_CONTRACT_ADDRESS,
      //   provider
      // );
      // submissionContract.connect(account);
      // const callData = CallData.compile({
      //   task_id: cairo.felt(taskId),
      //   completer: completer,
      //   submission_id: cairo.felt(submissionId),
      //   resolver: account.address,
      //   approved: approved
      // });
      // const result = await submissionContract.invoke('resolve_dispute', callData);
      // await provider.waitForTransaction(result.transaction_hash);
      // return result.transaction_hash;
    } catch (err) {
      console.error('Failed to resolve dispute:', err);
      setError('Failed to resolve dispute. Please try again.');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const getTaskDetails = async (taskId: string): Promise<any> => {
    if (!provider) {
      setError('Provider not available');
      return null;
    }

    if (!ESCROW_CONTRACT_ADDRESS) {
      setError('Contract addresses not configured.');
      return null;
    }

    try {
      setIsLoading(true);
      setError(null);

      // For development, return mock task details
      const mockTaskDetails = {
        id: taskId,
        title: 'Sample Task',
        description: 'This is a sample task for development',
        reward: '100',
        creator: '0x1234...abcd',
        status: 'open',
        deadline: Date.now() + 86400000 // 24 hours from now
      };
      
      // Simulate async operation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return mockTaskDetails;

      // TODO: Uncomment when contracts are deployed
      // const escrowContract = new Contract(
      //   ESCROW_ABI,
      //   ESCROW_CONTRACT_ADDRESS,
      //   provider
      // );
      // const result = await escrowContract.call('get_task_details', {
      //   task_id: cairo.felt(taskId)
      // });
      // return result;
    } catch (err) {
      console.error('Failed to get task details:', err);
      setError('Failed to get task details.');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createTask,
    submitTask,
    approveSubmission,
    flagDispute,
    resolveDispute,
    getTaskDetails,
    isLoading,
    error
  };
};