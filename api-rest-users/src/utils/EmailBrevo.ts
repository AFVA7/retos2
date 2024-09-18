const brevo = require('@getbrevo/brevo');
let defaultClient = brevo.ApiClient.instance;

let apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.API_KEY_BREVO; // Reemplaza con tu API Key

let apiInstance = new brevo.TransactionalEmailsApi();

/**
 * Función para enviar un email de recuperación de contraseña
 * @param {string} userName - Nombre del usuario que recibe el correo
 * @param {string} userEmail - Correo electrónico del usuario
 * @param {string} resetToken - Token para recuperación de contraseña
 */
const sendPasswordResetEmail = (userName:string, userEmail:string, resetToken:string) => {
  let sendSmtpEmail = new brevo.SendSmtpEmail();

  // Personalizar el email
  sendSmtpEmail.subject = "Recuperación de contraseña";
  sendSmtpEmail.htmlContent = `
    <html>
      <body>
        <h1>Hola, ${userName}</h1>
        <p>Has solicitado restablecer tu contraseña. Para continuar, haz clic en el siguiente enlace:</p>
        <a href="https://tusitio.com/reset-password?token=${resetToken}">Restablecer contraseña</a>
        <p>Si no solicitaste este cambio, ignora este mensaje.</p>
      </body>
    </html>`;
  
  sendSmtpEmail.sender = { "name": "Tu Empresa", "email": "no-reply@tuempresa.com" };
  sendSmtpEmail.to = [{ "email": userEmail, "name": userName }];
  sendSmtpEmail.replyTo = { "email": "soporte@tuempresa.com", "name": "Soporte Técnico" };
  
  // Llamada a la API para enviar el correo
  return apiInstance.sendTransacEmail(sendSmtpEmail)
    .then((data:any) => {
      console.log('Correo enviado exitosamente:', JSON.stringify(data));
    })
    .catch((error:any) => {
      console.error('Error al enviar el correo:', error);
    });
};

module.exports = { sendPasswordResetEmail };
