import { type FieldValues } from 'react-hook-form';
import { type FormSelectInputProps } from '../../../types/types';
import { useFormError } from '../../../hooks/useFormError';
import ErrorMessage from '../form/ErrorMessage';

const FormSelectInput = <T extends FieldValues>({
  id,
  label,
  register,
  error,
  className = '',
  touched,
  options,
  placeholder,
  validationRules,
}: FormSelectInputProps<T>) => {
  const { message, hasError } = useFormError(error, touched);

  return (
    <div className="relative flex flex-col gap-3">
      <label htmlFor={id}>{label}</label>
      <select
        id={id}
        className={`h-14 appearance-none rounded border border-[#D9D9D9] px-5 outline-none focus:border-primary ${
          hasError ? '!border-error-500' : ''
        }`}
        {...register(id, validationRules)}
      >
        {placeholder && (
          <option
            value=""
            className="appearance-none text-sm font-medium !text-red-200"
          >
            {placeholder}
          </option>
        )}
        {options.map((opt, i) => (
          <option
            key={i}
            value={opt}
            className="absolute appearance-none bg-red-300"
          >
            {opt}
          </option>
        ))}
      </select>

      <ErrorMessage isVisible={hasError} errorMessage={message} />
    </div>
  );
};

export default FormSelectInput;
