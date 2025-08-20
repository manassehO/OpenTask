interface ErrorMessageProps {
  errorMessage?: string;
  isVisible?: boolean;
}

const ErrorMessage = ({
  isVisible = true,
  errorMessage,
}: ErrorMessageProps) => {
  return (
    <p
      className={
        'break-words text-xs font-medium italic text-red-300 transition-opacity duration-200 ' +
        (isVisible ? 'opacity-95' : 'opacity-0')
      }
    >
      {errorMessage}
    </p>
  );
};

export default ErrorMessage;
