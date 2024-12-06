require('dotenv').config({ path: '.env.local' }); // Add this to load .env.local
const fs = require('fs');
const { SignPdf } = require('@signpdf/signpdf');
const { P12Signer } = require('@signpdf/signer-p12');
const { PDFDocument } = require('pdf-lib');
const { pdflibAddPlaceholder } = require('@signpdf/placeholder-pdf-lib');

async function testSignature() {
    try {
        // Verify environment variables
        if (!process.env.P12_CERTIFICATE) {
            throw new Error('P12 certificate not found in environment variables');
        }

        // Create test PDF
        console.log('Creating test PDF...');
        const pdfDoc = await PDFDocument.create();
        const page = pdfDoc.addPage([595, 842]); // A4 size
        
        page.drawText('Test Document for Digital Signature', {
            x: 50,
            y: 800,
            size: 14
        });
        
        const pdfBytes = await pdfDoc.save();
        fs.writeFileSync('./test.pdf', pdfBytes);
        console.log('Test PDF created');

        // Create PDF with placeholder
        console.log('Adding signature placeholder...');
        const pdfBuffer = fs.readFileSync('./test.pdf');
        const pdfDoc2 = await PDFDocument.load(pdfBuffer);
        
        await pdflibAddPlaceholder({
            pdfDoc: pdfDoc2,
            reason: 'Document Certification',
            contactInfo: 'uitm.kppim@uitm.edu.my',
            name: 'UITM KT CDCS230',
            location: 'Kuala Terengganu',
            signatureLength: 3322, // Increased for RSA
            subFilter: 'adbe.pkcs7.detached' // Fixed property name
        });

        const pdfBytesWithPlaceholder = await pdfDoc2.save();
        fs.writeFileSync('./test-with-placeholder.pdf', Buffer.from(pdfBytesWithPlaceholder));

        // Create signer using base64 P12 from env
        console.log('Creating P12 signer...');
        const p12Buffer = Buffer.from(process.env.P12_CERTIFICATE, 'base64');
        
        const signer = new P12Signer(p12Buffer, {
            passphrase: process.env.P12_PASSPHRASE || '1234'
        });

        // Sign PDF
        console.log('Signing PDF...');
        const signPdf = new SignPdf();
        
        const signedPdf = await signPdf.sign(
            Buffer.from(pdfBytesWithPlaceholder),
            signer
        );

        fs.writeFileSync('./test-signed.pdf', signedPdf);
        console.log('PDF signed successfully');

        return {
            success: true,
            pdfCreated: true,
            signed: true
        };

    } catch (error) {
        console.error('Signing failed:', error);
        console.error('Error details:', error.message);
        if (error.stack) {
            console.error('Stack trace:', error.stack);
        }
        return {
            success: false,
            error: error.message,
            type: error.type
        };
    }
}

// Add debugging for P12 from env
function debugP12FromEnv() {
    try {
        const p12Base64 = process.env.P12_CERTIFICATE;
        if (!p12Base64) {
            throw new Error('P12 certificate not found in environment variables');
        }

        const p12Buffer = Buffer.from(p12Base64, 'base64');
        console.log('\nP12 certificate details:');
        console.log('Certificate size:', p12Buffer.length, 'bytes');
        console.log('Passphrase configured:', !!process.env.P12_PASSPHRASE);
        
        // Save temp file for OpenSSL verification
        const tempPath = './temp-cert.p12';
        fs.writeFileSync(tempPath, p12Buffer);
        
        const { execSync } = require('child_process');
        const output = execSync(
            `openssl pkcs12 -info -in ${tempPath} -noout -passin pass:${process.env.P12_PASSPHRASE || '1234'}`,
            { encoding: 'utf8' }
        );
        console.log(output);
        
        // Clean up temp file
        fs.unlinkSync(tempPath);
        return true;
    } catch (error) {
        console.error('Error reading P12:', error.message);
        return false;
    }
}

// First install dotenv if not already installed
if (!require.resolve('dotenv')) {
    console.log('Installing dotenv...');
    require('child_process').execSync('npm install dotenv');
    console.log('dotenv installed');
}

// Verify environment variables
if (!debugP12FromEnv()) {
    console.error('P12 certificate cannot be read from environment variables');
    process.exit(1);
}

console.log('\nStarting signature test...');
testSignature().then(result => {
    console.log('\nTest result:', result);
});