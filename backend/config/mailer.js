export const sendMail = async (to, subject, html) => {
  const from = process.env.MAIL_FROM || 'onboarding@resend.dev'
  const apiKey = process.env.RESEND_API_KEY

  if (!apiKey || apiKey === 're_your_api_key_here') {
    return { success: false, message: 'Skipped due to missing key' };
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [to],
        subject,
        html,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || `Resend API returned status ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error("Error sending email via Resend API:", error);
    throw error;
  }
}

export default sendMail
