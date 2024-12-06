import { NextRequest, NextResponse } from "next/server";
import { SignPdf } from '@signpdf/signpdf';
import { P12Signer } from '@signpdf/signer-p12';
import { pdflibAddPlaceholder } from '@signpdf/placeholder-pdf-lib';
import { PDFDocument } from 'pdf-lib';
import { doc, updateDoc, Timestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/firebase/config';

// Define interfaces for type safety
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
    const { certificates } = (await request.json()) as { certificates: CertificateRequest[] };
    const results: BatchResults = { 
      success: 0, 
      failed: 0, 
      errors: [] 
    };

    if (!Array.isArray(certificates) || certificates.length === 0) {
      return NextResponse.json(
        { error: 'No certificates provided' },
        { status: 400 }
      );
    }

    // Check for required environment variables
    if (!process.env.P12_CERTIFICATE || !process.env.P12_PASSPHRASE) {
      throw new Error('Missing P12 certificate configuration');
    }

    for (const cert of certificates) {
      try {
        const { certificateId, pdfBytes } = cert;
        
        // Convert number array back to Uint8Array
        const pdfBuffer = new Uint8Array(pdfBytes);

        // 1. Create PDF with placeholder
        const pdfDoc = await PDFDocument.load(pdfBuffer);
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

        // 2. Sign PDF
        const p12Buffer = Buffer.from(process.env.P12_CERTIFICATE, 'base64');
        const signer = new P12Signer(p12Buffer, {
          passphrase: process.env.P12_PASSPHRASE
        });

        const signPdf = new SignPdf();
        const signedPdf = await signPdf.sign(
          Buffer.from(pdfBytesWithPlaceholder),
          signer
        );

        // 3. Upload signed PDF
        const storageRef = ref(storage, `certificates/${certificateId}.pdf`);
        await uploadBytes(storageRef, signedPdf);
        const signedPdfUrl = await getDownloadURL(storageRef);

        // 4. Update certificate document
        const certRef = doc(db, 'certificates', certificateId);
        await updateDoc(certRef, {
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

        // Update certificate status to error
        try {
          const certRef = doc(db, 'certificates', cert.certificateId);
          await updateDoc(certRef, {
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