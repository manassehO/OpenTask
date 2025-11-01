import { useToastContext } from '~/store/ToastProvider';
import type { CryptoWithdrawalParams } from '~/types/userEarning';
import { api } from './queryClient';

function getErrorMessage(error: unknown): string {
  if (error && typeof error === 'object' && 'message' in error) {
    const message = (error as { message: unknown }).message;
    return typeof message === 'string' ? message : 'An error occurred';
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'An unexpected error occurred';
}

export const useGetWithdrawalMethods = () => {
  const { data: methods, isLoading } =
    api.earnings.getWithdrawalOptions.useQuery();
  return { methods, isLoading };
};

export const useCryptoWithdrawalMethod = () => {
  const { removeToast, showError, showSuccess, showLoading } =
    useToastContext();

  return api.earnings.createCryptoWithdrawal.useMutation({
    onMutate(_variables) {
      return showLoading(
        'Processing Withdrawal',
        'Your crypto withdrawal is being processed...',
      );
    },
    onSuccess(data, _variables, context) {
      if (context) removeToast(context);
      showSuccess(
        'Withdrawal Successful!',
        `Your crypto withdrawal has been initiated successfully.`,
      );
    },
    onError(error, _variables, context) {
      if (context) removeToast(context);
      showError('Withdrawal Failed', getErrorMessage(error));
    },
  });
};
export const useBankWithdrawalMethod = () => {
  const { removeToast, showError, showSuccess, showLoading } =
    useToastContext();

  return api.earnings.createBankWithdrawal.useMutation({
    onMutate(_variables) {
      return showLoading(
        'Processing Withdrawal',
        'Your bank withdrawal is being processed...',
      );
    },
    onSuccess(data, _variables, context) {
      if (context) removeToast(context);
      showSuccess(
        'Withdrawal Successful!',
        `Your bank withdrawal has been initiated successfully.`,
      );
    },
    onError(error, _variables, context) {
      if (context) removeToast(context);
      showError('Withdrawal Failed', getErrorMessage(error));
    },
  });
};
export const useTransactionHistory = () => {
  const { data, isLoading } = api.earnings.getTransactionHistory.useQuery(
    {
      limit: 20,
      offset: 0,
      type: undefined,
    },
    {
      staleTime: 60 * 1000, // 1 minute
      refetchOnWindowFocus: false,
      retry: 2,
    },
  );
  return { data, isLoading };
};
