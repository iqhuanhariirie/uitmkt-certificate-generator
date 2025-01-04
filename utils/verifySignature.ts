import { PDFDocument, PDFName } from 'pdf-lib';
import { Certificate } from '@/utils/uploadToFirestore';

export async function verifySignature(pdfBuffer: ArrayBuffer): Promise<{
  isValid: boolean;
  signatureInfo?: any;
  error?: string[];
  certificateId?: string;
}> {
  try {
    const errors: string[] = [];

    //Load PDF document
    const pdfDoc = await PDFDocument.load(pdfBuffer);
    
    // Get signature fields
    const form = pdfDoc.getForm();
    const fields = form.getFields();
    
    // Check for signature field first
    const signatureField = fields.find(field => {
      const name = field.getName();
      return name.toLowerCase().includes('signature');
    });

    if (!signatureField) {
      errors.push('No signature field found');
      // Return early as this is definitely not our certificate
      return {
        isValid: false,
        error: errors,
        certificateId: undefined
      };
    }

    // Only check metadata if signature field exists
    const title = pdfDoc.getTitle();
    const author = pdfDoc.getAuthor();
    const subject = pdfDoc.getSubject();
    const keywords = pdfDoc.getKeywords();
    const modificationDate = pdfDoc.getModificationDate();

    // Get signature dictionary
    const acroField = signatureField.acroField;
    const dictionary = acroField.dict;
    const signatureDictionary = dictionary.get(PDFName.of('V'));
    
    if (!signatureDictionary) {
      errors.push('Document is not signed');
    }

    // Check if this is one of our certificates by validating the title format
    // Assuming your certificate IDs follow a specific format, e.g., UUID
    const isCertificateId = title && /^[a-zA-Z0-9-]+$/.test(title); // Adjust regex as needed

    if (!isCertificateId) {
      errors.push('Invalid certificate format');
      return {
        isValid: false,
        error: errors,
        certificateId: undefined
      };
    }

    // Only return certificate ID if it looks valid
    const certificateId = isCertificateId ? title : undefined;

    const signatureInfo = errors.length === 0 ? {
      reason: subject || 'Certificate Validation',
      name: author || 'UITM KT CDCS230',
      location: keywords || 'Kuala Terengganu',
      signedAt: modificationDate
    } : undefined;

    return {
      isValid: errors.length === 0,
      signatureInfo,
      certificateId,
      error: errors.length > 0 ? errors : undefined
    };

  } catch (error) {
    console.error('Signature verification error:', error);
    return {
      isValid: false,
      error: ['Failed to verify signature']
    };
  }
}