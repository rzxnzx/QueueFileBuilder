// src/email/email.service.ts
import { Injectable, Inject } from '@nestjs/common';
import { EmailConfig } from 'src/settings';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  constructor(@Inject(EmailConfig) private readonly emailConfig: EmailConfig) {}

  async sendEmailWithAttachment(email: string, subject: string, message: string, attachmentPath: string): Promise<void> {
    const transporter = nodemailer.createTransport({
      host: this.emailConfig.smtpHost,
      port: this.emailConfig.smtpPort,
      auth: {
        user: this.emailConfig.smtpUser,
        pass: this.emailConfig.smtpPass,
      },
    });

    const mailOptions = {
      from: this.emailConfig.smtpUser,
      to: email,
      subject: subject,
      text: message,
      attachments: [{ path: attachmentPath }],
    };

    await transporter.sendMail(mailOptions);
  }
}
