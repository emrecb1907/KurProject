const fs = require('fs');
const path = require('path');

const files = [
    'assets/icon.png',
    'assets/adaptive-icon.png',
    'assets/favicon.png',
    'assets/splash-removebg.png'
];

files.forEach(file => {
    const filePath = path.join(__dirname, file);
    if (fs.existsSync(filePath)) {
        const buffer = fs.readFileSync(filePath);
        const isPngSignature = buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47;
        const isBase64Text = buffer.slice(0, 10).toString().startsWith('iVBOR');

        console.log(`File: ${file}`);
        console.log(`  Size: ${buffer.length} bytes`);
        console.log(`  Is PNG Signature: ${isPngSignature}`);
        console.log(`  Is Base64 Text: ${isBase64Text}`);
        console.log(`  First 10 bytes: ${buffer.slice(0, 10).toString('hex')}`);
        console.log('---');
    } else {
        console.log(`File not found: ${file}`);
    }
});
