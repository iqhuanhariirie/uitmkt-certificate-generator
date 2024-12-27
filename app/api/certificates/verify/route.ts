import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/firebase/admin";
import { verifySignature } from "@/utils/verifySignature";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: ['No file provided'] },
        { status: 400 }
      );
    }

    // 1. First verify the signature and format
    const pdfBuffer = await file.arrayBuffer();
    const signatureVerification = await verifySignature(pdfBuffer);

    // If there's no valid certificate ID, don't check the database
    if (!signatureVerification.certificateId) {
      return NextResponse.json({
        isValid: false,
        error: signatureVerification.error
      });
    }

    // 2. Only check database if we have a valid certificate ID format
    const certificateRef = adminDb.collection('certificates').doc(signatureVerification.certificateId);
    const certificateDoc = await certificateRef.get();

    if (!certificateDoc.exists) {
      return NextResponse.json({
        isValid: false,
        error: ['Digital signature found but certificate not found in our records']
      });
    }

    const certificateData = certificateDoc.data();
    if (certificateData?.status !== 'signed') {
      return NextResponse.json({
        isValid: false,
        error: ['Digital signature found but certificate is not properly signed in our records']
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
      { error: ['Failed to verify certificate'] },
      { status: 500 }
    );
  }
}