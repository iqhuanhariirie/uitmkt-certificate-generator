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
  const BATCH_SIZE = 10; // Total certificates per API call
  const results = {
    totalSuccess: 0,
    totalFailed: 0,
    errors: [] as any[]
  };

  // Split certificates into smaller batches
  const batches = [];
  for (let i = 0; i < certificates.length; i += BATCH_SIZE) {
    batches.push(certificates.slice(i, i + BATCH_SIZE));
  }

  // Process each batch
  for (let i = 0; i < batches.length; i++) {
    const batch = batches[i];
    
    if (onProgress) {
      onProgress(i + 1, batches.length);
    }

    try {
      // Generate PDFs for the current batch
      const batchData = await Promise.all(
        batch.map(async (cert) => ({
          certificateId: cert.id,
          pdfBytes: Array.from(await generatePDF(cert))
        }))
      );

      const response = await fetch('/api/certificates/batch-sign', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`
        },
        body: JSON.stringify({ certificates: batchData })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to process batch');
      }

      const result = await response.json();
      results.totalSuccess += result.success;
      results.totalFailed += result.failed;
      if (result.errors) {
        results.errors.push(...result.errors);
      }

      // Add delay between batches
      if (i < batches.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    } catch (error) {
      console.error(`Error processing batch ${i + 1}:`, error);
      results.totalFailed += batch.length;
    }
  }

  return results;
}

