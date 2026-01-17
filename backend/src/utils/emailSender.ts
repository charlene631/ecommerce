import nodemailer, { SentMessageInfo } from "nodemailer";

// Interface pour les options de l'email
interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: EmailOptions): Promise<SentMessageInfo> {
try {
    const transporter = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: to,
        subject: subject,
        html: html,
    };

    const result = await transporter.sendMail(mailOptions);
    return result;
} catch (error) {
    console.error("Erreur lors de l'envoi de l'email :", error);
    throw new Error("Erreur lors de l'envoi de l'email");
}
}
