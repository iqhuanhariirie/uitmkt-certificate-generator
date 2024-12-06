interface Certificate {
  id: string;
  status: string;
  eventId: string;
}

export async function signCertificate(certificate: Certificate, pdfBytes: Uint8Array) {
  try {
    // Convert Uint8Array to base64 string for transmission
    const base64Pdf = Buffer.from(pdfBytes).toString('base64');

    const response = await fetch('/api/certificates/sign', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        certificateId: certificate.id,
        pdfBase64: base64Pdf // Send as base64 string
      })
    });

    if (!response.ok) {
      throw new Error('Failed to sign certificate');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error signing certificate:', error);
    throw error;
  }
}
