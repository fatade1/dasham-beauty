import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const booking = await request.json();

    if (!booking || !booking.id) {
      return NextResponse.json({ error: 'Invalid booking data' }, { status: 400 });
    }

    const host = process.env.SMTP_HOST;
    const port = process.env.SMTP_PORT;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const to = process.env.SMTP_TO;

    if (!host || !port || !user || !pass || !to) {
      console.error('SMTP environment variables are not fully configured.');
      return NextResponse.json(
        { error: 'Mail server not configured. Please check environment variables.' },
        { status: 500 }
      );
    }

    const transporter = nodemailer.createTransport({
      host,
      port: parseInt(port),
      secure: process.env.SMTP_SECURE === 'true',
      auth: { user, pass },
    });

    const formatNaira = (amount: number) => `₦${amount.toLocaleString('en-NG')}`;

    const dateLabel = new Date(booking.preferredDate).toLocaleDateString('en-GB', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

    // Format time (e.g. "10:00" -> "10:00 AM")
    const formatTime = (time: string) => {
      const [h, m] = time.split(':').map(Number);
      const period = h < 12 ? 'AM' : 'PM';
      const displayH = h % 12 === 0 ? 12 : h % 12;
      return `${displayH}:${String(m).padStart(2, '0')} ${period}`;
    };

    const timeLabel = formatTime(booking.preferredTime);

    // Build the itemized services rows
    let servicesHtml = '';
    if (booking.selectedServices && booking.selectedServices.length > 0) {
      servicesHtml = booking.selectedServices
        .map((s: any) => {
          const depVal = Math.round(s.price * (s.depositPercent / 100));
          const typeLabel = s.pricingType === 'fixed' ? 'Fixed' : s.pricingType === 'range' ? 'Range' : 'Custom';
          const priceLabel = s.pricingType === 'custom' ? 'Consultation' : formatNaira(s.price);
          const depositLabel = depVal > 0 ? `${formatNaira(depVal)} (${s.depositPercent}%)` : '—';
          return `
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #eeeeee;"><strong>${s.name}</strong></td>
              <td style="padding: 10px; border-bottom: 1px solid #eeeeee;">${s.category}</td>
              <td style="padding: 10px; border-bottom: 1px solid #eeeeee;">${typeLabel}</td>
              <td style="padding: 10px; border-bottom: 1px solid #eeeeee;">${priceLabel}</td>
              <td style="padding: 10px; border-bottom: 1px solid #eeeeee; color: #800000; font-weight: bold;">${depositLabel}</td>
            </tr>
          `;
        })
        .join('');
    } else {
      servicesHtml = `
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eeeeee;"><strong>${booking.serviceName}</strong></td>
          <td style="padding: 10px; border-bottom: 1px solid #eeeeee;">${booking.serviceCategory}</td>
          <td style="padding: 10px; border-bottom: 1px solid #eeeeee;">${booking.pricingType}</td>
          <td style="padding: 10px; border-bottom: 1px solid #eeeeee;">${formatNaira(booking.totalAmount)}</td>
          <td style="padding: 10px; border-bottom: 1px solid #eeeeee; color: #800000; font-weight: bold;">${formatNaira(booking.depositAmount)}</td>
        </tr>
      `;
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>New Booking Notification</title>
        <style>
          body {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            background-color: #f4f1ea;
            margin: 0;
            padding: 20px;
            color: #333333;
          }
          .email-container {
            max-width: 600px;
            background-color: #ffffff;
            margin: 0 auto;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
            border: 1px solid #e0dcd3;
          }
          .header {
            background-color: #800000;
            padding: 24px;
            text-align: center;
            color: #fff7dc;
          }
          .header h1 {
            margin: 0;
            font-size: 20px;
            letter-spacing: 0.1em;
            text-transform: uppercase;
          }
          .header p {
            margin: 5px 0 0;
            font-size: 12px;
            color: #f0c434;
            letter-spacing: 0.05em;
          }
          .content {
            padding: 30px 24px;
          }
          .section-title {
            font-size: 14px;
            font-weight: bold;
            color: #800000;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            margin-bottom: 15px;
            border-bottom: 2px solid #800000;
            padding-bottom: 5px;
          }
          .details-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 25px;
            font-size: 14px;
          }
          .details-table td {
            padding: 8px 0;
          }
          .details-table td.label {
            color: #777777;
            width: 30%;
            font-weight: bold;
          }
          .details-table td.value {
            color: #111111;
            font-weight: 500;
          }
          .services-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 13px;
            margin-bottom: 25px;
          }
          .services-table th {
            background-color: #fff7dc;
            color: #555555;
            text-align: left;
            padding: 10px;
            font-weight: bold;
            border-bottom: 1px solid #e0dcd3;
          }
          .price-box {
            background-color: #fff7dc;
            border-radius: 8px;
            padding: 15px;
            border: 1px solid #e0dcd3;
            margin-bottom: 20px;
          }
          .price-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
            font-size: 14px;
          }
          .price-row:last-child {
            margin-bottom: 0;
          }
          .price-total {
            font-weight: bold;
            color: #800000;
            border-top: 1px solid #e0dcd3;
            padding-top: 8px;
            margin-top: 8px;
            font-size: 16px;
          }
          .footer {
            background-color: #f4f1ea;
            padding: 15px;
            text-align: center;
            font-size: 12px;
            color: #777777;
            border-top: 1px solid #e0dcd3;
          }
          .btn-action {
            display: inline-block;
            background-color: #800000;
            color: #ffffff !important;
            text-decoration: none;
            padding: 12px 24px;
            border-radius: 6px;
            font-weight: bold;
            font-size: 14px;
            margin-top: 15px;
            text-align: center;
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="header">
            <h1>Dasham Beauty Lounge</h1>
            <p>New Appointment Booking Notification</p>
          </div>
          <div class="content">
            <!-- Client details -->
            <div class="section-title">Customer Details</div>
            <table class="details-table">
              <tr>
                <td class="label">Name</td>
                <td class="value">${booking.customerName}</td>
              </tr>
              <tr>
                <td class="label">Phone</td>
                <td class="value"><a href="tel:${booking.phone}">${booking.phone}</a></td>
              </tr>
              <tr>
                <td class="label">Email</td>
                <td class="value">${booking.email || '—'}</td>
              </tr>
            </table>

            <!-- Appointment details -->
            <div class="section-title">Appointment Details</div>
            <table class="details-table">
              <tr>
                <td class="label">Booking Ref</td>
                <td class="value" style="font-family: monospace; font-size: 15px; font-weight: bold; letter-spacing: 0.05em; color: #800000;">${booking.id.toUpperCase()}</td>
              </tr>
              <tr>
                <td class="label">Date</td>
                <td class="value" style="font-weight: bold;">${dateLabel}</td>
              </tr>
              <tr>
                <td class="label">Time Slot</td>
                <td class="value" style="font-weight: bold;">${timeLabel}</td>
              </tr>
              ${booking.notes ? `
              <tr>
                <td class="label">Special Notes</td>
                <td class="value">${booking.notes}</td>
              </tr>
              ` : ''}
            </table>

            <!-- Services Selected -->
            <div class="section-title">Selected Services</div>
            <table class="services-table">
              <thead>
                <tr>
                  <th>Service</th>
                  <th>Category</th>
                  <th>Type</th>
                  <th>Price</th>
                  <th>Deposit</th>
                </tr>
              </thead>
              <tbody>
                ${servicesHtml}
              </tbody>
            </table>

            <!-- Payment Reference -->
            <div class="section-title">Payment Verification</div>
            <table class="details-table">
              ${booking.nameUsedForTransfer ? `
              <tr>
                <td class="label">Transfer Name</td>
                <td class="value">${booking.nameUsedForTransfer}</td>
              </tr>
              ` : ''}
              ${booking.transactionReference ? `
              <tr>
                <td class="label">Transaction Ref</td>
                <td class="value"><code style="background: #f4f1ea; padding: 2px 6px; border-radius: 4px;">${booking.transactionReference}</code></td>
              </tr>
              ` : ''}
            </table>

            <div class="price-box">
              <div class="price-row">
                <span>Subtotal Price</span>
                <span>${formatNaira(booking.totalAmount)}</span>
              </div>
              <div class="price-row price-total">
                <span>Total Deposit Required</span>
                <span>${formatNaira(booking.depositAmount)}</span>
              </div>
            </div>

            <div style="text-align: center;">
              <a href="http://localhost:3001/admin/bookings/${booking.id}" class="btn-action">
                View & Confirm in Admin Panel
              </a>
            </div>
          </div>
          <div class="footer">
            © ${new Date().getFullYear()} Dasham Beauty Lounge. All rights reserved.<br>
            Opposite Kilimanjaro, Samonda, First Floor, Ibadan
          </div>
        </div>
      </body>
      </html>
    `;

    const mailOptions = {
      from: `"Dasham Bookings" <${user}>`,
      to,
      subject: `🚨 New Booking Alert: ${booking.customerName} (${booking.id.toUpperCase()})`,
      html: htmlContent,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error sending booking notification email:', error);
    return NextResponse.json(
      { error: 'Failed to send email', details: error.message },
      { status: 500 }
    );
  }
}
