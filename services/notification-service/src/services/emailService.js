/**
 * Email Service using Nodemailer
 * 
 * Configuration (set in environment variables):
 * - SMTP_HOST: SMTP server host
 * - SMTP_PORT: SMTP server port
 * - SMTP_USER: SMTP username
 * - SMTP_PASS: SMTP password
 * - EMAIL_FROM: Default sender email
 */

const nodemailer = require("nodemailer");

// Create transporter with placeholder config
// Replace with actual SMTP credentials for production
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT) || 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER || "your-email@gmail.com",
    pass: process.env.SMTP_PASS || "your-app-password"
  }
});

const emailTemplates = {
  welcome: (data) => ({
    subject: "Bienvenue sur la plateforme universitaire",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2563eb;">Bienvenue ${data.name || ""}!</h1>
        <p>Votre compte a été créé avec succès sur notre plateforme universitaire.</p>
        <p>Vous pouvez maintenant accéder à tous les services:</p>
        <ul>
          <li>Consulter vos notes</li>
          <li>Voir votre emploi du temps</li>
          <li>Gérer vos factures</li>
        </ul>
        <a href="${data.loginUrl || '#'}" style="display: inline-block; padding: 12px 24px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 6px;">
          Se connecter
        </a>
        <p style="color: #666; margin-top: 20px;">L'équipe universitaire</p>
      </div>
    `
  }),

  gradeRelease: (data) => ({
    subject: `Nouvelle note disponible - ${data.courseName || "Cours"}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2563eb;">Nouvelle Note Publiée</h1>
        <p>Une nouvelle note a été publiée pour le cours <strong>${data.courseName}</strong>.</p>
        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Cours:</strong> ${data.courseName}</p>
          <p><strong>Note:</strong> ${data.score}/100 (${data.gradeLetter})</p>
          <p><strong>Semestre:</strong> ${data.semester}</p>
        </div>
        <a href="${data.gradesUrl || '#'}" style="display: inline-block; padding: 12px 24px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 6px;">
          Voir mes notes
        </a>
      </div>
    `
  }),

  paymentConfirmation: (data) => ({
    subject: `Confirmation de paiement - ${data.amount} XOF`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #10b981;">Paiement Confirmé ✓</h1>
        <p>Votre paiement a été traité avec succès.</p>
        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Montant:</strong> ${data.amount} XOF</p>
          <p><strong>Référence:</strong> ${data.transactionId}</p>
          <p><strong>Méthode:</strong> ${data.provider}</p>
          <p><strong>Date:</strong> ${new Date().toLocaleDateString("fr-FR")}</p>
        </div>
        <p style="color: #666;">Conservez cet email comme reçu de paiement.</p>
      </div>
    `
  }),

  paymentReminder: (data) => ({
    subject: `Rappel: Facture en attente - ${data.amount} XOF`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #f59e0b;">Rappel de Paiement</h1>
        <p>Vous avez une facture en attente de paiement.</p>
        <div style="background: #fff7ed; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #fed7aa;">
          <p><strong>Montant:</strong> ${data.amount} XOF</p>
          <p><strong>Description:</strong> ${data.description}</p>
          <p><strong>Échéance:</strong> ${data.dueDate}</p>
        </div>
        <a href="${data.billingUrl || '#'}" style="display: inline-block; padding: 12px 24px; background-color: #f59e0b; color: white; text-decoration: none; border-radius: 6px;">
          Payer maintenant
        </a>
      </div>
    `
  }),

  scheduleChange: (data) => ({
    subject: `Modification d'emploi du temps - ${data.courseName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2563eb;">Modification d'Emploi du Temps</h1>
        <p>L'horaire du cours <strong>${data.courseName}</strong> a été modifié.</p>
        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Ancien horaire:</strong> ${data.oldSchedule}</p>
          <p><strong>Nouvel horaire:</strong> ${data.newSchedule}</p>
          <p><strong>Salle:</strong> ${data.room}</p>
        </div>
        <a href="${data.scheduleUrl || '#'}" style="display: inline-block; padding: 12px 24px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 6px;">
          Voir mon emploi du temps
        </a>
      </div>
    `
  })
};

/**
 * Send an email notification
 */
async function sendEmail(to, template, data) {
  try {
    const emailContent = emailTemplates[template](data);
    
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || '"Université" <noreply@universite.ne>',
      to: to,
      subject: emailContent.subject,
      html: emailContent.html
    });

    console.log(`📧 Email sent: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Email error:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Send a custom email
 */
async function sendCustomEmail(to, subject, htmlContent) {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || '"Université" <noreply@universite.ne>',
      to: to,
      subject: subject,
      html: htmlContent
    });

    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Email error:", error);
    return { success: false, error: error.message };
  }
}

module.exports = {
  sendEmail,
  sendCustomEmail,
  emailTemplates
};
