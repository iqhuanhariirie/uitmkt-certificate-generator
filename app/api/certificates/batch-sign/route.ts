import { NextRequest, NextResponse } from "next/server";
import { SignPdf } from '@signpdf/signpdf';
import { P12Signer } from '@signpdf/signer-p12';
import { pdflibAddPlaceholder } from '@signpdf/placeholder-pdf-lib';
import { PDFDocument } from 'pdf-lib';
import { Timestamp } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import { adminDb, adminStorage } from '@/firebase/admin';

async function processSingleCertificate(
  cert: CertificateRequest,
  p12Buffer: Buffer,
  p12Passphrase: string
): Promise<{ success: boolean; error?: string; url?: string }> {
  try {
    const { certificateId, pdfBytes } = cert;
    const pdfBuffer = new Uint8Array(pdfBytes);

    const pdfDoc = await PDFDocument.load(pdfBuffer);
    pdfDoc.setTitle(certificateId);
    await pdflibAddPlaceholder({
      pdfDoc,
      reason: 'Certificate Validation',
      contactInfo: 'uitm.kppim@uitm.edu.my',
      name: 'UITM KT CDCS230',
      location: 'Kuala Terengganu',
      signatureLength: 3322,
      subFilter: 'adbe.pkcs7.detached'
    });

    const pdfBytesWithPlaceholder = await pdfDoc.save();

    const signer = new P12Signer(p12Buffer, {
      passphrase: p12Passphrase
    });

    const signedPdf = await signWithRetry(
      Buffer.from(pdfBytesWithPlaceholder),
      signer
    );

    const bucket = adminStorage.bucket();
    const file = bucket.file(`certificates/${certificateId}.pdf`);
    await file.save(signedPdf);
    const [signedPdfUrl] = await file.getSignedUrl({
      action: 'read',
      expires: '03-01-2500'
    });

    await adminDb.collection('certificates').doc(certificateId).update({
      status: 'signed',
      signedPdfUrl,
      signedAt: Timestamp.now()
    });

    return { success: true, url: signedPdfUrl };
  } catch (error) {
    console.error(`Error processing certificate ${cert.certificateId}:`, error);
    
    try {
      await adminDb.collection('certificates').doc(cert.certificateId).update({
        status: 'error',
        errorMessage: error instanceof Error ? error.message : 'Unknown error'
      });
    } catch (updateError) {
      console.error('Failed to update certificate error status:', updateError);
    }

    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

async function processChunk(
  certificates: CertificateRequest[], 
  p12Buffer: Buffer,
  p12Passphrase: string,
  chunkSize: number = 5
): Promise<BatchResults> {
  const results: BatchResults = { success: 0, failed: 0, errors: [] };
  
  // Process certificates in chunks
  for (let i = 0; i < certificates.length; i += chunkSize) {
    const chunk = certificates.slice(i, i + chunkSize);
    console.log(`Processing chunk ${i/chunkSize + 1} of ${Math.ceil(certificates.length/chunkSize)}`);
    
    // Process certificates in parallel within each chunk
    const chunkResults = await Promise.all(
      chunk.map(cert => processSingleCertificate(cert, p12Buffer, p12Passphrase))
    );

    // Aggregate results
    chunkResults.forEach((result, index) => {
      if (result.success) {
        results.success++;
      } else {
        results.failed++;
        results.errors.push({
          certificateId: chunk[index].certificateId,
          error: result.error || 'Unknown error'
        });
      }
    });

    // Add a small delay between chunks to prevent overload
    if (i + chunkSize < certificates.length) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  return results;
}

interface CertificateRequest {
  certificateId: string;
  pdfBytes: number[];
}

interface ErrorDetail {
  certificateId: string;
  error: string;
}

interface BatchResults {
  success: number;
  failed: number;
  errors: ErrorDetail[];
}

export async function POST(request: NextRequest) {
  try {
    // Log headers for debugging
    console.log("Received headers:", Object.fromEntries(request.headers));

    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const idToken = authHeader.split('Bearer ')[1];

    try {
      const decodedToken = await getAuth().verifyIdToken(idToken);
      const adminQuery = await adminDb
        .collection('admins')
        .where('email', '==', decodedToken.email)
        .get();

      if (adminQuery.empty) {
        console.log("User not found in admins collection:", decodedToken.email);
        return NextResponse.json({ 
          error: 'Forbidden',
          message: 'User not found in admins collection'
        }, { status: 403 });
      }
      // Log admin document data
      console.log("Admin doc data:", adminQuery);
    } catch (error) {
      console.error('Auth error:', error);
      return NextResponse.json({ error: 'Authentication failed' }, { status: 401 });
    }

    const { certificates } = (await request.json()) as { certificates: CertificateRequest[] };

    if (!Array.isArray(certificates) || certificates.length === 0) {
      return NextResponse.json({ error: 'No certificates provided' }, { status: 400 });
    }

    if (!process.env.P12_CERTIFICATE || !process.env.P12_PASSPHRASE) {
      throw new Error('Missing P12 certificate configuration');
    }

    const p12Buffer = Buffer.from(process.env.P12_CERTIFICATE, 'base64');
    
    // Process certificates with chunking
    const results = await processChunk(
      certificates, 
      p12Buffer, 
      process.env.P12_PASSPHRASE,
      5 // chunk size
    );

    for (const cert of certificates) {
      try {
        const { certificateId, pdfBytes } = cert;
        const pdfBuffer = new Uint8Array(pdfBytes);

        const pdfDoc = await PDFDocument.load(pdfBuffer);
        pdfDoc.setTitle(certificateId);
        await pdflibAddPlaceholder({
          pdfDoc,
          reason: 'Certificate Validation',
          contactInfo: 'uitm.kppim@uitm.edu.my',
          name: 'UITM KT CDCS230',
          location: 'Kuala Terengganu',
          signatureLength: 3322,
          subFilter: 'adbe.pkcs7.detached'
        });

        const pdfBytesWithPlaceholder = await pdfDoc.save();

        const p12Buffer = Buffer.from(process.env.P12_CERTIFICATE, 'base64');
        const signer = new P12Signer(p12Buffer, {
          passphrase: process.env.P12_PASSPHRASE
        });

        const signPdf = new SignPdf();
        const signedPdf = await signPdf.sign(
          Buffer.from(pdfBytesWithPlaceholder),
          signer
        );

        const bucket = adminStorage.bucket();
        const file = bucket.file(`certificates/${certificateId}.pdf`);
        await file.save(signedPdf);
        const [signedPdfUrl] = await file.getSignedUrl({
          action: 'read',
          expires: '03-01-2500'
        });

        await adminDb.collection('certificates').doc(certificateId).update({
          status: 'signed',
          signedPdfUrl,
          signedAt: Timestamp.now()
        });

        results.success++;
      } catch (error) {
        results.failed++;
        results.errors.push({
          certificateId: cert.certificateId,
          error: error instanceof Error ? error.message : 'Unknown error'
        });

        try {
          await adminDb.collection('certificates').doc(cert.certificateId).update({
            status: 'error',
            errorMessage: error instanceof Error ? error.message : 'Unknown error'
          });
        } catch (updateError) {
          console.error('Failed to update certificate error status:', updateError);
        }
      }
    }

    return NextResponse.json(results);
  } catch (error) {
    console.error('Batch signing error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to process batch signing',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}