// app/layout.tsx
import "../styles/globals.css";
import React from "react";

export const metadata = {
title: "Vacation Planner",
description: "Personalized vacation recommendations",
};

export default function RootLayout({
children,
}: {
children: React.ReactNode;
}) {
return (
<html lang="en">
<body>
{children}
</body>
</html>
);
}