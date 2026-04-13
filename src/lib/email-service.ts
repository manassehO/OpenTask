import sendEmailFunction from './sender';

export async function sendEmail(params: {
  to: string;
  subject: string;
  text?: string;
  html: string;
}) {
  return sendEmailFunction(params.to, params.subject, params.html);
}
