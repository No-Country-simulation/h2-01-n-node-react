import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailService {
  constructor(private mailerService: MailerService) {}

  async sendVerificationEmail(email: string, code: string): Promise<void> {

    const textContent = `
      Verificación de Cuenta

      Gracias por registrarte en Waki. Para verificar tu cuenta, puedes usar el siguiente código:

      ${code}

      Este código y enlace expirarán en 15 minutos por seguridad.

      Si no has solicitado esta verificación, puedes ignorar este mensaje.
    `;

    await this.mailerService.sendMail({
      to: email,
      subject: 'Waki - Verificación de cuenta',
      text: textContent,
    });
  }
}