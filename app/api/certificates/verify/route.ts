import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/firebase/admin";
import { verifySignature } from "@/utils/verifySignature";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // 1. First verify the signature
    const pdfBuffer = await file.arrayBuffer();
    const signatureVerification = await verifySignature(pdfBuffer);

    if (!signatureVerification.isValid) {
      return NextResponse.json({
        isValid: false,
        error: signatureVerification.error
      });
    }

    if (!signatureVerification.certificateId) {
      return NextResponse.json({
        isValid: false,
        error: 'Certificate ID not found in document'
      });
    }

    // 2. Verify against database
    const certificateRef = adminDb.collection('certificates').doc(signatureVerification.certificateId);
    const certificateDoc = await certificateRef.get();

    if (!certificateDoc.exists) {
      return NextResponse.json({
        isValid: false,
        error: 'Certificate not found in our records'
      });
    }

    const certificateData = certificateDoc.data();

    // 3. Additional verification checks
    if (certificateData?.status !== 'signed') {
      return NextResponse.json({
        isValid: false,
        error: 'Certificate is not properly signed'
      });
    }

    return NextResponse.json({
      isValid: true,
      certificate: certificateData,
      signatureInfo: signatureVerification.signatureInfo
    });

  } catch (error) {
    console.error('Verification error:', error);
    return NextResponse.json(
      { error: 'Failed to verify certificate' },
      { status: 500 }
    );
  }
}