import CertificateEmail from '@/components/CertificateEmail';
import { NextResponse } from 'next/server';
import { Resend } from 'resend';

interface EmailRecipient {
  email: string;
  guestName: string;
  eventName: string;
  certificateUrl: string;
}

interface EmailResult {
  email: string;
  success: boolean;
  error?: string;
}

const resend = new Resend(process.env.RESEND_API_KEY);
const BATCH_SIZE = 50;

function chunkArray<T>(array: T[], size: number): T[][] {
  return Array.from(
    { length: Math.ceil(array.length / size) },
    (_, i) => array.slice(i * size, i * size + size)
  );
}

export async function POST(request: Request) {
  if (!process.env.RESEND_API_KEY || !process.env.EMAIL_FROM) {
    return NextResponse.json(
      { success: false, error: 'Email configuration missing' },
      { status: 500 }
    );
  }
  
  try {
    const { recipients } = (await request.json()) as { recipients: EmailRecipient[] };
    
    const batches = chunkArray(recipients, BATCH_SIZE);
    const results: EmailResult[] = [];

    for (const batch of batches) {
      try {
        await resend.emails.send({
          from: process.env.EMAIL_FROM,
          to: batch.map((r: EmailRecipient) => r.email),
          subject: `Your Certificate for ${batch[0].eventName} is Ready`,
          react: CertificateEmail({
            recipientName: batch[0].guestName,
            eventName: batch[0].eventName,
            certificateUrl: batch[0].certificateUrl
          }),
          bcc: batch.map((r: EmailRecipient) => r.email)
        });

        results.push(
          ...batch.map((recipient: EmailRecipient) => ({
            email: recipient.email,
            success: true
          }))
        );

        if (batches.length > 1) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      } catch (error: any) {
        console.error('Batch send error:', error);
        results.push(
          ...batch.map((recipient: EmailRecipient) => ({
            email: recipient.email,
            success: false,
            error: error.message
          }))
        );
      }
    }

    return NextResponse.json({
      success: true,
      results,
      summary: {
        total: results.length,
        successful: results.filter(r => r.success).length,
        failed: results.filter(r => !r.success).length
      }
    });
  } catch (error) {
    console.error('Email sending error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send emails' },
      { status: 500 }
    );
  }
}