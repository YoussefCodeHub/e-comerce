import type { SentMessageInfo } from 'nodemailer';

import nodemailer, { Transporter } from 'nodemailer';
import 'dotenv/config';

const transporter: Transporter = nodemailer.createTransport({
  service: 'Gmail',
  /*
  // or use the following for customization:
  host: "smtp.gmail.com",
  port: 587, // 465 → SSL/TLS direct (secure: true)
  secure: false, // true for 465, false for other ports
  tls: {
    rejectUnauthorized: false,
  },
  */
  auth: {
    user: process.env.GOOGLE_EMAIL_TARNSPORTER,
    pass: process.env.GOOGLE_EMAIL_TARNSPORTER_PASSWORD,
  },
});

interface EmailOptions {
  to: string;
  subject: string;
  html?: string;
  text?: string;
}

const sendEmail = async ({
  to,
  subject,
  html,
  text,
}: EmailOptions): Promise<SentMessageInfo> => {
  try {
    const info = await transporter.sendMail({
      from: '"Social-media App" <youssef.dev@gmail.com>',
      to,
      subject,
      text,
      html,
    });

    console.log('Email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

export default sendEmail;
