"use client";
import { motion } from "framer-motion";

export default function LoadingPlane() {
return (
<div className="flex flex-col items-center justify-center">
<motion.div
animate={{ x: [0, 50, -50, 0] }}
transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
>
✈️
</motion.div>
<p className="mt-4 text-gray-700 text-sm">
Planning your trip…
</p>
</div>
);
}