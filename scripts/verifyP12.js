const forge = require('node-forge');
const fs = require('fs');

function verifyP12() {
    try {
        const p12Buffer = fs.readFileSync('./certificates/output.p12');
        const p12Asn1 = forge.asn1.fromDer(p12Buffer.toString('binary'));
        const p12 = forge.pkcs12.pkcs12FromAsn1(p12Asn1, '1234');

        // Get bags by type
        const certBags = p12.getBags({ bagType: forge.pki.oids.certBag });
        const keyBags = p12.getBags({ bagType: forge.pki.oids.pkcs8ShroudedKeyBag });

        console.log('P12 structure:');
        console.log('- Certificates found:', certBags[forge.pki.oids.certBag]?.length);
        console.log('- Private keys found:', keyBags[forge.pki.oids.pkcs8ShroudedKeyBag]?.length);

        // Get certificate details
        const cert = certBags[forge.pki.oids.certBag][0].cert;
        console.log('\nCertificate details:');
        console.log('- Subject:', cert.subject.getField('CN').value);
        console.log('- Algorithm:', cert.signatureOid);

        return {
            success: true,
            hasKey: keyBags[forge.pki.oids.pkcs8ShroudedKeyBag]?.length > 0,
            hasCert: certBags[forge.pki.oids.certBag]?.length > 0
        };

    } catch (error) {
        console.error('P12 verification failed:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

console.log('Verifying P12 file...');
const result = verifyP12();
console.log('\nVerification result:', result);