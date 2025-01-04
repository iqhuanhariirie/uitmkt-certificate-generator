
import { NextRequest, NextResponse } from "next/server";
import { SignPdf } from '@signpdf/signpdf';
import { P12Signer } from '@signpdf/signer-p12';
import { pdflibAddPlaceholder } from '@signpdf/placeholder-pdf-lib';
import { PDFDocument } from 'pdf-lib';
import { adminDb, adminStorage } from '@/firebase/admin';
import { FieldValue } from 'firebase-admin/firestore';

interface RequestBody {
  certificateId: string;
  pdfBase64: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as RequestBody;
    const { certificateId, pdfBase64 } = body;

    if (!certificateId || !pdfBase64) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Convert base64 to Uint8Array
    const pdfBuffer = new Uint8Array(Buffer.from(pdfBase64, 'base64'));

    // 1. Create PDF with placeholder
    const pdfDoc = await PDFDocument.load(pdfBuffer);
    
    pdfDoc.setTitle(certificateId);
    
    await pdflibAddPlaceholder({
      pdfDoc,
      reason: 'Certificate Validation',
      contactInfo: 'uitm.kppim@uitm.edu.my',
      name: 'UITM KT CDCS230',
      location: 'Kuala Terengganu',
      signatureLength: 8192,
      subFilter: 'adbe.pkcs7.detached'
    });

    const pdfBytesWithPlaceholder = await pdfDoc.save();

    // 2. Sign PDF
    if (!process.env.P12_CERTIFICATE || !process.env.P12_PASSPHRASE) {
      throw new Error('Missing P12 certificate configuration');
    }

    //Convert Base64 P12 to Buffer
    const p12Buffer = Buffer.from(process.env.P12_CERTIFICATE, 'base64');
    console.log('P12 buffer created, length:', p12Buffer.length);

    //Initialize P12 Signer
    const signer = new P12Signer(p12Buffer, {
      passphrase: process.env.P12_PASSPHRASE
    });
    console.log('Signer created');

    //Create and Apply Digital Signature
    const signPdf = new SignPdf();
    const signedPdf = await signPdf.sign(
      Buffer.from(pdfBytesWithPlaceholder),
      signer
    );

    console.log('PDF signed successfully');

    // 3. Upload signed PDF using Admin SDK
    const bucket = adminStorage.bucket();
    const file = bucket.file(`certificates/${certificateId}.pdf`);
    
    await file.save(signedPdf, {
      metadata: {
        contentType: 'application/pdf'
      }
    });

    // Get a signed URL that expires far in the future
    const [signedPdfUrl] = await file.getSignedUrl({
      action: 'read',
      expires: '03-01-2500'
    });

    // 4. Update certificate document using Admin SDK
    const certRef = adminDb.collection('certificates').doc(certificateId);
    await certRef.update({
      status: 'signed',
      signedPdfUrl,
      signedAt: FieldValue.serverTimestamp()
    });

    return NextResponse.json({ 
      success: true, 
      url: signedPdfUrl 
    });
  } catch (error) {
    console.error('Error signing certificate:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to sign certificate'
      },
      { status: 500 }
    );
  }
}

// // 3. Upload signed PDF
    // const storageRef = ref(storage, `certificates/${certificateId}.pdf`);
    // await uploadBytes(storageRef, signedPdf);
    // const signedPdfUrl = await getDownloadURL(storageRef);

    // // 4. Update certificate document
    // const certRef = doc(db, 'certificates', certificateId);
    // await updateDoc(certRef, {
    //   status: 'signed',
    //   signedPdfUrl,
    //   signedAt: Timestamp.now()
    // });
