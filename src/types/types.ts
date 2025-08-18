import {
  type FieldError,
  type FieldValues,
  type Path,
  type UseFormRegister,
  type RegisterOptions,
} from 'react-hook-form';

export interface FormInputProps<T extends FieldValues> {
  id: Path<T>;
  label: string;
  type?: string;
  placeholder?: string;
  extraDescription?: string;
  register: UseFormRegister<T>;
  error?: FieldError;
  required?: boolean;
  className?: string;
  touched?: boolean;
  validationRules?: RegisterOptions<T, Path<T>>;
}

export interface FormSelectInputProps<T extends FieldValues> {
  id: Path<T>;
  label: string;
  register: UseFormRegister<T>;
  error?: FieldError;
  className?: string;
  options: string[];
  touched?: boolean;
  placeholder?: string;
  validationRules?: RegisterOptions<T, Path<T>>;
}

export interface FormFileUploadProps<T extends FieldValues> {
  id: Path<T>;
  label: string;
  error?: FieldError;
  touched?: boolean;
  onFileAccepted: (file: File) => void;
  acceptedTypes?: string[];
  maxSizeMB?: number;
}
