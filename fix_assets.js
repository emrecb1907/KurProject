const fs = require('fs');
const path = require('path');

const files = [
    'assets/icon.png',
    'assets/adaptive-icon.png',
    'assets/favicon.png'
];

files.forEach(file => {
    const filePath = path.join(__dirname, file);
    if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf8');
        // Check if it looks like a base64 string (starts with iVBOR for PNG)
        if (content.startsWith('iVBOR')) {
            console.log(`Fixing ${file}...`);
            const buffer = Buffer.from(content, 'base64');
            fs.writeFileSync(filePath, buffer);
            console.log(`  Converted to binary (${buffer.length} bytes)`);
        } else {
            console.log(`Skipping ${file}: Does not start with 'iVBOR'`);
        }
    } else {
        console.log(`File not found: ${file}`);
    }
});
