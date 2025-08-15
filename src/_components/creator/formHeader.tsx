import React from 'react';
interface FormHeaderProps {
  title: string;
  subtitle: string;
}
function FormHeader({ title, subtitle }: FormHeaderProps) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-xl font-semibold capitalize text-black sm:text-2xl">
        {title}
      </p>
      <p className="text-sm font-medium text-[#414141]">{subtitle}</p>
    </div>
  );
}

export default FormHeader;
