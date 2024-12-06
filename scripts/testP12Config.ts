const testP12Config = () => {
    const p12Base64 = process.env.NEXT_PUBLIC_P12_CERTIFICATE;
    const passphrase = process.env.NEXT_PUBLIC_P12_PASSPHRASE;
  
    if (!p12Base64) {
      console.error('P12 certificate not found in environment variables');
      return;
    }
  
    try {
      // Try to decode the base64
      const p12Buffer = Buffer.from(p12Base64, 'base64');
      console.log('P12 certificate loaded successfully');
      console.log('Certificate size:', p12Buffer.length, 'bytes');
      console.log('Passphrase configured:', !!passphrase);
    } catch (error) {
      console.error('Error decoding P12 certificate:', error);
    }
  };
  
  testP12Config();