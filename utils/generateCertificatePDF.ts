import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

interface CertificateData {
  certificateTemplate: string;
  guestName: string;
}

export async function generateCertificatePDF(participant: CertificateData): Promise<Uint8Array> {
  try {
    // Create a new PDFDocument
    const pdfDoc = await PDFDocument.create();

    // Get the template image
    const templateResponse = await fetch(participant.certificateTemplate);
    if (!templateResponse.ok) {
      throw new Error('Failed to fetch certificate template');
    }
    
    const templateImageBytes = await templateResponse.arrayBuffer();
    const templateImage = await pdfDoc.embedJpg(templateImageBytes);

    // Get image dimensions
    const { width, height } = templateImage.size();

    // Add a page with template dimensions
    const page = pdfDoc.addPage([width, height]);

    // Draw the template image
    page.drawImage(templateImage, {
      x: 0,
      y: 0,
      width: width,
      height: height,
    });

    // Embed the font
    const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    // Calculate text position (center of page, slightly above middle)
    const centerX = width / 2;
    const nameY = height * 0.5; // Adjust this value to match your template

    // Add participant name
    page.drawText(participant.guestName, {
      x: centerX - (font.widthOfTextAtSize(participant.guestName, 24) / 2),
      y: nameY,
      size: 24,
      font: font,
      color: rgb(0, 0, 0),
    });

    // Save the PDF
    return new Uint8Array(await pdfDoc.save());
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
}
