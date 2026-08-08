"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { VACATION_TYPES } from "../../lib/vacationTypes";

const STORAGE_KEY = "tripsolver_vacation_type";

export default function VacationTypePicker({ initialValue = "any", onChange }) {
const router = useRouter();
const pathname = usePathname();
const searchParams = useSearchParams();

const urlValue = searchParams.get("vacationType");
const [value, setValue] = useState(urlValue || initialValue || "any");

// On first mount, if URL has no value, try localStorage
useEffect(() => {
if (urlValue) return;
try {
const saved = localStorage.getItem(STORAGE_KEY);
if (saved) setValue(saved);
} catch {}
}, [urlValue]);

// Keep URL + localStorage in sync and notify parent
useEffect(() => {
try {
localStorage.setItem(STORAGE_KEY, value);
} catch {}

const sp = new URLSearchParams(searchParams.toString());
if (!value || value === "any") sp.delete("vacationType");
else sp.set("vacationType", value);

const qs = sp.toString();
const nextUrl = qs ? `${pathname}?${qs}` : pathname;

router.replace(nextUrl, { scroll: false });
onChange?.(value);
// eslint-disable-next-line react-hooks/exhaustive-deps
}, [value]);

const options = useMemo(() => VACATION_TYPES, []);

return (
<div style={{ marginBottom: 16 }}>
<label style={{ display: "block", fontWeight: 600, marginBottom: 6 }}>
Vacation type
</label>

<select
value={value}
onChange={(e) => setValue(e.target.value)}
style={{ padding: 10, borderRadius: 8, width: "100%", maxWidth: 360 }}
>
{options.map((t) => (
<option key={t.id} value={t.id}>
{t.label}
</option>
))}
</select>

<div style={{ marginTop: 6, opacity: 0.75, fontSize: 13 }}>
This will prioritize destinations that match your vibe.
</div>
</div>
);
}
