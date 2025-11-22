const fs = require('fs');
const path = require('path');

const trPath = path.join('src', 'lib', 'i18n', 'locales', 'tr.json');
const enPath = path.join('src', 'lib', 'i18n', 'locales', 'en.json');

function validate(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        JSON.parse(content);
        console.log(`✅ ${filePath} is valid JSON.`);
    } catch (e) {
        console.error(`❌ ${filePath} is INVALID JSON.`);
        console.error(e.message);
    }
}

validate(trPath);
validate(enPath);
