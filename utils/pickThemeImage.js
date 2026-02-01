// app/utils/pickThemeImage.js

import themeImages from "./themeImages";

/**
* Picks an image based on destination tags.
* It tries each tag in order — the first matching tag
* that has images in themeImages will be used.
*/
export default function pickThemeImage(tags = []) {
// Make sure tags is an array
if (!Array.isArray(tags)) {
tags = [];
}

// Try each tag and return a themed image if available
for (const tag of tags) {
const arr = themeImages[tag];
if (arr && arr.length > 0) {
return arr[Math.floor(Math.random() * arr.length)];
}
}

// Fallback — choose from Generic images
const fallbackArr = themeImages.Generic;
return fallbackArr[Math.floor(Math.random() * fallbackArr.length)];
}