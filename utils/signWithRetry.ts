// utils/signWithRetry.ts
import { P12Signer } from '@signpdf/signer-p12';
import { SignPdf } from '@signpdf/signpdf';

export async function signWithRetry(
  pdfBuffer: Buffer, 
  signer: P12Signer, 
  retries = 3, 
  delay = 1000
) {
  let lastError;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
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