"use client";

type Option = {
  label: string;
  value: string;
};

type CheckboxGroupProps = {
  label: string;
  name: string;
  options: Option[];
  register: any;
  required?: boolean;
};

export default function CheckboxGroup({
  label,
  name,
  options,
  register,
  required = false,
}: CheckboxGroupProps) {
  return (
    <div className="mb-8">
      <p className="text-black font-medium mb-4 text-sm md:text-base">
        {required && <span className="text-blue mr-1">*</span>}
        {label}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {options.map((option) => (
          <label
            key={option.value}
            className="
              flex
              items-center
              gap-3
              border
              border-gray
              rounded-xl
              px-5
              py-4
              cursor-pointer
              transition-all
              duration-300
              hover:border-black
              hover:bg-black/2
            "
          >
            <input
              type="checkbox"
              value={option.value}
              {...register(name)}
              className="
                w-4
                h-4
                accent-blue
              "
            />

            <span className="text-black text-sm md:text-base">
              {option.label}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}
