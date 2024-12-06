const fs = require('fs');
const { SignPdf } = require('@signpdf/signpdf');
const { P12Signer } = require('@signpdf/signer-p12');
const { PDFDocument } = require('pdf-lib');
const { pdflibAddPlaceholder } = require('@signpdf/placeholder-pdf-lib');

async function testSignature() {
    try {
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
            signatureLength: 8192, // Increased for RSA
            subfilter: 'adbe.pkcs7.detached'
        });

        const pdfBytesWithPlaceholder = await pdfDoc2.save();
        fs.writeFileSync('./test-with-placeholder.pdf', Buffer.from(pdfBytesWithPlaceholder));

        // Create signer from P12
        console.log('Creating P12 signer...');
        const p12Buffer = fs.readFileSync('./certificatesRSA/certificate.p12');
        
        const signer = new P12Signer(p12Buffer, {
            passphrase: '1234',
            encoding: 'binary'
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

// Add debugging for P12 file
function debugP12(p12Path) {
    try {
        const { execSync } = require('child_process');
        console.log('\nP12 file details:');
        const output = execSync(`openssl pkcs12 -info -in ${p12Path} -noout -passin pass:1234`, 
            { encoding: 'utf8' });
        console.log(output);
        return true;
    } catch (error) {
        console.error('Error reading P12:', error.message);
        return false;
    }
}

// Verify P12 file exists and is readable
if (!fs.existsSync('./certificatesRSA/certificate.p12')) {
    console.error('P12 file not found at ./certificatesRSA/certificate.p12');
    process.exit(1);
}

if (!debugP12('./certificatesRSA/certificate.p12')) {
    console.error('P12 file cannot be read properly');
    process.exit(1);
}

console.log('\nStarting signature test...');
testSignature().then(result => {
    console.log('\nTest result:', result);
});