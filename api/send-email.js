// File: api/send-email.js

// Import the Resend SDK
import { Resend } from 'resend';

// Initialize Resend with your API Key
const resend = new Resend(process.env.RESEND_API_KEY);

// This is the main function that Vercel will run
export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    // Get the delivery details from the Flutter app's request
    const { to, recipientName, senderName, packageDescription, trackingId } = req.body;

    // Use the Resend SDK to send the email
    const { data, error } = await resend.emails.send({
      from: 'SwiftSend <noreply@yourdomain.com>', // Replace with your verified domain in Resend
      to: [to],
      subject: `Your SwiftSend Delivery (${trackingId}) is on its way!`,
      html: `
        <p>Hello ${recipientName},</p>
        <p>Great news! A package from ${senderName} is now on its way to you.</p>
        <p><b>Package:</b> ${packageDescription}</p>
        <p><b>Tracking ID:</b> ${trackingId}</p>
        <p>Thank you for using SwiftSend!</p>
      `,
    });

    if (error) {
      return res.status(400).json(error);
    }

    // Send a success response back to the Flutter app
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}