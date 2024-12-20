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
// Helper function to check if file is PNG by looking at file signature
function isPNG(buffer: ArrayBuffer): boolean {
  const header = new Uint8Array(buffer.slice(0, 8));
  return header[0] === 0x89 && 
         header[1] === 0x50 && // P
         header[2] === 0x4E && // N
         header[3] === 0x47 && // G
         header[4] === 0x0D && // CR
         header[5] === 0x0A && // LF
         header[6] === 0x1A && // EOF
         header[7] === 0x0A;   // LF
}

export async function generateCertificatePDF(participant: CertificateData): Promise<Uint8Array> {
  try {
    console.log('Generating PDF with position:', participant.namePosition);

    // Create a new PDFDocument
    const pdfDoc = await PDFDocument.create();

    // Validate URL
    if (!participant.certificateTemplate) {
      throw new Error('Certificate template URL is missing');
    }

    // Get the template image
    const templateResponse = await fetch(participant.certificateTemplate);
    if (!templateResponse.ok) {
      throw new Error('Failed to fetch certificate template');
    }
    
    const templateImageBytes = await templateResponse.arrayBuffer();
      // Check actual file signature instead of relying on content-type
      const isPngFile = isPNG(templateImageBytes);
      console.log('File detected as:', isPngFile ? 'PNG' : 'JPG')

    // Determine image type and embed accordingly
    let templateImage;
    try {
      if (isPngFile) {
        templateImage = await pdfDoc.embedPng(templateImageBytes);
      } else {
        templateImage = await pdfDoc.embedJpg(templateImageBytes);
      }
    } catch (embedError) {
      console.error('Error embedding image:', embedError);
      if (embedError instanceof Error) {
        throw new Error(`Failed to process image: ${embedError.message}`);
      } else {
        throw new Error('Failed to process image: Unknown error');
      }
    }

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
