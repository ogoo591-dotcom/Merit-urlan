import { districts, type DeliveryAddress } from "@/components/delivery-address-provider";

const inputClass =
  "w-full rounded-[12px] border border-[#eadfd5] bg-white px-3.5 py-2.5 text-[12px] text-[#2f2420] outline-none transition focus:border-[#6e4f45]";
const labelClass = "mb-1.5 block text-[11px] font-medium text-[#4a3b35]";

export function readAddressFields(formData: FormData): DeliveryAddress {
  return {
    district: String(formData.get("district") ?? "").trim(),
    khoroo: String(formData.get("khoroo") ?? "").trim(),
    detail: String(formData.get("detail") ?? "").trim(),
  };
}

export function AddressFields({ value, idPrefix }: { value: DeliveryAddress | null; idPrefix: string }) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-[1.4fr_1fr] gap-3">
        <div>
          <label htmlFor={`${idPrefix}-district`} className={labelClass}>Дүүрэг</label>
          <select id={`${idPrefix}-district`} name="district" required defaultValue={value?.district ?? ""} className={inputClass}>
            <option value="" disabled>Сонгох</option>
            {districts.map((district) => (
              <option key={district} value={district}>{district}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor={`${idPrefix}-khoroo`} className={labelClass}>Хороо</label>
          <input id={`${idPrefix}-khoroo`} name="khoroo" inputMode="numeric" placeholder="11" defaultValue={value?.khoroo} className={inputClass} />
        </div>
      </div>
      <div>
        <label htmlFor={`${idPrefix}-detail`} className={labelClass}>Байр, орц, давхар, тоот</label>
        <textarea
          id={`${idPrefix}-detail`}
          name="detail"
          required
          rows={2}
          placeholder="Жишээ: 32-р байр, 2-р орц, 5 давхар, 18 тоот"
          defaultValue={value?.detail}
          className={inputClass}
        />
      </div>
    </div>
  );
}
