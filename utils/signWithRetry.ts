// utils/signWithRetry.ts
import { P12Signer } from '@signpdf/signer-p12';
import { SignPdf } from '@signpdf/signpdf';
import crypto from 'crypto';

export async function signWithRetry(
  pdfBuffer: Buffer, 
  signer: P12Signer, 
  retries = 3, 
  delay = 1000
) {
    // Initialize OpenSSL
  try {
    crypto.randomBytes(32);
  } catch (error) {
    console.log('OpenSSL initialization error, retrying...');
  }
  let lastError;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
        // Add small delay before first attempt
      if (attempt === 1) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      const signPdf = new SignPdf();
      const signedPdf = await signPdf.sign(pdfBuffer, signer);
      return signedPdf;
    } catch (error) {
      lastError = error;
      
      if (
        error instanceof Error && 
        error.message.includes('could not load the shared library') && 
        attempt < retries
      ) {
        console.log(`Signing attempt ${attempt} failed, retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      
      throw error;
    }
  }
  
  throw lastError;
}