import { type FieldValues } from 'react-hook-form';
import { type FormInputProps } from '../../../types/types';
import { useFormError } from '../../../hooks/useFormError';
import ErrorMessage from '../form/ErrorMessage';

interface MultiSelectInputProps<T extends FieldValues>
  extends FormInputProps<T> {
  options: { value: string; label: string }[];
}

const MultiSelectInput = <T extends FieldValues>({
  id,
  label,
  register,
  error,
  className = '',
  required = false,
  touched,
  validationRules,
  extraDescription,
  options,
}: MultiSelectInputProps<T>) => {
  const { message, hasError } = useFormError(error, touched);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        {label && (
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

      <select
        id={id}
        {...register(id, validationRules)}
        aria-invalid={!!error}
        required={required}
        className={
          (hasError ? '!border-error-500 ' : '') +
          className +
          'h-14 appearance-none rounded border border-[#D9D9D9] px-4 py-2 outline-none focus:border-primary'
        }
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      <ErrorMessage isVisible={hasError} errorMessage={message} />
    </div>
  );
};

export default MultiSelectInput;
