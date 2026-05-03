const BREVO_URL = "https://api.brevo.com/v3/smtp/email";

export async function sendEmail({ to, subject, html }) {
  try {
    const response = await fetch(BREVO_URL, {
      method: "POST",
      headers: {
        "api-key": process.env.BREVO_API_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        sender: {
          name: "Adopt System",
          email: "no-reply@myapp.com"
        },
        to: [{ email: to }],
        subject,
        htmlContent: html
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Brevo error:", data);
      throw new Error("Email failed");
    }

    return data;
  } catch (err) {
    console.error("Send email error:", err);
  }
}
