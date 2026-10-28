"use client";

// Сонголт солимогц маягтыг шууд илгээнэ.
export function StatusSelect({ name, defaultValue, options }: { name: string; defaultValue: string; options: Record<string, string> }) {
  return (
    <select
      name={name}
      defaultValue={defaultValue}
      onChange={(event) => event.currentTarget.form?.requestSubmit()}
      className="rounded-lg border border-[#eadfd5] bg-white px-2.5 py-1.5 text-[12px] outline-none focus:border-[#6e4f45]"
    >
      {Object.entries(options).map(([value, label]) => (
        <option key={value} value={value}>
          {label}
        </option>
      ))}
    </select>
  );
}
