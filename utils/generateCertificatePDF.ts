import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

interface CertificateData {
  certificateTemplate: string;
  guestName: string;
  namePosition: {
    top: number;
    left: number;
    fontSize: number;
  };
}

export async function generateCertificatePDF(participant: CertificateData): Promise<Uint8Array> {
  try {
    console.log('Generating PDF with position:', participant.namePosition);

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

    // Calculate text position using the namePosition percentages
    const nameX = (participant.namePosition.left / 100) * width;
    const nameY = height - ((participant.namePosition.top / 100) * height);

    // Get text width for centering
    const textWidth = font.widthOfTextAtSize(
      participant.guestName, 
      participant.namePosition.fontSize
    );

    // Add participant name with position and font size from namePosition
    page.drawText(participant.guestName, {
      x: nameX - (textWidth / 2), // Center text horizontally
      y: nameY - (participant.namePosition.fontSize / 3), // Adjust vertical position for baseline
      size: participant.namePosition.fontSize,
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
