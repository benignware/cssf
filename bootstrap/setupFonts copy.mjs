import setupFontInput from './fontInput.mjs';

import { deviceFonts, googleFonts } from './fonts.mjs';

setupFontInput('fontInput', 'fontDropdown', deviceFonts, googleFonts);

document.addEventListener('fontSelected', (event) => {
    const fontName = event.detail.fontName;
    if (googleFonts.includes(fontName)) {
        addGoogleFont(fontName);
    }
});

function generateGoogleFontUrl(fontName) {
    const formattedName = fontName.replace(/ /g, '+').replace(/[^\w+]/g, '');
    return `https://fonts.googleapis.com/css2?family=${formattedName}:wght@400;700&display=swap`;
}

function addGoogleFont(fontName) {
    const url = generateGoogleFontUrl(fontName);
    let link = document.querySelector(`link[href="${url}"]`);
    if (!link) {
        link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = url;
        document.head.appendChild(link);
    }
}