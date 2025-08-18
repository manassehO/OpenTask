import { type FieldValues } from 'react-hook-form';
import { type FormInputProps } from '../../../types/types';
import { useFormError } from '../../../hooks/useFormError';
import ErrorMessage from '../form/ErrorMessage';

const FormInput = <T extends FieldValues>({
  id,
  label,
  register,
  error,
  className = '',
  placeholder,
  required = false,
  type = 'text',
  touched,
  validationRules,
  extraDescription,
}: FormInputProps<T>) => {
  const { message, hasError } = useFormError(error, touched);

  return (
    <div className="relative flex flex-col gap-3">
      <div className="flex items-center justify-between">
        {label !== '' && (
          <label
            htmlFor={id}
            className="text-sm font-medium capitalize text-black sm:text-base"
          >
            {label}
          </label>
        )}
        {extraDescription && (
          <p className="text-sm font-medium text-primary">{extraDescription}</p>
        )}
      </div>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        aria-invalid={error ? 'true' : 'false'}
        className={
          (hasError ? '!border-error-500 ' : '') +
          className +
          'h-14 rounded border border-[#D9D9D9] px-6 outline-none focus:border-primary'
        }
        required={required}
        {...register(id, validationRules)}
      />

      <ErrorMessage isVisible={hasError} errorMessage={message} />
    </div>
  );
};

export default FormInput;
