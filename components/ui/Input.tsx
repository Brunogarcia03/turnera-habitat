"use client";

type InputProps = {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  register: any;
  error?: string;
};

export default function Input({
  label,
  name,
  type = "text",
  placeholder,
  required = false,
  register,
  error,
}: InputProps) {
  return (
    <div className="flex flex-col gap-2 mb-5">
      <label
        htmlFor={name}
        className="text-sm md:text-base text-black font-medium"
      >
        {required && <span className="text-blue mr-1">*</span>}
        {label}
      </label>

      <input
        id={name}
        type={type}
        placeholder={placeholder}
        {...register(name)}
        className={`
          border-[1.5px]
          rounded-xl
          w-full
          min-h-10
          px-5
          text-black
          bg-transparent
          transition-all
          duration-300
          outline-none
          focus:ring-4
          ${
            error
              ? "border-red-500 focus:ring-red-500/10"
              : "border-gray hover:border-black focus:border-blue focus:ring-blue/10"
          }
        `}
      />

      {error && <span className="text-sm text-red-500">{error}</span>}
    </div>
  );
}
