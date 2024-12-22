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

export async function batchSignCertificates(
  certificates: Certificate[], 
  idToken: string,
  generatePDF: (cert: any) => Promise<Uint8Array>,
  onProgress?: (current: number, total: number) => void
) {
  const batchSize = 5;
  const certificateBatches = [];

  // Prepare batches
  for (let i = 0; i < certificates.length; i += batchSize) {
    const batch = certificates.slice(i, i + batchSize);
    
    // Generate PDFs for the batch
    const batchData = await Promise.all(
      batch.map(async (cert) => ({
        certificateId: cert.id,
        pdfBytes: Array.from(await generatePDF(cert))
      }))
    );

    certificateBatches.push(batchData);
  }

  let totalSuccess = 0;
  let totalFailed = 0;

  // Process each batch
  for (let i = 0; i < certificateBatches.length; i++) {
    const batch = certificateBatches[i];
    
    // Report progress if callback provided
    if (onProgress) {
      onProgress(i + 1, certificateBatches.length);
    }

    const response = await fetch('/api/certificates/batch-sign', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${idToken}`
      },
      body: JSON.stringify({ certificates: batch })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to process batch');
    }

    const result = await response.json();
    totalSuccess += result.success;
    totalFailed += result.failed;
  }

  return { totalSuccess, totalFailed };
}

