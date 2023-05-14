// mailer.service.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailerService {
  private transporter;

  constructor(private configservice: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configservice.get('MAIL_HOST'),
      port: Number(this.configservice.get('MAIL_PORT')),
      secure: false, // true for 465, false for other ports
      auth: {
        user: this.configservice.get('MAIL_EMAIL_USER'),
        pass: this.configservice.get('MAIL_EMAIL_PASSWORD'),
      },
    });
    console.log(this.transporter);
  }

  async sendEmail(to: string, subject: string, html: string): Promise<void> {
    const mailOptions = {
      from: this.configservice.get('MAIL_EMAIL_USER'),
      to,
      subject,
      html,
    };
    console.log(mailOptions);
    console.log(this.transporter);

    await this.transporter.sendMail(mailOptions);
  }
}
