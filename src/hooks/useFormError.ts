import { type FieldError } from 'react-hook-form';

export function useFormError(error?: FieldError, touched?: boolean) {
  const hasError = Boolean(error) && (touched === undefined || touched);
  const message = hasError ? error?.message : '';

  return {
    hasError,
    message,
  };
}
