import nodemailer from "nodemailer";

export async function sendEmail({ to, subject, html }) {
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
}
