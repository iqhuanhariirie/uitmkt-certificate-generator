import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getStorage } from 'firebase-admin/storage';
import { getFirestore } from 'firebase-admin/firestore';

if (!getApps().length) {
  try {
    const base64Credentials = process.env.FIREBASE_ADMIN_CREDENTIALS;
    if (!base64Credentials) {
      throw new Error('Missing Firebase Admin credentials');
    }

    // Decode and parse the credentials
    const credentials = JSON.parse(
      Buffer.from(base64Credentials, 'base64').toString('utf-8')
    );

    initializeApp({
      credential: cert(credentials),
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
    });
    
    console.log('Firebase Admin initialized successfully');
  } catch (error) {
    console.error('Firebase Admin initialization error:', error);
    throw error;
  }
}

export const adminDb = getFirestore();
export const adminStorage = getStorage();