import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import CertificateEmail from '@/components/CertificateEmail';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
    if (!process.env.RESEND_API_KEY || !process.env.EMAIL_FROM) {
        return NextResponse.json(
          { success: false, error: 'Email configuration missing' },
          { status: 500 }
        );
      }
      
  try {
    const { recipients } = await request.json();

    const emailPromises = recipients.map(async (recipient: any) => {
      try {
        await resend.emails.send({
          from: process.env.EMAIL_FROM!,
          to: recipient.email,
          subject: `Your Certificate for ${recipient.eventName} is Ready`,
          react: CertificateEmail({
            recipientName: recipient.guestName,
            eventName: recipient.eventName,
            certificateUrl: recipient.certificateUrl
          })
        });

        return { email: recipient.email, success: true };
      } catch (error) {
        console.error(`Failed to send email to ${recipient.email}:`, error);
        return { email: recipient.email, success: false, error };
      }
    });

    const results = await Promise.all(emailPromises);
    
    return NextResponse.json({ 
      success: true, 
      results 
    });
  } catch (error) {
    console.error('Email sending error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send emails' },
      { status: 500 }
    );
  }
}