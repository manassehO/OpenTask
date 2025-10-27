import { Resend } from 'resend';

import { env } from '~/env';

const resend = new Resend(env.RESEND_API_KEY);

async function sendEmail(to: string, subject: string, html: string) {
  try {
    const response = await resend.emails.send({
      from: env.EMAIL_FROM,
      to,
      subject,
      html,
    });

    if (response.error) {
      console.error(response.error);
      throw new Error('Something went wrong...');
    }

    return response;
  } catch (error) {
    console.error(error);
    throw new Error('Something went wrong...');
  }
}

export default sendEmail;
