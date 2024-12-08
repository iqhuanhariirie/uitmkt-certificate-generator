import { PDFDocument, PDFName } from 'pdf-lib';
import { Certificate } from '@/utils/uploadToFirestore';

export interface VerificationResult {
  isValid: boolean;
  certificate?: Certificate;
  error?: string;
  signatureInfo?: {
    reason?: string;
    name?: string;
    location?: string;
    signedAt?: Date;
  };
}

export async function verifySignature(pdfBuffer: ArrayBuffer): Promise<{
  isValid: boolean;
  signatureInfo?: any;
  error?: string;
  certificateId?: string;
}> {
  try {
    // Load PDF document
    const pdfDoc = await PDFDocument.load(pdfBuffer);
    
    // Get signature fields
    const form = pdfDoc.getForm();
    const fields = form.getFields();
    
    // Extract PDF metadata
    const title = pdfDoc.getTitle();
    const author = pdfDoc.getAuthor();
    const subject = pdfDoc.getSubject();
    const keywords = pdfDoc.getKeywords();
    const modificationDate = pdfDoc.getModificationDate();

    // Get signature info from metadata
    const signatureField = fields.find(field => {
      const name = field.getName();
      return name.toLowerCase().includes('signature');
    });

    if (!signatureField) {
      return {
        isValid: false,
        error: 'No signature field found'
      };
    }

    // Get signature dictionary
    const acroField = signatureField.acroField;
    const dictionary = acroField.dict;
    
    // Check if the signature exists
    const signatureDictionary = dictionary.get(PDFName.of('V'));
    
    if (!signatureDictionary) {
      return {
        isValid: false,
        error: 'Document is not signed'
      };
    }

    // Extract certificate ID from Title metadata
    const certificateId = title;

    if (!certificateId) {
      return {
        isValid: false,
        error: 'Invalid certificate format'
      };
    }

    // Extract signature information
    const signatureInfo = {
      reason: subject || dictionary.get(PDFName.of('Reason'))?.toString() || 'Certificate Validation',
      name: author || dictionary.get(PDFName.of('Name'))?.toString() || 'UITM KT CDCS230',
      location: keywords || dictionary.get(PDFName.of('Location'))?.toString() || 'Kuala Terengganu',
      signedAt: modificationDate
    };

    return {
      isValid: true,
      signatureInfo,
      certificateId
    };

  } catch (error) {
    console.error('Signature verification error:', error);
    return {
      isValid: false,
      error: 'Failed to verify signature'
    };
  }
}