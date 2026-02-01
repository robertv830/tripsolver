// components/Modal.js
"use client";

import { useEffect } from "react";

export default function Modal({ isOpen, title, onClose, children, widthClass = "max-w-3xl" }) {
useEffect(() => {
if (!isOpen) return;

const onKeyDown = (e) => {
if (e.key === "Escape") onClose?.();
};

document.addEventListener("keydown", onKeyDown);
// prevent page scroll while modal open
const originalOverflow = document.body.style.overflow;
document.body.style.overflow = "hidden";

return () => {
document.removeEventListener("keydown", onKeyDown);
document.body.style.overflow = originalOverflow;
};
}, [isOpen, onClose]);

if (!isOpen) return null;

return (
<div className="fixed inset-0 z-50">
{/* Backdrop */}
<button
aria-label="Close modal backdrop"
className="absolute inset-0 bg-black/40"
onClick={onClose}
/>

{/* Modal card */}
<div className="relative mx-auto mt-24 w-[92vw]">
<div className={`relative ${widthClass} mx-auto rounded-xl bg-[#f7f1e6] shadow-xl`}>
{/* Header */}
<div className="flex items-start justify-between gap-4 px-6 pt-5">
<div className="min-w-0">
{title ? (
<h2 className="text-2xl font-semibold leading-tight text-slate-900">{title}</h2>
) : null}
<p className="mt-1 text-sm text-slate-600">Tip: links open in a new tab.</p>
</div>

<button
onClick={onClose}
className="rounded-md px-2 py-1 text-xl leading-none text-slate-600 hover:bg-black/5"
aria-label="Close"
title="Close"
>
×
</button>
</div>

{/* Body */}
<div className="px-6 pb-6 pt-4">{children}</div>
</div>
</div>
</div>
);
}
