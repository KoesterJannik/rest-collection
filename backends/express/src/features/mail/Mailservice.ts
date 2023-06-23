import * as nodemailer from "nodemailer";
import * as handlebars from "handlebars";
import * as fs from "fs";
import * as path from "path";

type SendMailWithTemplate = {
  to: string[];
  subject: string;
  templateName: string;
  templateData: any;
};
class MailerService {
  private transporter;

  constructor() {
    console.log(process.env.MAIL_HOST);
    this.transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: Number(process.env.MAIL_PORT),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.MAIL_SENDER,
        pass: process.env.MAIL_PASSWORD,
      },
    });
  }

  async sendEmail(data: SendMailWithTemplate): Promise<void> {
    const templatePath = path.join(__dirname, "templates", data.templateName);
    console.log(templatePath);
    const template = fs.readFileSync(templatePath, "utf8");

    const compiledTemplate = handlebars.compile(template);
    const html = compiledTemplate(data.templateData);

    const mailOptions = {
      from: process.env.MAIL_SENDER,
      to: data.to,
      subject: data.subject,
      html,
    };

    await this.transporter.sendMail(mailOptions);
  }
}
const mailer = new MailerService();

export default mailer;
