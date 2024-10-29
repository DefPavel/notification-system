import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  async sendEmail(to: string, subject: string, text: string) {
    await this.transporter.sendMail({
      from: `"Notification App" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
    });
  }
}
