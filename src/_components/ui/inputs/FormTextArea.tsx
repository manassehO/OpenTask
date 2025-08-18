import { type FieldValues } from 'react-hook-form';
import { type FormInputProps } from '../../../types/types';
import { useFormError } from '../../../hooks/useFormError';
import ErrorMessage from '../form/ErrorMessage';

const FormTextArea = <T extends FieldValues>({
  id,
  label,
  register,
  error,
  className = '',
  touched,
  placeholder,
  validationRules,
  required,
}: FormInputProps<T>) => {
  const { message, hasError } = useFormError(error, touched);

  return (
    <div className="relative flex flex-col gap-3">
      <label
        htmlFor={id}
        className="text-sm font-medium capitalize text-black sm:text-base"
      >
        {label}
      </label>
      <textarea
        id={id}
        placeholder={placeholder}
        aria-invalid={error ? 'true' : 'false'}
        className={
          (hasError ? '!border-error-500 ' : '') +
          className +
          '!h-48 resize-none rounded border border-[#D9D9D9] px-6 py-5 outline-none placeholder:capitalize focus:border-primary'
        }
        required={required}
        {...register(id, validationRules)}
      />

      <ErrorMessage isVisible={hasError} errorMessage={message} />
    </div>
  );
};

export default FormTextArea;
