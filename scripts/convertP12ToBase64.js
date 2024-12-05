const fs = require('fs');
const path = require('path');

try {
    // Read P12 file
    const p12Path = path.join(__dirname, '../certificates/ecdsa.p12');
    const p12Content = fs.readFileSync(p12Path);
    
    // Convert to base64
    const base64 = p12Content.toString('base64');
    
    console.log('Your P12 in base64 (copy this to your .env file):');
    console.log('P12_CERTIFICATE=' + base64);
} catch (error) {
    console.error('Error converting P12 to base64:', error);
}