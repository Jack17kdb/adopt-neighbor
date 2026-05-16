const footer = `
  <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
  <p style="font-size: 12px; color: #94a3b8; text-align: center;">
    &copy; ${new Date().getFullYear()} Adopt a Neighbor Program. Helping communities thrive.
  </p>
`;

const baseStyle = "font-family: sans-serif; max-width: 600px; margin: auto; color: #333; line-height: 1.6; padding: 20px; border: 1px solid #f0f0f0; border-radius: 12px;";

export const neighborWelcomeEmail = (name) => ({
  subject: "Welcome to Adopt a Neighbor",
  html: `
    <div style="${baseStyle}">
      <h2 style="color: #1a4731;">Welcome, ${name}!</h2>
      <p>Thank you for joining <strong>Adopt a Neighbor</strong>. We are honored to have you in our community.</p>
      <div style="background: #f0fdf4; padding: 15px; border-radius: 8px; border-left: 4px solid #1a4731;">
        <p style="margin: 0;"><strong>What's next?</strong> We are currently reviewing our volunteer network to find the best match for your specific needs. We will notify you immediately once a match is confirmed.</p>
      </div>
      <p>Take care and stay safe.</p>
      ${footer}
    </div>
  `
});

export const certifiedVolunteerWelcomeEmail = (name) => ({
  subject: "Welcome to the Team!",
  html: `
    <div style="${baseStyle}">
      <h2 style="color: #1a4731;">Hero Status: Activated</h2>
      <p>Dear ${name},</p>
      <p>Thank you for volunteering! Your commitment to helping neighbors makes a world of difference.</p>
      <p>We are currently matching you with a neighbor who requires your specific skills. You will receive a detailed email as soon as a match is made.</p>
      ${footer}
    </div>
  `
});

export const uncertifiedVolunteerEmail = (name) => ({
  subject: "Volunteer Application Update",
  html: `
    <div style="${baseStyle}">
      <h2 style="color: #64748b;">Hello ${name},</h2>
      <p>Thank you for your interest in volunteering with Adopt a Neighbor.</p>
      <p>Due to current safety guidelines and verification requirements, we cannot match you for in-person errands at this time.</p>
      <div style="background: #f8fafc; padding: 15px; border-radius: 8px;">
        <p style="margin: 0; font-size: 14px;"><strong>Note:</strong> There may be remote opportunities (phone check-ins or digital support) in the future. We will keep your profile active and reach out if these opportunities arise.</p>
      </div>
      ${footer}
    </div>
  `
});

export const volunteerMatchEmail = (volunteerName, neighbor) => ({
  subject: `IMPORTANT: New Match with ${neighbor.name}`,
  html: `
    <div style="${baseStyle}">
      <h2 style="color: #1a4731;">You’ve Been Matched!</h2>
      <p>Dear ${volunteerName}, you have been matched with a neighbor requiring support.</p>

      <div style="background: #fff9e6; border-left: 4px solid #f59e0b; padding: 15px; margin: 15px 0;">
        <strong style="color: #92400e; display: block; margin-bottom: 5px;">⚠️ CRITICAL: VERIFY LEGITIMACY</strong>
        <p style="margin: 0; font-size: 14px; color: #92400e;">
          Before providing any physical aid or visiting, <strong>you must call the neighbor to verify their identity and ensure their need is legitimate.</strong> 
          Ask clarifying questions about their request to confirm they truly require assistance. If anything feels suspicious, do not proceed and contact us immediately.
        </p>
      </div>

      <div style="background: #f8fafc; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0;">
        <h3 style="margin-top: 0; font-size: 16px;">Neighbor Details</h3>
        <p style="margin: 5px 0;"><strong>Name:</strong> ${neighbor.name}</p>
        <p style="margin: 5px 0;"><strong>Address:</strong> ${neighbor.address}</p>
        <p style="margin: 5px 0;"><strong>Phone:</strong> <a href="tel:${neighbor.phone}" style="color: #1a4731; font-weight: bold;">${neighbor.phone}</a></p>
        <p style="margin: 5px 0;"><strong>Email:</strong> ${neighbor.email || "N/A"}</p>
      </div>

      <p style="font-size: 13px; color: #64748b; margin-top: 15px;">
        <em>Tip: Introduce yourself clearly as an "Adopt a Neighbor" volunteer when you call.</em>
      </p>
      ${footer}
    </div>
  `
});

export const neighborMatchEmail = (neighborName, volunteer) => ({
  subject: "We've Found a Volunteer for You!",
  html: `
    <div style="${baseStyle}">
      <h2 style="color: #1a4731;">Good News, ${neighborName}!</h2>
      <p>We have found a verified volunteer to assist you.</p>
      <div style="background: #f0fdf4; padding: 20px; border-radius: 8px;">
        <p style="margin: 5px 0;"><strong>Volunteer Name:</strong> ${volunteer.name}</p>
        <p style="margin: 5px 0;"><strong>Contact Phone:</strong> <a href="tel:${volunteer.phone}" style="color: #1a4731; font-weight: bold;">${volunteer.phone}</a></p>
      </div>
      <p>The volunteer has been instructed to contact you soon. For your safety, always ask the volunteer to identify themselves before sharing further details.</p>
      ${footer}
    </div>
  `
});

export const volunteerCheckInEmail = (name) => ({
  subject: "Quick Check-in: How is it going?",
  html: `
    <div style="${baseStyle}">
      <h2 style="color: #1a4731;">Hello ${name},</h2>
      <p>We’re checking in to see how your recent match is progressing.</p>
      <p>Were you able to verify the neighbor's needs? Has the assistance been completed, or do you need further support from our team?</p>
      ${footer}
    </div>
  `
});

export const neighborCheckEmail = (name) => ({
  subject: "Checking in on you",
  html: `
    <div style="${baseStyle}">
      <h2 style="color: #1a4731;">Hi ${name},</h2>
      <p>We wanted to make sure you are getting the help you need. Has your volunteer been helpful? Do you have any additional concerns?</p>
      <p>We are here to support you every step of the way.</p>
      ${footer}
    </div>
  `
});

export const staffWelcomeEmail = (username, email, password) => ({
  subject: "Access Granted: Staff Account Credentials",
  html: `
    <div style="${baseStyle}">
      <h2 style="color: #1a4731;">Welcome to the Team!</h2>
      <p>A staff account has been created for you. You can now access the management dashboard to coordinate matches and oversee the community.</p>

      <div style="background: #f8fafc; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0;">
        <table style="width: 100%; font-size: 14px;">
          <tr><td style="color: #64748b; padding-bottom: 5px;">Username:</td><td style="font-weight: bold; padding-bottom: 5px;">${username}</td></tr>
          <tr><td style="color: #64748b; padding-bottom: 5px;">Email:</td><td style="font-weight: bold; padding-bottom: 5px;">${email}</td></tr>
          <tr><td style="color: #64748b;">Password:</td><td style="font-weight: bold; color: #1a4731;">${password}</td></tr>
        </table>
      </div>

      ${footer}
    </div>
  `
});
