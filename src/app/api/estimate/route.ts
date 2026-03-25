import { NextResponse } from 'next/server';

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const TO_EMAIL = process.env.ESTIMATE_TO_EMAIL || 'josecapacho@gmail.com';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fullName, email, phone, service, message } = body;

    // Server-side validation
    if (!fullName || !email || !phone || !service || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    if (!RESEND_API_KEY) {
      console.error('RESEND_API_KEY is not configured');
      return NextResponse.json(
        { error: 'Email service is not configured' },
        { status: 500 }
      );
    }

    // Send notification email to Real Elite
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Real Elite Contracting <info@realelitecontracting.com>',
        to: [TO_EMAIL],
        subject: `New Estimate Request: ${service} — ${fullName}`,
        reply_to: email,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background-color: #1a365d; padding: 20px; text-align: center;">
              <h1 style="color: #d4a853; margin: 0; font-size: 24px;">New Estimate Request</h1>
            </div>
            <div style="padding: 24px; background-color: #f8f9fa; border: 1px solid #e2e8f0;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 12px 8px; border-bottom: 1px solid #e2e8f0; font-weight: bold; color: #1a365d; width: 120px;">Name</td>
                  <td style="padding: 12px 8px; border-bottom: 1px solid #e2e8f0;">${fullName}</td>
                </tr>
                <tr>
                  <td style="padding: 12px 8px; border-bottom: 1px solid #e2e8f0; font-weight: bold; color: #1a365d;">Email</td>
                  <td style="padding: 12px 8px; border-bottom: 1px solid #e2e8f0;"><a href="mailto:${email}">${email}</a></td>
                </tr>
                <tr>
                  <td style="padding: 12px 8px; border-bottom: 1px solid #e2e8f0; font-weight: bold; color: #1a365d;">Phone</td>
                  <td style="padding: 12px 8px; border-bottom: 1px solid #e2e8f0;"><a href="tel:${phone}">${phone}</a></td>
                </tr>
                <tr>
                  <td style="padding: 12px 8px; border-bottom: 1px solid #e2e8f0; font-weight: bold; color: #1a365d;">Service</td>
                  <td style="padding: 12px 8px; border-bottom: 1px solid #e2e8f0;">${service}</td>
                </tr>
              </table>
              <div style="margin-top: 20px; padding: 16px; background-color: white; border-radius: 8px; border: 1px solid #e2e8f0;">
                <h3 style="color: #1a365d; margin: 0 0 8px 0; font-size: 14px;">Project Details</h3>
                <p style="margin: 0; color: #333; line-height: 1.6;">${message.replace(/\n/g, '<br>')}</p>
              </div>
            </div>
            <div style="padding: 16px; text-align: center; color: #718096; font-size: 12px;">
              <p>This estimate request was submitted via realelitecontracting.com</p>
            </div>
          </div>
        `,
      }),
    });

    if (!resendResponse.ok) {
      const errorData = await resendResponse.json();
      console.error('Resend API error:', errorData);
      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Estimate request sent successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Estimate form error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
