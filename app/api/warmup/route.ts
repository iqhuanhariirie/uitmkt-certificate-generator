import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function GET() {
  try {
    // Perform a simple crypto operation to initialize OpenSSL
    crypto.randomBytes(32);
    return NextResponse.json({ status: 'ready' });
  } catch (error) {
    return NextResponse.json({ 
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}